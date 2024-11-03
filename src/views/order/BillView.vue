<template>
  <div v-if="auth.isAuthenticated">
    <div
      class="h-[35dvh] bg-primary-100 space-y-4 p-4 flex flex-col justify-center"
      :class="{
        'bg-red-100': bill.type === 'FAILED',
        'bg-yellow-100': bill.type === 'PENDING',
      }"
    >
      <div class="flex justify-center">
        <CircleCheckBig
          v-if="bill.type === 'SUCCESS'"
          size="150"
          stroke-width="0.7"
          class="w-32 lg:w-40 text-green-600"
        />
        <CircleX
          v-else-if="bill.type === 'FAILED'"
          size="150"
          stroke-width="0.7"
          class="w-32 lg:w-40 text-red-600"
        />
        <CircleEllipsis
          v-else
          size="150"
          stroke-width="0.7"
          class="w-32 lg:w-40 text-yellow-600"
        />
      </div>
      <div class="flex justify-center font-bold text-xl lg:text-3xl">
        {{ getBillMessage() }}
      </div>
      <div
        class="flex justify-center font-helvetica-light text-base lg:text-xl"
      >
        {{ bill.tr_datetime }}
      </div>
    </div>
    <div
      class="mx-2 lg:mx-28 my-4 space-y-4 p-4 flex flex-col justify-center font-helvetica-light text-xs lg:text-base"
    >
      <div class="flex justify-between font-helvetica font-bold">
        <div>Nomor Order</div>
        <div>{{ bill.invoice_number }}</div>
      </div>
      <div class="flex justify-between">
        <div>Kasir</div>
        <div>{{ bill.cashier }}</div>
      </div>
      <hr class="my-2" />
      <div class="flex justify-between font-bold">
        <div>Barang</div>
        <div class="flex justify-between w-5/12 lg:w-1/4">
          <div>Jumlah</div>
          <div>Harga</div>
          <div>Total</div>
        </div>
      </div>
      <div
        v-for="item in bill.details"
        :key="item.name"
        class="flex justify-between"
      >
        <div>{{ item.item_name }}</div>
        <div class="flex justify-between w-5/12 lg:w-1/4">
          <div>{{ item.quantity }}</div>
          <div>{{ $helpers.money(item.price) }}</div>
          <div>{{ $helpers.money(item.total_price) }}</div>
        </div>
      </div>
      <hr class="my-2" />
      <div class="flex justify-between">
        <div>Subtotal</div>
        <div>{{ $helpers.money(bill.subtotal) }}</div>
      </div>
      <div class="flex justify-between">
        <div>Diskon</div>
        <div>{{ $helpers.money(bill.discount) }}</div>
      </div>
      <div class="flex justify-between">
        <div>Pajak</div>
        <div class="flex justify-between w-5/12 lg:w-1/4">
          <div>10%</div>
          <div>{{ $helpers.money(bill.tax_fee) }}</div>
        </div>
      </div>
      <div class="flex justify-between">
        <div>Total</div>
        <div class="flex justify-between w-5/12 lg:w-1/4">
          <div>{{ bill.total_item }} barang</div>
          <div class="font-helvetica font-bold">
            {{ $helpers.money(bill.total_price) }}
          </div>
        </div>
      </div>
      <hr class="my-2" />
      <div class="flex justify-between">
        <div>Metode Pembayaran</div>
        <div>{{ bill.payment_method }}</div>
      </div>
      <div v-if="bill.type === 'SUCCESS'" class="flex justify-between">
        <div>Total Yang Dibayar</div>
        <div class="font-helvetica font-bold">
          {{ $helpers.money(bill.amount_paid) }}
        </div>
      </div>
      <div v-if="bill.type === 'SUCCESS'" class="flex justify-between">
        <div>Kembalian</div>
        <div>{{ $helpers.money(bill.change) }}</div>
      </div>
    </div>
    <div>Printer Status: {{printerStatus}}</div>
    <div class="flex">
      <CustomButton
        label="Connect"
        size="fit"
        class="bg-primary-400 text-black"
        @click="handleConnectButtonClick"
      />
      <CustomButton
        label="Print"
        size="fit"
        class="bg-primary-400 text-black"
        @click="printReceipt"
      />
      <CustomButton
        label="Disconnect"
        size="fit"
        class="bg-red-400 text-white"
        @click="handleDisconnect"
      />
    </div>
  </div>
  <div v-else>
    <DefaultSkeleton class="mb-2" />
    <DefaultSkeleton class="mb-2" />
    <DefaultSkeleton class="mb-2" />
  </div>
