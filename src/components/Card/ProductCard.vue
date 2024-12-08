<template>
  <div
    class="h-full rounded-lg p-2 lg:p-8 space-y-4 lg:space-y-8 shadow-xl cursor-pointer relative flex flex-col justify-between"
    :class="{ '!border-2 !border-primary-800': selected }"
  >
    <div>
      <div class="h-40 lg:h-64 !mt-0">
        <img
          v-lazy="{
            src: imageUrl,
            loading: './img/imageLoading.svg',
            error: './img/imageLoading.svg',
          }"
          class="w-full h-full object-cover object-center rounded-lg"
        />
      </div>
      <div class="space-y-2 mt-2 lg:mt-6">
        <div
          class="font-bold text-lg lg:text-xl whitespace-nowrap overflow-hidden text-ellipsis"
        >
          {{ name }}
        </div>
        <div class="text-slate-500 text-xs lg:text-base">
          {{ sellingPrice }}
        </div>
      </div>
    </div>
    <div
      class="pt-2 block lg:hidden opacity-0"
      :class="{
        '!opacity-100': cart.getItem(sku),
      }"
    >
      <DatetimeRangeInput
        v-if="type === 'SERVICE TIME'"
        :datetime-range="serviceRange"
        @click="openDatetimeInputModal"
      />
      <NumberInput
        v-else
        v-model="amount"
        @update:model-value="watchAmount = true"
      />
    </div>
    <div
      v-if="cart.getItem(sku)"
      class="absolute bottom-1 right-4 font-bold text-xl"
    >
      <span class="block lg:hidden" v-if="cart.getItem(sku).amount > 0">
        <button class="cursor-pointer" @click="cart.clear(sku)">
          <Trash2 />
        </button>
      </span>
      <span
        class="hidden lg:block lg:mb-2"
        v-else-if="cart.getItem(sku).type === 'SERVICE TIME'"
      >
        <CalendarClock />
      </span>
      <span v-else>{{ cart.getItem(sku).amount }}x</span>
    </div>
    <div
      :class="{
        'hidden lg:block': cart.getItem(sku),
      }"
      class="absolute top-0 left-0 w-full h-full z-10"
      @click="
        () => {
          watchAmount = true;
          cart.getItem(sku)
            ? type !== 'SERVICE TIME' && cart.increment(sku)
            : type === 'SERVICE TIME'
            ? openDatetimeInputModal()
            : cart.add(sku, name, type, sellingPrice, imageUrl);
        }
      "
    />
  </div>
</template>

<script setup>
import NumberInput from "@/components/Input/NumberInput.vue";
import { ref, watch } from "vue";
import useCart from "@/stores/useCart";
import { CalendarClock, Trash2 } from "lucide-vue-next";
import DatetimeBody from "@/components/Modal/Body/DatetimeBody.vue";
import DatetimeRangeInput from "@/components/Input/DatetimeRangeInput.vue";
import useModal from "@/stores/useModal";

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
  amount: {
    type: Number,
    default: 0,
  },
  serviceStart: {
    type: String,
    default: null,
  },
  serviceEnd: {
    type: String,
    default: null,
  },
  sellingPrice: null,
  imageUrl: {
    type: String,
    default: "",
  },
  enableInput: {
    type: Boolean,
    default: false,
  },
  selected: {
    type: Boolean,
    default: false,
  },
});

const cart = useCart();
const modal = useModal();

const amount = ref(props.amount);
const serviceRange = ref(
  props.serviceStart && props.serviceEnd
    ? [props.serviceStart, props.serviceEnd]
    : null
);
const watchAmount = ref(false);

watch(amount, (newVal, oldVal) => {
  if (watchAmount.value) {
    if (oldVal === 0 && newVal === 1) {
      cart.add(
        props.sku,
        props.name,
        props.type,
        props.sellingPrice,
        props.imageUrl
      );
    }
    if (oldVal === 1 && newVal === 0) {
      cart.clear(props.sku);
    } else {
      const item = cart.getItem(props.sku);

      if (item) {
        item.amount = amount.value;
        cart.itemsChanged = true;
      }
    }

    watchAmount.value = false;
  }
});

watch(
  () => cart.items,
  () => {
    const item = cart.getItem(props.sku);

    if (item) {
      if (item.amount === 0) {
        cart.clear(props.sku);
      } else {
        amount.value = item.amount;
      }
    } else {
      amount.value = 0;
    }
  },
  {
    deep: true,
  }
);

const openDatetimeInputModal = () => {
  cart.add(
    props.sku,
    props.name,
    props.type,
    props.sellingPrice,
    props.imageUrl
  );

  const serviceDateRange = cart.getItem(props.sku);
  serviceRange.value = [
    serviceDateRange.service_start,
    serviceDateRange.service_end,
  ];

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

  if (!modal.response) {
    cart.clear(props.sku);
  } else {
    const item = cart.getItem(props.sku);

    if (item) {
      cart.setServiceTime(props.sku, modal.response);
      cart.itemsChanged = true;
    }
  }
};
</script>
