<template>
  <button
    class="w-40 lg:w-64 text-slate-800 !border-2 !border-primary-700 rounded !h-10 lg:!h-12 whitespace-nowrap px-2 overflow-x-scroll no-scrollbar"
    :class="{
      '!text-slate-500 cursor-not-allowed': disabled,
    }"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <span v-if="datetimeRange">
      {{ datetimeRange[0] }} - {{ datetimeRange[1] }}
    </span>
    <span v-else> Tambah produk </span>
  </button>
</template>

<script setup>
defineProps({
  datetimeRange: {
    type: Array,
    default: () => ["", ""],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
</script>
