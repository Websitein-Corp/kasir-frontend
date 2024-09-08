<template>
  <button
    class="bg-primary-700 hover:bg-primary-800 active:bg-primary-900 p-2 w-80 rounded-lg text-white shadow-xl flex justify-center items-center gap-2 transition-all"
    :class="{
      'w-[200px]': size === 'sm',
      'w-[300px]': size === 'md',
      'w-[400px]': size === 'lg',
      'w-[500px]': size === 'xl',
    }"
    @click="$emit('click')"
  >
    <component v-if="icon && iconSide === 'left'" :is="icon"></component>
    <span>{{ label }}</span>
    <component v-if="icon && iconSide === 'right'" :is="icon"></component>
  </button>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    default: "",
  },
  icon: null,
  iconSide: {
    type: String,
    default: "left",
  },
  size: {
    type: String,
    default: "md",
  },
});

defineEmits(["click"]);
</script>
