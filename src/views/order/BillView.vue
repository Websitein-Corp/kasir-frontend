<template>
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
    <div class="flex justify-center font-helvetica-light text-base lg:text-xl">
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
      <div>{{ bill.subtotal }}</div>
    </div>
    <div class="flex justify-between">
      <div>Diskon</div>
      <div>{{ bill.discount }}</div>
    </div>
    <div class="flex justify-between">
      <div>Pajak</div>
      <div class="flex justify-between w-5/12 lg:w-1/4">
        <div>10%</div>
        <div>{{ bill.tax_fee }}</div>
      </div>
    </div>
    <div class="flex justify-between">
      <div>Total</div>
      <div class="flex justify-between w-5/12 lg:w-1/4">
        <div>{{ bill.total_item }} barang</div>
        <div class="font-helvetica font-bold">{{ bill.total_price }}</div>
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
        {{ bill.amount_paid }}
      </div>
    </div>
    <div v-if="bill.type === 'SUCCESS'" class="flex justify-between">
      <div>Kembalian</div>
      <div>{{ bill.change }}</div>
    </div>
  </div>
</template>

<script setup>
import { CircleCheckBig, CircleX, CircleEllipsis } from "lucide-vue-next";
import { onMounted, ref } from "vue";
import axios from "axios";
import useToast from "@/stores/useToast";
import useAuth from "@/stores/useAuth";

const auth = useAuth();
const toast = useToast();

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
  subtotal: "Rp0,00",
  discount: "Rp0,00",
  tax_fee: "Rp0,00",
  total_price: "Rp0,00",
  payment_method: "",
  amount_paid: "Rp0,00",
  change: "Rp0,00",
});

onMounted(async () => {
  await showBill();
});

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
