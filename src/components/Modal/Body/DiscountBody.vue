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
import helpers from "@/helpers";

const discount = ref(0);

const cart = useCart();
const modal = useModal();
const toast = useToast();

onMounted(() => {
  if (helpers.parseRupiah(cart.discount) > 0) {
    discount.value = helpers.convertToCurrency(cart.discount);
  }
});

const onSubmit = () => {
  const parsedDiscount = helpers.parseRupiah(discount.value);

  if (parsedDiscount > cart.sum) {
    toast.message = "Gagal";
    toast.description = "Diskon tidak boleh lebih dari subtotal!";
    toast.type = "FAILED";
    toast.trigger();

    return;
  }

  cart.discount = parsedDiscount;

  toast.message = "Sukses";
  toast.description = "Diskon berhasil ditambah!";
  toast.type = "SUCCESS";
  toast.trigger();

  modal.close();
};
</script>
