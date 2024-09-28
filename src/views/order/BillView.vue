<template>
  <div
    class="h-[35dvh] bg-primary-100 space-y-4 p-4 flex flex-col justify-center"
    :class="{
      'bg-red-100': type === 'FAILED',
      'bg-yellow-100': type === 'PENDING',
    }"
  >
    <div class="flex justify-center">
      <CircleCheckBig
        v-if="type === 'SUCCESS'"
        size="150"
        stroke-width="0.7"
        class="w-32 lg:w-40 text-green-600"
      />
      <CircleX
        v-else-if="type === 'FAILED'"
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
      21 Agustus 2024, 18:07:12
    </div>
  </div>
  <div
    class="mx-2 lg:mx-28 my-4 space-y-4 p-4 flex flex-col justify-center font-helvetica-light text-xs lg:text-base"
  >
    <div class="flex justify-between font-helvetica font-bold">
      <div>Nomor Order</div>
      <div>{{ orderNumber }}</div>
    </div>
    <div class="flex justify-between">
      <div>Kasir</div>
      <div>{{ cashier }}</div>
    </div>
    <hr class="my-2" />
    <div class="flex justify-between font-bold">
      <div>Barang</div>
      <div class="flex justify-between w-5/12 lg:w-1/4">
        <div>Jumlah</div>
        <div>Harga</div>
      </div>
    </div>
    <div v-for="item in items" :key="item.name" class="flex justify-between">
      <div>{{ item.name }}</div>
      <div class="flex justify-between w-5/12 lg:w-1/4">
        <div>{{ item.amount }}</div>
        <div>{{ $helpers.money(item.price) }}</div>
      </div>
    </div>
    <hr class="my-2" />
    <div class="flex justify-between">
      <div>Subtotal</div>
      <div>{{ $helpers.money(subtotal) }}</div>
    </div>
    <div class="flex justify-between">
      <div>Diskon</div>
      <div>{{ $helpers.money(discount) }}</div>
    </div>
    <div class="flex justify-between">
      <div>Pajak</div>
      <div class="flex justify-between w-5/12 lg:w-1/4">
        <div>10%</div>
        <div>{{ $helpers.money(tax) }}</div>
      </div>
    </div>
    <div class="flex justify-between">
      <div>Total</div>
      <div class="flex justify-between w-5/12 lg:w-1/4">
        <div>{{ quantity }} barang</div>
        <div class="font-helvetica font-bold">{{ $helpers.money(total) }}</div>
      </div>
    </div>
    <hr class="my-2" />
    <div class="flex justify-between">
      <div>Metode Pembayaran</div>
      <div>{{ paymentMethod }}</div>
    </div>
    <div v-if="type === 'SUCCESS'" class="flex justify-between">
      <div>Total Yang Dibayar</div>
      <div class="font-helvetica font-bold">
        {{ $helpers.money(amountPaid) }}
      </div>
    </div>
    <div v-if="type === 'SUCCESS'" class="flex justify-between">
      <div>Kembalian</div>
      <div>{{ $helpers.money(change) }}</div>
    </div>
  </div>
</template>

<script setup>
import { CircleCheckBig, CircleX, CircleEllipsis } from "lucide-vue-next";

const props = defineProps({
  type: {
    type: String,
    default: "FAILED",
  },
  datetime: {
    type: String,
    default: "21 Agustus 2024, 18:07:12",
  },
  orderNumber: {
    type: String,
    default: "",
  },
  cashier: {
    type: String,
    default: "",
  },
  items: {
    type: Array,
    default: () => [
      {
        name: "Bur",
        amount: 2,
        price: 10000,
      },
      {
        name: "Ger",
        amount: 1,
        price: 15000,
      },
    ],
  },
  quantity: {
    type: Number,
    default: 0,
  },
  subtotal: {
    type: Number,
    default: 0,
  },
  discount: {
    type: Number,
    default: 0,
  },
  tax: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    default: 0,
  },
  paymentMethod: {
    type: String,
    default: "",
  },
  amountPaid: {
    type: Number,
    default: 0,
  },
  change: {
    type: Number,
    default: 0,
  },
});

const getBillMessage = () => {
  switch (props.type) {
    case "SUCCESS":
      return "Pembayaran Berhasil!";
    case "FAILED":
      return "Pembayaran Gagal!";
    default:
      return "Menunggu Pembayaran...";
  }
};
</script>
