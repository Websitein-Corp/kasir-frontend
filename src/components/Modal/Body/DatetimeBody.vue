<template>
  <div class="space-y-6">
    <div class="col-span-2 lg:col-span-1 space-y-2">
      <span>Tanggal & Waktu Mulai</span>
      <DatetimeInput
        v-model="serviceStart"
        no-clear-button
        :min-date="modal.props.minDate || null"
        :max-date="modal.props.maxDate || null"
      />
    </div>
    <div class="col-span-2 lg:col-span-1 space-y-2">
      <span>Durasi</span>
      <NumberInput
        :model-value="duration"
        @update:model-value="(val) => (duration = val)"
      />
    </div>
  </div>
  <div class="flex justify-center space-x-2 mt-8">
    <CustomButton
      size="md"
      label="Hapus"
      @click="handleDeleteDatetime"
      class="bg-red-700 hover:bg-red-800"
    />
    <CustomButton
      size="md"
      label="Kembali"
      @click="modal.close()"
      class="bg-primary-700 hover:bg-primary-800"
    />
  </div>
</template>

<script setup>
import useCart from "@/stores/useCart";
import { onMounted, ref, watch } from "vue";
import CustomButton from "@/components/Button/CustomButton.vue";
import useModal from "@/stores/useModal";
import useToast from "@/stores/useToast";
import usePage from "@/stores/usePage";
import useAuth from "@/stores/useAuth";
import DatetimeInput from "@/components/Input/DatetimeInput.vue";
import NumberInput from "@/components/Input/NumberInput.vue";
import helpers from "@/helpers";

const utc7 = 7;

const duration = ref(null);
const serviceStart = ref(null);
const serviceEnd = ref(null);
const loading = ref(false);

const auth = useAuth();
const cart = useCart();
const modal = useModal();
const toast = useToast();
const page = usePage();

onMounted(() => {
  const currentLocalDatetime = new Date();
  currentLocalDatetime.setHours(currentLocalDatetime.getHours());

  duration.value =
    modal.props.serviceStart && modal.props.serviceEnd
      ? Math.abs(
          new Date(modal.props.serviceStart) - new Date(modal.props.serviceEnd)
        ) /
        (1000 * 60 * 60)
      : 1;
  serviceStart.value =
    modal.props.serviceStart || helpers.formatDate(currentLocalDatetime);
  currentLocalDatetime.setHours(currentLocalDatetime.getHours() + 1);
  serviceEnd.value =
    modal.props.serviceEnd || helpers.formatDate(currentLocalDatetime);

  modal.response = [serviceStart.value, serviceEnd.value];
});

watch(serviceStart, (newVal, oldVal) => {
  if (oldVal !== null) {
    handleDatetimeCalculation();
  }
});

watch(duration, (newVal, oldVal) => {
  if (oldVal !== null) {
    handleDatetimeCalculation();
  }
});

const handleDatetimeCalculation = () => {
  const startDatetime = new Date(serviceStart.value);

  startDatetime.setHours(startDatetime.getHours() + utc7 + duration.value);
  serviceEnd.value = startDatetime.toISOString().replace("T", " ").slice(0, 19);

  modal.response = [serviceStart.value, serviceEnd.value];
  modal.callback();
};

const handleDeleteDatetime = () => {
  modal.response = null;
  modal.callback();

  modal.close();
};
</script>
