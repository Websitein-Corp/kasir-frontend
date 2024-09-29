<template>
  <VueDatePicker
    class="border-2 border-primary-700 rounded"
    v-model="date"
    range
    :disabled="disabled"
  />
</template>

<script setup>
import VueDatePicker from "@vuepic/vue-datepicker";

defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
});

const date = defineModel(new Date());
</script>
