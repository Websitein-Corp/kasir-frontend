<template>
  <button v-bind="$attrs" :class="computedClass">
    <slot />
  </button>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  color: {
    type: String,
    default: "primary",
  },
});

const computedClass = computed(() => {
  const baseClass = "py-2 px-12 rounded shadow transition-colors duration-300";
  const variantClass = {
    primary: "bg-primary-700 text-white hover:bg-primary-800",
    secondary: "bg-gray-500 text-white hover:bg-gray-600",
    danger: "bg-red-500 text-white hover:bg-red-600",
  }[props.color];
  return `${baseClass} ${variantClass} ${props.customClass}`;
});
</script>
