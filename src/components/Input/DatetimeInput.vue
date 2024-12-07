<template>
  <VueCtkDateTimePicker
    label="Pilih tanggal dan waktu"
    class="!border-2 !border-primary-700 rounded !h-12"
    format="YYYY-MM-DD hh:mm:ss"
    color="#0F927E"
    v-model="date"
    v-bind="$attrs"
  />
</template>

<script setup>
import VueCtkDateTimePicker from "vue-ctk-date-time-picker";

const date = defineModel();
</script>
