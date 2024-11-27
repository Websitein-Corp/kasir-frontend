<template>
  <div class="flex justify-center gap-4">
    <CustomButton
      v-if="page.order.step === 1"
      size="lg"
      iconSide="right"
      label="Bayar"
      class="bg-primary-700 hover:bg-primary-800 mt-4"
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
        class="!h-28 bg-transparent hover:bg-slate-100 !text-primary-800 border-2 border-primary-700 hover:border-primary-800"
        orientation="vertical"
        :icon="paymentMethod.code === 'cash' ? Receipt : QrCode"
        :disabled="
          (cart.items.length < 1 && !paymentMethod.is_active) ||
          (paymentMethod.code === 'cash' && modal.props && modal.props.ref_id)
        "
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
import useToast from "@/stores/useToast";

const auth = useAuth();
const cart = useCart();
const page = usePage();
const toast = useToast();
const modal = useModal();

const paymentMethods = ref([]);
const refId = ref(null);

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

const checkOut = (method) => {
  axios
    .post(
      `${process.env.VUE_APP_API_BASE_URL}/api/checkout`,
      {
        shop_id: auth.shopId,
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
        payment_method: method,
        customer_pay: Number(cart.total),
        discount: Number(cart.discount),
      },
      {
        headers: {
          Authorization: `Bearer ${auth.authToken}`,
        },
        withCredentials: true,
      }
    )
    .then(({ data }) => {
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

        refId.value = data.data.ref_id;

        modal.title = "QRIS";
        modal.props = {
          ref_id: data.data.ref_id,
          payment_url: data.data.payment_url,
        };
        modal.body = QrisBody;
        modal.toggle();
      }
    });
};

const handleModal = (method) => {
  if (method === "cash") {
    modal.title = "Tunai";
    modal.body = CashBody;
    modal.toggle();
  } else {
    if (modal.props && modal.props.ref_id === refId.value) {
      modal.open();
    } else {
      checkOut("qris");
    }
  }
};
</script>
