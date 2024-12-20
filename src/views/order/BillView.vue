<template>
  <div v-if="!page.loading">
    <div
      class="h-[30dvh] sm:h-64 lg:h-[40dvh] bg-primary-100 space-y-4 p-4 flex flex-col justify-center"
      :class="{
        'bg-red-100': bill.status === 'FAILED',
        'bg-yellow-100': bill.status === 'PENDING',
        'bg-purple-100': bill.status === 'REFUNDED',
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
          v-else-if="bill.status === 'FAILED'"
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
          <div>Total</div>
        </div>
      </div>
      <template v-for="item in bill.details" :key="item.name">
        <div class="flex justify-between">
          <div>{{ item.item_name }}</div>
          <div class="flex justify-between w-5/12 lg:w-1/4">
            <div>{{ item.quantity }}</div>
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
      class="flex justify-center items-center my-4"
    >
      <img :src="bill.payment_url" alt="QRIS" class="w-80 h-80 object-cover" />
    </div>
    <div
      v-if="bill.status === 'SUCCESS'"
      class="flex flex-col justify-center mb-8"
    >
      <CustomButton
        label="Print Receipt"
        size="fit"
        class="bg-primary-400 text-black mx-auto"
        @click="bluetoothReceipt.printReceipt(bill)"
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
  amount_paid: 0,
  change: 0,
});

onMounted(async () => {
  page.loading = true;
  page.scroll = 0;

  showBill();
  const bluetooth = await getBluetoothId();

  modal.title = "Bluetooth Receipt Connect";
  modal.icon = Bluetooth;
  modal.body = BluetoothBody;

  bluetoothReceipt.printerStatus = "WAITING...";
  await bluetoothReceipt.reconnect(bluetooth);
});
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

const getBillMessage = () => {
  switch (bill.value.status) {
    case "SUCCESS":
      return "Pembayaran Berhasil!";
    case "FAILED":
      return "Pembayaran Gagal!";
    case "REFUNDED":
      return "Pembayaran Berhasil Dikembalikan!";
    default:
      return "Menunggu Pembayaran...";
  }
};
</script>
