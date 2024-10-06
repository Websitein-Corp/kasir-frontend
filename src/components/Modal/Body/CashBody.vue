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
import axios from "axios";
import router from "@/router";
import usePage from "@/stores/usePage";

const totalPaid = ref(0);

const cart = useCart();
const modal = useModal();
const toast = useToast();
const page = usePage();

const onSubmit = () => {
  if (totalPaid.value >= cart.total) {
    cart.totalPaid = totalPaid.value;

    modal.close();
    checkOut();
  } else {
    toast.message = "Gagal";
    toast.description = "Total yang dibayar tidak mencukupi!";
    toast.type = "FAILED";
    toast.trigger();
  }
};

const checkOut = async () => {
  const { data } = await axios.post(
    `${process.env.VUE_APP_API_BASE_URL}/api/checkout`,
    {
      shop_id: "76L1",
      cart: cart.items.map((item) => {
        if (item.amount) {
          return {
            sku: item.sku,
            amount: item.amount,
          };
        } else {
          return {
            sku: item.sku,
            service_start: item.service_start,
            service_end: item.service_end,
          };
        }
      }),
      payment_method: "cash",
      customer_pay: Number(totalPaid.value),
      discount: Number(cart.discount),
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
      withCredentials: true,
    }
  );

  if (data["error_type"]) {
    toast.message = "Gagal";
    toast.description = data.message;
    toast.type = "FAILED";
    toast.trigger();
  } else {
    toast.message = "Sukses";
    toast.description = data.message;
    toast.type = "SUCCESS";
    toast.trigger();

    setTimeout(() => showBill(data.data["ref_id"]), 3000);
  }
};

const showBill = async (refId) => {
  cart.clearAll();
  page.order.step = 0;

  await router.push({
    path: `/bill/${refId}`,
  });
};
</script>
