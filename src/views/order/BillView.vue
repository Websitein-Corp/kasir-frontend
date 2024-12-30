<template>
  <div v-if="!page.loading">
    <div
      class="h-[30dvh] sm:h-64 lg:h-[40dvh] bg-primary-100 space-y-2 lg:space-y-4 p-4 flex flex-col justify-center"
      :class="{
        '!bg-red-100': bill.status === 'FAILED',
        '!bg-orange-100': bill.status === 'EXPIRED',
        '!bg-yellow-100': bill.status === 'PENDING',
        '!bg-purple-100': bill.status === 'REFUNDED',
      }"
    >
      <div class="flex justify-center">
        <CircleCheckBig
          v-if="bill.status === 'SUCCESS' || bill.status === 'REFUNDED'"
          size="150"
          stroke-width="0.7"
          class="w-32 h-32 lg:w-40 lg:h-40 text-green-600"
          :class="{
            'text-green-600': bill.status === 'SUCCESS',
            'text-purple-600': bill.status === 'REFUNDED',
          }"
        />
        <CircleX
          v-else-if="bill.status === 'FAILED' || bill.status === 'EXPIRED'"
          size="150"
          stroke-width="0.7"
          class="w-32 h-32 lg:w-40 lg:h-40"
          :class="{
            'text-red-600': bill.status === 'FAILED',
            'text-orange-600': bill.status === 'EXPIRED',
          }"
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
        {{ getBillMessage(bill.status) }}
      </div>
      <div
        class="flex justify-center font-helvetica-light text-xs sm:text-sm lg:text-xl"
      >
        {{ bill.tr_datetime }}
      </div>
      <div
        v-if="paymentTimeLeft"
        class="flex justify-center items-center font-helvetica text-xs sm:text-sm lg:text-xl font-bold"
      >
        <Timer class="mr-2 mb-1" />
        Batas waktu bayar
        <div class="ml-2 text-red-500">{{ paymentTimeLeft }}</div>
      </div>
    </div>
    <div
      class="mx-2 lg:mx-12 xl:mx-28 my-4 space-y-4 p-4 flex flex-col justify-center font-helvetica-light text-xs lg:text-base"
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
          <div>Total</div>
        </div>
      </div>
      <template v-for="item in bill.details" :key="item.name">
        <div class="flex justify-between">
          <div>{{ item.item_name }}</div>
          <div class="flex justify-between w-5/12 lg:w-1/4">
            <div>{{ item.quantity }} x</div>
            <div>@ {{ $helpers.money(item.price) }}</div>
          </div>
        </div>
        <div class="flex justify-end leading-[0.2rem]">
          {{ $helpers.money(item.total_price) }}
        </div>
      </template>
      <hr class="my-2" />
      <div class="flex justify-between">
        <div>Subtotal</div>
        <div>{{ $helpers.money(bill.subtotal) }}</div>
      </div>
      <div class="flex justify-between">
        <div>Diskon</div>
        <div>{{ $helpers.money(bill.discount) }}</div>
      </div>
      <div
        class="flex justify-between"
        v-if="bill.tax_fee || cart.settings.tax_amount !== 0.0"
      >
        <div>Pajak</div>
        <div class="flex justify-between w-5/12 lg:w-1/4">
          <div>
            {{ (bill.tax_fee / (bill.subtotal - bill.discount)) * 100 }}%
          </div>
          <div>{{ $helpers.money(bill.tax_fee) }}</div>
        </div>
      </div>
      <div
        class="flex justify-between"
        v-if="bill.payment_fee || !cart.settings.shop_payment_fee"
      >
        <div>Biaya Admin</div>
        <div>{{ $helpers.money(bill.payment_fee) }}</div>
      </div>
      <div class="flex justify-between">
        <div>Total</div>
        <div class="flex justify-between w-5/12 lg:w-1/4">
          <div>{{ bill.total_item }} x</div>
          <div class="font-helvetica font-bold">
            {{ $helpers.money(bill.final_price) }}
          </div>
        </div>
      </div>
      <hr class="my-2" />
      <div class="flex justify-between">
        <div>Metode Pembayaran</div>
        <div>{{ bill.payment_method }}</div>
      </div>
      <div v-if="bill.status === 'SUCCESS'" class="flex justify-between">
        <div>Total Yang Dibayar</div>
        <div class="font-helvetica font-bold">
          {{ $helpers.money(bill.amount_paid) }}
        </div>
      </div>
      <div v-if="bill.status === 'SUCCESS'" class="flex justify-between">
        <div>Kembalian</div>
        <div>{{ $helpers.money(bill.change) }}</div>
      </div>
    </div>
    <div
      v-if="bill.status === 'PENDING'"
      class="flex flex-col justify-center items-center my-4"
    >
      <img :src="bill.payment_url" alt="QRIS" class="w-80 h-80 object-cover" />
      <div class="flex justify-center mt-4">
        <CustomButton
          size="md"
          label="Check Status"
          class="bg-primary-700 hover:bg-primary-800"
          :loading="page.buttonLoading"
          @click="checkStatus"
        />
      </div>
    </div>
    <div
      v-if="bill.status === 'SUCCESS'"
      class="flex flex-col justify-center items-center mb-8"
    >
      <CustomButton
        label="Cetak Struk"
        size="fit"
        :icon="Printer"
        class="bg-primary-700 hover:bg-primary-800"
        @click="handlePrinter"
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
import {
  CircleCheckBig,
  CircleX,
  CircleEllipsis,
  Bluetooth,
  Timer,
  Printer,
} from "lucide-vue-next";
import { onMounted, ref } from "vue";
import { axios } from "@/sdk/axios";
import useToast from "@/stores/useToast";
import useAuth from "@/stores/useAuth";
import useModal from "@/stores/useModal";
import useBluetoothReceipt from "@/stores/useBluetoothReceipt";
import { useRoute } from "vue-router";
import DefaultSkeleton from "@/components/Skeleton/DefaultSkeleton.vue";
import CustomButton from "@/components/Button/CustomButton.vue";
import BluetoothBody from "@/components/Modal/Body/BluetoothBody.vue";
import usePage from "@/stores/usePage";
import useCart from "@/stores/useCart";

