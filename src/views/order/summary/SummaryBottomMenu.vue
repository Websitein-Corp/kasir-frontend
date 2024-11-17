<template>
  <div class="flex justify-center mt-2 gap-4">
    <CustomButton
      v-if="page.order.step === 1"
      size="lg"
      iconSide="right"
      label="Bayar"
      class="bg-primary-700 hover:bg-primary-800"
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
        class="h-32 bg-transparent hover:bg-slate-100 !text-primary-800 border-2 border-primary-700 hover:border-primary-800"
        orientation="vertical"
        :icon="paymentMethod.code === 'cash' ? Receipt : QrCode"
        :disabled="cart.items.length < 1"
        @click="handleModal(paymentMethod.code)"
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
import { axios } from "@/sdk/axios";
import useAuth from "@/stores/useAuth";
import QrisBody from "@/components/Modal/Body/QrisBody.vue";

const auth = useAuth();
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
  () => {
    if (page.order.step === 2) {
      modal.icon = Receipt;

      fetchPaymentMethods();
    }
  }
);

const fetchPaymentMethods = () => {
  axios
    .get(`${process.env.VUE_APP_API_BASE_URL}/api/checkout/methods`, {
      headers: {
        Authorization: `Bearer ${auth.authToken}`,
      },
      withCredentials: true,
    })
    .then(({ data }) => {
      paymentMethods.value = data.data;
    });
};

const handleModal = (method) => {
  if (method === "cash") {
    modal.title = "Tunai";
    modal.body = CashBody;
    modal.toggle();
  } else {
    modal.title = "QRIS";
    modal.body = QrisBody;
    modal.toggle();
  }
};
</script>