</template>

<script setup>
import { CircleCheckBig, CircleX, CircleEllipsis } from "lucide-vue-next";
import { onMounted, ref } from "vue";
import axios from "axios";
import useToast from "@/stores/useToast";
import useAuth from "@/stores/useAuth";
import { useRoute } from "vue-router";
import DefaultSkeleton from "@/components/Skeleton/DefaultSkeleton.vue";
import CustomButton from "@/components/Button/CustomButton.vue";
import BluetoothPrinterService from "@/assets/lib/BluetoothPrinterService";
import ReceiptPrinterEncoder from "@/assets/lib/receipt-printer-encoder.esm";
import helpers from "@/helpers";

const auth = useAuth();
const toast = useToast();
const route = useRoute();
const receiptPrinter = ref(null);
const lastUsedDevice = ref(null);
const printerStatus = ref("WAITING...");
const error = ref("");

const props = defineProps({
  invoiceNumber: {
    type: String,
    default: "",
  },
});

const bill = ref({
  type: "SUCCESS",
  tr_datetime: "21 Agustus 2024, 18:07:12",
  cashier: "",
  details: () => [
    {
      item_name: "Bur",
      quantity: 2,
      price: 10000,
      total_price: 20000,
    },
    {
      item_name: "Ger",
      quantity: 1,
      price: 15000,
      total_price: 15000,
    },
  ],
  total_item: 0,
  subtotal: 0,
  discount: 0,
  tax_fee: 0,
  total_price: 0,
  payment_method: "",
  amount_paid: 0,
  change: 0,
});

onMounted(async () => {
  await auth.checkLoginSession(route);
  await showBill();
  const bluetooth = await getBluetoothId();

  try {
    if (!receiptPrinter.value) {
      receiptPrinter.value = new BluetoothPrinterService();
    }

    await receiptPrinter.value.reconnect({
      id: bluetooth.device_id
    });
    printerStatus.value = bluetooth.status;

    receiptPrinter.value.addEventListener("connected", (device) => {
      console.log(`Connected to ${device.name} (#${device.id})`);

      lastUsedDevice.value = device.id;
    });
  } catch (err) {
    console.error("Error connecting to the printer:", err);
    error.value = err.toString();
  }
});

function handleConnectButtonClick() {
  if (!receiptPrinter.value) {
    try {
      receiptPrinter.value = new BluetoothPrinterService();
    } catch (error) {
      console.error("Error initializing BluetoothPrinterService:", error);
      error.value = error.toString(); // Assuming `error` is a Vue ref to display error messages
    }
  }

  receiptPrinter.value
    .connect()
    .then(async (device) => {
      console.log("Connected to printer:", device);
      await editBluetoothId(device.id);

      device.addEventListener("gattserverdisconnected", handleDisconnect);
    })
    .catch((err) => {
      console.error("Error connecting to printer:", err);
      error.value = err.toString();
    });
}

async function handleDisconnect() {
  console.log("Printer disconnected");
  receiptPrinter.value.disconnect();
  await axios.delete(
      `${process.env.VUE_APP_API_BASE_URL}/api/bluetooth`,
      {
        headers: {
          Authorization: `Bearer ${auth.authToken}`,
        },
        withCredentials: true,
      }
  );
}

