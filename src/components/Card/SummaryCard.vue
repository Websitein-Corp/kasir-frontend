<template>
  <div class="rounded-lg p-4 lg:p-8 shadow-xl flex items-center">
    <div class="mr-8" v-if="imageUrl">
      <img
        v-lazy="{
          src: imageUrl,
          loading: './img/imageLoading.svg',
          error: './img/imageLoading.svg',
        }"
        class="w-40 md:w-64 h-28 md:h-52 object-cover rounded-lg"
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
        <DatetimeRangeInput
          v-if="type === 'SERVICE TIME'"
          :disabled="page.order.step === 2"
          :datetime-range="serviceRange"
          @click="openDatetimeInputModal"
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
import { CalendarClock, Trash2 } from "lucide-vue-next";
import useCart from "@/stores/useCart";
import { ref, toRef, watch } from "vue";
import usePage from "@/stores/usePage";
import DatetimeBody from "@/components/Modal/Body/DatetimeBody.vue";
import useModal from "@/stores/useModal";
import DatetimeRangeInput from "@/components/Input/DatetimeRangeInput.vue";

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
const modal = useModal();

const amount = toRef(props.amount);
const serviceRange = ref(
  props.serviceStart && props.serviceEnd
    ? [props.serviceStart, props.serviceEnd]
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

const openDatetimeInputModal = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  modal.title = "Atur Durasi";
  modal.icon = CalendarClock;
  modal.props = {
    serviceStart: props.serviceStart,
    serviceEnd: props.serviceEnd,
    minDate: yesterday.toISOString(),
  };
  modal.body = DatetimeBody;
  modal.callback = handleDatetimeInput;
  modal.open();
};

const handleDatetimeInput = () => {
  serviceRange.value = modal.response;
};
</script>
