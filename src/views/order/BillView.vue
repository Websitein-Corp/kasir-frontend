<template>
  <div v-if="!page.loading">
    <div
      class="h-[30dvh] sm:h-64 lg:h-[40dvh] bg-primary-100 space-y-4 p-4 flex flex-col justify-center"
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
          class="w-32 h-32 lg:w-40 lg:h-40 text-green-600"
        />
        <CircleX
          v-else-if="bill.type === 'FAILED'"
          size="150"
          stroke-width="0.7"
          class="w-32 h-32 lg:w-40 lg:h-40 text-red-600"
        />
        <CircleEllipsis
          v-else
          size="150"
          stroke-width="0.7"
          class="w-32 h-32 lg:w-40 lg:h-40 text-yellow-600"
        />
      </div>
      <div
        class="flex justify-center font-bold text-base sm:text-lg lg:text-3xl"
      >
        {{ getBillMessage() }}
      </div>
      <div
        class="flex justify-center font-helvetica-light text-xs sm:text-sm lg:text-xl"
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
    <div class="flex">
      <CustomButton
        label="Print"
        size="fit"
        class="bg-primary-400 text-black"
        @click="handleConnectButtonClick"
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
import { axios } from "@/sdk/axios";
import useToast from "@/stores/useToast";
import useAuth from "@/stores/useAuth";
import { useRoute } from "vue-router";
import DefaultSkeleton from "@/components/Skeleton/DefaultSkeleton.vue";
import CustomButton from "@/components/Button/CustomButton.vue";
import BluetoothPrinterService from "@/assets/lib/BluetoothPrinterService";
import usePage from "@/stores/usePage";

const auth = useAuth();
const page = usePage();
const toast = useToast();
const route = useRoute();
const receiptPrinter = ref(null);
const lastUsedDevice = ref(null);
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
    },
    {
      item_name: "Ger",
      quantity: 1,
      price: 15000,
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
  page.loading = true;

  showBill();

  try {
    if (!receiptPrinter.value) {
      receiptPrinter.value = new BluetoothPrinterService();
    }

    // Attempt to reconnect to the last used device
    await receiptPrinter.value.reconnect(lastUsedDevice.value);

    receiptPrinter.value.addEventListener("connected", (device) => {
      console.log(`Connected to ${device.name} (#${device.id})`);

      lastUsedDevice.value = device; // Store device for reconnecting
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
    .then((device) => {
      console.log("Connected to printer:", device);
      lastUsedDevice.value = device; // Store for future reconnection

      device.addEventListener("gattserverdisconnected", handleDisconnect);
    })
    .catch((err) => {
      console.error("Error connecting to printer:", err);
      error.value = err.toString();
    });
}

function handleDisconnect() {
  console.log("Printer disconnected");
  receiptPrinter.value.disconnect();
}

function printReceipt() {
  try {
    if (!receiptPrinter.value) {
      throw new Error("Printer is not connected");
    }

    const encoder = new ReceiptPrinterEncoder({ language: "esc-pos" });
    const data = encoder
      .initialize()
      .text("The quick brown fox jumps over the lazy dog")
      .newline()
      .qrcode("https://nielsleenheer.com")
      .encode();

    receiptPrinter.value.print(data);
  } catch (exception) {
    console.log("Error printing receipt:", exception);
    error.value = exception.toString();
  }
}

const showBill = () => {
  axios
    .get(
      `${process.env.VUE_APP_API_BASE_URL}/api/checkout/receipt?ref_id=${props.invoiceNumber}&shop_id=${auth.shopId}`,
      {
        headers: {
          Authorization: `Bearer ${auth.authToken}`,
        },
        withCredentials: true,
      }
    )
    .then(({ data }) => {
      if (data["error_type"]) {
        toast.message = "Gagal";
        toast.description = data.message;
        toast.type = "FAILED";
        toast.trigger();
      }

      bill.value = data.data;
      bill.value["type"] = "SUCCESS";
    });
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
