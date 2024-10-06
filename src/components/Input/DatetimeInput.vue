<template>
  <VueDatePicker
    class="border-1 border-gray-300 rounded"
    :class="{
      'border-2 !border-primary-700': border === 'primary',
    }"
    v-model="date"
    :range="range"
    :disabled="disabled"
    :enable-time-picker="timePicker"
  />
</template>

<script setup>
import VueDatePicker from "@vuepic/vue-datepicker";

defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  range: {
    type: Boolean,
    default: false,
  },
  timePicker: {
    type: Boolean,
    default: false,
  },
  border: {
    type: String,
    default: "default",
  },
});

const date = defineModel();
</script>
