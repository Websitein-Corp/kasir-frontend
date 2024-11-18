<template>
  <div>
    <TextInput
      name="discount"
      type="text"
      label="Diskon (opsional)"
      placeholder="Tambah diskon..."
      currency
      v-model="discount"
    />
  </div>
  <div class="flex justify-center mt-8">
    <CustomButton
      size="md"
      label="Lanjut"
      class="bg-primary-700 hover:bg-primary-800"
      @click="onSubmit"
    />
  </div>
</template>

<script setup>
import TextInput from "@/components/Input/TextInput.vue";
import useCart from "@/stores/useCart";
import { onMounted, ref } from "vue";
import CustomButton from "@/components/Button/CustomButton.vue";
import useModal from "@/stores/useModal";
import useToast from "@/stores/useToast";

const discount = ref(null);

const cart = useCart();
const modal = useModal();
const toast = useToast();

onMounted(() => {
  if (cart.discount > 0) {
    discount.value = cart.discount;
  }
});

const onSubmit = () => {
  cart.discount = discount.value;

  toast.message = "Sukses";
  toast.description = "Diskon berhasil ditambah!";
  toast.type = "SUCCESS";
  toast.trigger();

  modal.close();
};
</script>
