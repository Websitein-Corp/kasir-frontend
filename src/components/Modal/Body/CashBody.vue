<template>
  <div>
    <TextInput
      name="totalPaid"
      type="text"
      label="Harga yang dibayar"
      placeholder="Total harga yang dibayar..."
      v-model="totalPaid"
    />
  </div>
  <div class="flex justify-center mt-8">
    <CustomButton size="md" label="Lanjut" @click="onSubmit" />
  </div>
</template>

<script setup>
import TextInput from "@/components/Input/TextInput.vue";
import useCart from "@/stores/useCart";
import { ref } from "vue";
import CustomButton from "@/components/Button/CustomButton.vue";
import useModal from "@/stores/useModal";
import useToast from "@/stores/useToast";

const totalPaid = ref(0);

const cart = useCart();
const modal = useModal();
const toast = useToast();

const onSubmit = () => {
  if (totalPaid.value >= cart.total) {
    cart.totalPaid = totalPaid.value;

    toast.message = "Sukses";
    toast.description = "Pembayaran lunas!";
    toast.type = "SUCCESS";
    toast.trigger();

    modal.close();
  } else {
    toast.message = "Gagal";
    toast.description = "Total yang dibayar tidak mencukupi!";
    toast.type = "FAILED";
    toast.trigger();
  }
};
</script>
