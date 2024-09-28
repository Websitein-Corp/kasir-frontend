<template>
  <div class="rounded-lg p-4 lg:p-8 shadow-xl flex items-center">
    <div class="mr-8" v-if="imageUrl">
      <img
        :src="imageUrl"
        :alt="imageUrl"
        class="w-40 md:w-64 h-28 md:h-40 object-cover rounded-lg"
      />
    </div>
    <div class="space-y-2">
      <div class="font-bold text-2xl">
        {{ name }}
      </div>
      <div class="text-slate-500">
        {{ $helpers.money(sellingPrice) }}
      </div>
      <div class="pt-2">
        <NumberInput v-model="amount" :disabled="page.order.step === 2" />
      </div>
    </div>
    <div v-if="page.order.step < 2" class="ml-auto flex items-center">
      <button class="cursor-pointer" @click="cart.clear(sku)">
        <Trash2 />
      </button>
    </div>
  </div>
</template>

<script setup>
import NumberInput from "@/components/Input/NumberInput.vue";
import { Trash2 } from "lucide-vue-next";
import useCart from "@/stores/useCart";
import { toRef, watch } from "vue";
import usePage from "@/stores/usePage";

const props = defineProps({
  sku: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    default: "",
  },
  sellingPrice: {
    type: Number,
    default: 0,
  },
  imageUrl: {
    type: String,
    default: "",
  },
  amount: {
    type: Number,
    default: 1,
  },
});

const cart = useCart();
const page = usePage();

const amount = toRef(props.amount);

watch(amount, () => {
  cart.getItem(props.sku).amount = amount.value;
});

watch(
  () => props.amount,
  () => {
    amount.value = props.amount;
  }
);
</script>
