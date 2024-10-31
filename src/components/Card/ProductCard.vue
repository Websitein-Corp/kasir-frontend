<template>
  <div
    class="h-full rounded-lg p-2 lg:p-8 space-y-4 lg:space-y-8 shadow-xl cursor-pointer relative flex flex-col justify-between"
    :class="{ '!border-2 !border-primary-800': selected }"
  >
    <div>
      <div class="h-40 lg:h-64 !mt-0">
        <img
          v-lazy="{ src: imageUrl, loading: './img/imageLoading.svg' }"
          class="w-full h-full object-cover rounded-lg"
        />
      </div>
      <div class="space-y-2 mt-2 lg:mt-6">
        <div class="font-bold text-lg lg:text-2xl">
          {{ name }}
        </div>
        <div class="text-slate-500 text-xs lg:text-base">
          {{ $helpers.money(sellingPrice) }}
        </div>
      </div>
    </div>
    <div class="pt-2 block lg:hidden">
      <NumberInput v-model="amount" @update:model-value="watchAmount = true" />
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
        class="hidden lg:block"
        v-else-if="cart.getItem(sku).type === 'SERVICE TIME'"
      >
        <CalendarClock />
      </span>
      <span v-else>{{ cart.getItem(sku).amount }}x</span>
    </div>
    <div
      class="absolute top-0 left-0 w-full h-full z-10 hidden lg:block"
      @click="
        () => {
          watchAmount = true;
          cart.getItem(sku)
            ? type !== 'SERVICE TIME' && cart.increment(sku)
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

const amount = ref(props.amount);
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
</script>
