<template>
  <div
    class="h-80 md:h-fit rounded-lg p-4 lg:p-8 space-y-4 lg:space-y-8 shadow-xl cursor-pointer relative"
    :class="{ 'border-2 border-primary-800': selected }"
  >
    <div
      class="absolute top-0 left-0 w-full h-full z-10 hidden lg:block"
      @click="
        () => {
          watchAmount = true;
          cart.getItem(title)
            ? cart.increment(title)
            : cart.add(title, price, image);
        }
      "
    />
    <div class="h-40 md:h-64">
      <img
        v-lazy="{ src: image, loading: './img/imageLoading.svg' }"
        class="w-full h-full object-cover rounded-lg"
      />
    </div>
    <div class="space-y-2">
      <div class="font-bold text-lg md:text-2xl">
        {{ title }}
      </div>
      <div class="text-slate-500 text-xs md:text-base">
        {{ $helpers.money(price) }}
      </div>
      <div class="pt-2 block md:hidden">
        <NumberInput
          v-model="amount"
          @update:model-value="watchAmount = true"
        />
      </div>
    </div>
    <div
      v-if="cart.getItem(title)"
      class="absolute bottom-3 right-4 font-bold text-xl hidden lg:block"
    >
      {{ cart.getItem(title).amount }}x
    </div>
  </div>
</template>

<script setup>
import NumberInput from "@/components/Input/NumberInput.vue";
import { ref, watch } from "vue";
import useCart from "@/stores/useCart";

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  price: {
    type: Number,
    default: 0,
  },
  image: {
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

const amount = ref(0);
const watchAmount = ref(false);

watch(amount, (newVal, oldVal) => {
  if (watchAmount.value) {
    if (oldVal === 0 && newVal === 1) {
      cart.add(props.title, props.price, props.image);
    }
    if (oldVal === 1 && newVal === 0) {
      cart.clear(props.title);
    } else {
      const item = cart.getItem(props.title);

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
    const item = cart.getItem(props.title);

    if (item) {
      if (item.amount === 0) {
        cart.clear(props.title);
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
