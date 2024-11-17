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
      <div class="font-bold text-base lg:text-2xl">
        {{ name }}
      </div>
      <div class="text-slate-500 text-sm lg:text-base">
        {{ sellingPrice }}
      </div>
      <div class="pt-2">
        <DatetimeInput
          v-if="type === 'SERVICE TIME'"
          v-model="serviceRange"
          :disabled="page.order.step === 2"
          border="primary"
          range
          time-picker
        />
        <NumberInput
          v-else
          v-model="amount"
          :disabled="page.order.step === 2"
        />
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
import { ref, toRef, watch } from "vue";
import usePage from "@/stores/usePage";
import DatetimeInput from "@/components/Input/DatetimeInput.vue";

const props = defineProps({
  sku: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "",
  },
  sellingPrice: {
    type: String,
    default: "",
  },
  imageUrl: {
    type: String,
    default: "",
  },
  amount: {
    type: Number,
    default: 1,
  },
  serviceStart: {
    type: String,
    default: "",
  },
  serviceEnd: {
    type: String,
    default: "",
  },
});

const cart = useCart();
const page = usePage();

const amount = toRef(props.amount);
const serviceRange = ref(
  props.serviceStart && props.serviceEnd
    ? [new Date(props.serviceStart), new Date(props.serviceEnd)]
    : null
);

watch(amount, () => {
  cart.getItem(props.sku).amount = amount.value;
});

watch(
  () => props.amount,
  () => {
    amount.value = props.amount;
  }
);

watch(serviceRange, () => {
  if (serviceRange.value) {
    cart.setServiceTime(props.sku, serviceRange.value);
  }
});
</script>
