<template>
  <div class="flex justify-center mt-2 gap-4">
    <CustomButton
      v-if="page.order.step === 1"
      size="lg"
      iconSide="right"
      label="Bayar"
      :icon="CornerDownRight"
      :disabled="cart.items.length < 1"
      @click="page.order.step++"
    />
    <template v-else>
      <CustomButton
        v-for="paymentMethod in paymentMethods"
        :key="paymentMethod.code"
        size="lg"
        iconSide="left"
        :label="paymentMethod.name"
        label-weight="bold"
        :icon-size="45"
        background="outline"
        orientation="vertical"
        :icon="paymentMethod.code === 'cash' ? Receipt : QrCode"
        :disabled="cart.items.length < 1"
        @click="modal.toggle()"
      />
    </template>
  </div>
</template>

<script setup>
import { CornerDownRight, QrCode, Receipt } from "lucide-vue-next";
import CustomButton from "@/components/Button/CustomButton.vue";
import usePage from "@/stores/usePage";
import useModal from "@/stores/useModal";
import { ref, watch } from "vue";
import CashBody from "@/components/Modal/Body/CashBody.vue";
import useCart from "@/stores/useCart";
import axios from "axios";

const cart = useCart();
const page = usePage();
const modal = useModal();

const paymentMethods = ref([
  {
    code: "cash",
    name: "Cash",
    payment_gateway: "cash",
    payment_fee: 0,
  },
  {
    code: "qris",
    name: "QRIS",
    payment_gateway: "qris",
    payment_fee: 0.7,
  },
]);

watch(
  () => page.order.step,
  async () => {
    if (page.order.step === 2) {
      modal.title = "Tunai";
      modal.icon = Receipt;
      modal.body = CashBody;

      await fetchPaymentMethods();
    }
  }
);

const fetchPaymentMethods = async () => {
  const response = await axios.get(
    `${process.env.VUE_APP_API_BASE_URL}/api/checkout/methods`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
      withCredentials: true,
    }
  );

  paymentMethods.value = response.data.data;
};
</script>