const auth = useAuth();
const page = usePage();
const cart = useCart();
const toast = useToast();
const modal = useModal();
const bluetoothReceipt = useBluetoothReceipt();
const route = useRoute();

const props = defineProps({
  invoiceNumber: {
    type: String,
    default: "",
  },
});

const bill = ref({
  type: "",
  tr_datetime: "",
  cashier: "",
  details: () => [
    {
      item_name: "",
      quantity: 0,
      price: 0,
      total_price: 0,
    },
  ],
  total_item: 0,
  subtotal: 0,
  discount: 0,
  tax_fee: 0,
  total_price: 0,
  payment_method: "",
  payment_fee: 0,
  final_price: 0,
  amount_paid: 0,
  expired_at: null,
  change: 0,
});

const paymentTimeLeft = ref();
const bluetoothId = ref();

onMounted(async () => {
  page.loading = true;
  page.scroll = 0;

  showBill();

  modal.props = bill.value;
  bluetoothId.value = await getBluetoothId();

  bluetoothReceipt.printerStatus = "WAITING...";
  await bluetoothReceipt.reconnect(bluetoothId.value);
});

const handlePrinter = async () => {
  modal.title = "Sambungkan Bluetooth Printer";
  modal.icon = Bluetooth;
  modal.body = BluetoothBody;
  modal.open();

  await bluetoothReceipt.reconnect(bluetoothId.value);
};

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

      if (data.data.status === "PENDING") {
        handleCountDown();
      } else {
        paymentTimeLeft.value = null;
      }
    });
};

const checkStatus = () => {
  page.buttonLoading = true;

  axios
    .get(
      `${process.env.VUE_APP_API_BASE_URL}/api/payment/status?invoice_number=${props.invoiceNumber}&shop_id=${auth.shopId}`,
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
      } else {
        toast.message = "Sukses";
        toast.description = `Status: ${getBillMessage(data.data.status)}`;
        toast.type = "SUCCESS";
        toast.trigger();

        showBill(data.data.ref_id);
      }
    });
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
    status: data.data.status,
    device_id: data.data.bluetooth ? data.data.bluetooth.device_id : null,
  };
};

const getBillMessage = (status) => {
  switch (status) {
    case "SUCCESS":
      return "Pembayaran Berhasil!";
    case "FAILED":
      return "Pembayaran Gagal!";
    case "EXPIRED":
      return "Pembayaran Kedaluwarsa!";
    case "REFUNDED":
      return "Pembayaran Berhasil Dikembalikan!";
    default:
      return "Menunggu Pembayaran...";
  }
};

let countdownInterval;

const handleCountDown = () => {
  const expiredTime = new Date(bill.value.expired_at.replace(" ", "T"));

  if (new Date() > expiredTime) {
    bill.value.status = "EXPIRED";
    paymentTimeLeft.value = null;

    return;
  }

  updateCountdown(expiredTime);
  countdownInterval = setInterval(() => updateCountdown(expiredTime), 1000);
};

const updateCountdown = (expiredTime) => {
  const currentTime = new Date();

  const timeDifference = expiredTime - currentTime;
  if (timeDifference <= 0) {
    bill.value.status = "EXPIRED";
    paymentTimeLeft.value = null;

    toast.message = "Gagal";
    toast.description = "Pembayaran kedaluwarsa!";
    toast.type = "FAILED";
    toast.trigger();

    clearInterval(countdownInterval);
  } else {
    const hours = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    paymentTimeLeft.value = `${padZero(hours)}:${padZero(minutes)}:${padZero(
      seconds
    )}`;
  }
};

const padZero = (num) => {
  return num.toString().padStart(2, "0");
};
</script>