function printReceipt() {
  try {
    if (!receiptPrinter.value) {
      throw new Error("Printer is not connected");
    }

    const detailBarang = bill.value.details.flatMap((item, index) => {
      const itemName = `${item.item_name}`;
      const itemTotalPrice = `${helpers.money(item.total_price)}`;
      const itemPrice = `${helpers.money(item.price)}`;
      return [[(encoder) => encoder.bold().text(itemName).bold()], [`${itemPrice} x ${item.quantity}`, itemTotalPrice], ['', '']];
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
        (encoder) => encoder
            .size(2)
            .line(auth.shopName)
            .size(1)
            .line(auth.shopAddress)
      )
      .align("center")
      .text("===============================")
      .encode();

    receiptPrinter.value.print(data);

    data = encoder
      .initialize()
      .align("center")
      .line(bill.value.tr_datetime)
      .line(bill.value.invoice_number)
      .line(bill.value.cashier)
      .line("===============================")
      .newline()
      .encode();

    receiptPrinter.value.print(data);

    data = encoder
        .initialize()
        .table(
            [
              { width: 15, marginRight: 2, align: "left" },
              { width: 15, align: "right" }
            ],
            detailBarang
        )
        .line("===============================")
        .encode();

    receiptPrinter.value.print(data);

    data = encoder
        .initialize()
        .newline()
        .table(
            [
              { width: 15, marginRight: 2, align: "left" },
              { width: 15, align: "right" }
            ],
            [
              [`Total Item: ${bill.value.total_item}`],
              [''],
              ['Subtotal', `${helpers.money(bill.value.subtotal)}`],
              ['Diskon', `${helpers.money(bill.value.discount)}`],
              ['Pajak', `${helpers.money(bill.value.tax_fee)}`],
              [(encoder) => encoder.bold().text('Total').bold(), (encoder) => encoder.bold().text(`${helpers.money(bill.value.total_price)}`).bold()],
            ]
        )
        .align("center")
        .newline()
        .text("Terimakasih sudah berbelanja di " + auth.shopName)
        .newline()
        .newline()
        .newline()
        .encode();

    receiptPrinter.value.print(data);
  } catch (exception) {
    console.log("Error printing receipt:", exception);
    toast.message = "Gagal";
    toast.description = exception.toString();
    toast.type = "FAILED";
    toast.trigger();
  }
}

const showBill = async () => {
  const { data } = await axios.get(
    `${process.env.VUE_APP_API_BASE_URL}/api/checkout/receipt?ref_id=${props.invoiceNumber}&shop_id=${auth.shopId}`,
    {
      headers: {
        Authorization: `Bearer ${auth.authToken}`,
      },
      withCredentials: true,
    }
  );

  if (data["error_type"]) {
    toast.message = "Gagal";
    toast.description = data.message;
    toast.type = "FAILED";
    toast.trigger();
  }

  bill.value = data.data;
  bill.value["type"] = "SUCCESS";
};

const getBluetoothId = async () => {
  const { data } = await axios.get(
      `${process.env.VUE_APP_API_BASE_URL}/api/bluetooth`,
      {
        headers: {
          Authorization: `Bearer ${auth.authToken}`,
        },
        withCredentials: true,
      }
  );

  if (data["error_type"]) {
    toast.message = "Gagal";
    toast.description = data.message;
    toast.type = "FAILED";
    toast.trigger();
  }

  return {
      'status': data.data.status,
      'device_id': data.data.bluetooth ? data.data.bluetooth.device_id : null,
  };
};

const editBluetoothId = async (id) => {
  const { data } = await axios.post(
      `${process.env.VUE_APP_API_BASE_URL}/api/bluetooth`,
      {
        device_id: id
      },
      {
        headers: {
          Authorization: `Bearer ${auth.authToken}`,
        },
        withCredentials: true,
      }
  );

  if (data["error_type"]) {
    toast.message = "Gagal";
    toast.description = data.message;
    toast.type = "FAILED";
    toast.trigger();
  }

  lastUsedDevice.value = data.data.bluetooth ? data.data.bluetooth.device_id : null;
  printerStatus.value = data.data.status;
};

const getBillMessage = () => {
  switch (bill.value.type) {
    case "SUCCESS":
      return "Pembayaran Berhasil!";
    case "FAILED":
      return "Pembayaran Gagal!";
    default:
      return "Menunggu Pembayaran...";
  }
};
</script>
