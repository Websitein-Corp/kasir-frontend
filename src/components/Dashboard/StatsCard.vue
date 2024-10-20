<template>
  <div
    class="flex flex-col bg-primary-950 rounded-md text-white p-4 min-w-[20vw]"
  >
    <slot name="icon"></slot>
    <div class="py-2 text-xl">{{ value }}</div>
    <div>{{ label }}</div>
  </div>
</template>

<script setup>
defineProps({
  value: String,
  label: String,
});
</script>
