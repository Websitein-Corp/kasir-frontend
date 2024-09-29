<template>
  <div class="space-y-6">
    <div class="page-title">
      <h1 class="text-2xl">{{ pageTitle }}</h1>
      <h3 class="text-lg text-gray-400">{{ pageSubTitle }}</h3>
    </div>
    <div class="p-5 shadow-lg rounded space-y-10">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  pageTitle: {
    type: String,
    default: "",
  },
  pageSubTitle: {
    type: String,
    default: "",
  },
});
</script>
