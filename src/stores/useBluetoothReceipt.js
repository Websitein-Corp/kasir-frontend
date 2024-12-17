import { defineStore } from "pinia";
import axios from "axios";
import BluetoothPrinterService from "@/assets/lib/BluetoothPrinterService";
import ReceiptPrinterEncoder from "@/assets/lib/receipt-printer-encoder.esm";
import helpers from "@/helpers";
import useToast from "@/stores/useToast";
import useAuth from "@/stores/useAuth";
import useModal from "@/stores/useModal";

export default defineStore("bluetoothReceipt", {
  state: () => ({
    receiptPrinter: localStorage.getItem("receipt_printer"),
    printerStatus: localStorage.getItem("printer_status"),
    error: localStorage.getItem("printer_error"),
    lastUsedDevice: localStorage.getItem("last_used_device"),
    toast: useToast(),
    auth: useAuth(),
    modal: useModal(),
  }),

  actions: {
    async reconnect(bluetooth) {
      try {
        if (!this.receiptPrinter) {
          this.receiptPrinter = new BluetoothPrinterService();
        }

        await this.receiptPrinter.reconnect({
          id: bluetooth.device_id,
        });
        this.printerStatus = bluetooth.status;

        this.receiptPrinter.addEventListener("connected", (device) => {
          console.log(`Connected to ${device.name} (#${device.id})`);
        });
      } catch (err) {
        console.error("Error connecting to the printer:", err);
        this.error = err.toString();
      }
    },

    handleConnectButtonClick() {
      if (!this.receiptPrinter) {
        try {
          this.receiptPrinter = new BluetoothPrinterService();
        } catch (error) {
          console.error("Error initializing BluetoothPrinterService:", error);
          this.error = error.toString();
        }
      }

      this.receiptPrinter
        .connect()
        .then(async (device) => {
          console.log("Connected to printer:", device);
          await this.editBluetoothId(device.id);

          device.addEventListener(
            "gattserverdisconnected",
            this.handleDisconnect
          );

          this.modal.close();
        })
        .catch((err) => {
          console.error("Error connecting to printer:", err);
          this.error = err.toString();

          if (!this.error.includes("cancelled")) {
            this.toast.message = "Gagal";
            this.toast.description =
              "Perangkat sedang digunakan. Mohon putuskan printer dengan perangkat yang masih tersambung terlebih dahulu.";
            this.toast.type = "FAILED";
            this.toast.trigger();
          }
        });
    },

    async handleDisconnect() {
      console.log("Printer disconnected");
      this.receiptPrinter.disconnect();
      await axios.delete(`${process.env.VUE_APP_API_BASE_URL}/api/bluetooth`, {
        headers: {
          Authorization: `Bearer ${this.auth.authToken}`,
        },
        withCredentials: true,
      });
    },

    async editBluetoothId(id) {
      const { data } = await axios.post(
        `${process.env.VUE_APP_API_BASE_URL}/api/bluetooth`,
        {
          device_id: id,
        },
        {
          headers: {
            Authorization: `Bearer ${this.auth.authToken}`,
          },
          withCredentials: true,
        }
      );

      if (data["error_type"]) {
        this.toast.message = "Gagal";
        this.toast.description = data.message;
        this.toast.type = "FAILED";
        this.toast.trigger();
      }

      this.lastUsedDevice = data.data.bluetooth
        ? data.data.bluetooth.device_id
        : null;
      this.printerStatus = data.data.status;
    },

    printReceipt(bill) {
      try {
        if (!this.receiptPrinter || this.printerStatus === "WAITING...") {
          this.modal.open();
        } else {
          const detailBarang = bill.details.flatMap((item, index) => {
            const itemName = `${item.item_name}`;
            const itemTotalPrice = `${helpers.money(item.total_price)}`;
            const itemPrice = `${helpers.money(item.price)}`;
            return [
              [(encoder) => encoder.bold().text(itemName).bold()],
              [`${itemPrice} x ${item.quantity}`, itemTotalPrice],
              ["", ""],
            ];
          });

          const encoder = new ReceiptPrinterEncoder({
            language: "esc-pos",
            columns: 32,
          });
          let data = encoder
            .initialize()
            .box(
              {
                align: "center",
                style: "double",
              },
              (encoder) =>
                encoder
                  .size(2)
                  .line(this.auth.shopName)
                  .size(1)
                  .line(this.auth.shopAddress)
            )
            .align("center")
            .text("===============================")
            .encode();

          this.receiptPrinter.print(data);

          data = encoder
            .initialize()
            .align("center")
            .box(
              {
                align: "center",
              },
              (encoder) =>
                encoder
                  .line(bill.tr_datetime)
                  .line(bill.invoice_number)
                  .line(bill.cashier)
            )
            .line("===============================")
            .newline()
            .encode();

          this.receiptPrinter.print(data);

          data = encoder
            .initialize()
            .table(
              [
                { width: 15, marginRight: 2, align: "left" },
                { width: 15, align: "right" },
              ],
              detailBarang
            )
            .line("===============================")
            .encode();

          this.receiptPrinter.print(data);

          data = encoder
            .initialize()
            .newline()
            .table(
              [
                { width: 15, marginRight: 2, align: "left" },
                { width: 15, align: "right" },
              ],
              [
                [`Total Item: ${bill.total_item}`],
                [""],
                ["Subtotal", `${helpers.money(bill.subtotal)}`],
                ["Diskon", `(${helpers.money(bill.discount)})`],
                ["Pajak", `${helpers.money(bill.tax_fee)}`],
                [
                  (encoder) => encoder.bold().text("Total").bold(),
                  (encoder) =>
                    encoder
                      .bold()
                      .text(`${helpers.money(bill.total_price)}`)
                      .bold(),
                ],
              ]
            )
            .encode();

          this.receiptPrinter.print(data);

          if (bill.payment_method === "QRIS" && bill.status === "PENDING") {
            data = encoder
              .initialize()
              .newline()
              .qrcode(bill.payment_url)
              .align("center")
              .newline()
              .line("Silakan scan QR diatas untuk membayar menggunakan QRIS")
              .line("===============================")
              .bold()
              .line("**INI BUKAN BUKTI PEMBAYARAN**")
              .text("===============================")
              .newline()
              .newline()
              .newline()
              .encode();

            this.receiptPrinter.print(data);
          } else {
            data = encoder
              .initialize()
              .align("center")
              .newline()
              .text("Terimakasih sudah berbelanja di " + this.auth.shopName)
              .newline()
              .newline()
              .newline()
              .encode();

            this.receiptPrinter.print(data);
          }
        }
      } catch (exception) {
        console.log("Error printing receipt:", exception);
        this.toast.message = "Gagal";
        this.toast.description = exception.toString();
        this.toast.type = "FAILED";
        this.toast.trigger();
      }
    },
  },
});
