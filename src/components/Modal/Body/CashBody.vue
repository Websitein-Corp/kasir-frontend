<template>
  <div>
    <TextInput
      name="totalPaid"
      type="text"
      label="Harga yang dibayar"
      currency
      placeholder="Total harga yang dibayar..."
      v-model="totalPaid"
    />
  </div>
  <div class="flex justify-center mt-8">
    <CustomButton
      size="md"
      label="Lanjut"
      @click="onSubmit"
      :loading="loading"
      class="bg-primary-700 hover:bg-primary-800"
    />
  </div>
</template>

<script setup>
import TextInput from "@/components/Input/TextInput.vue";
import useCart from "@/stores/useCart";
import { ref } from "vue";
import CustomButton from "@/components/Button/CustomButton.vue";
import useModal from "@/stores/useModal";
import useToast from "@/stores/useToast";
import { axios } from "@/sdk/axios";
import router from "@/router";
import usePage from "@/stores/usePage";
import useAuth from "@/stores/useAuth";
import helpers from "@/helpers";

const totalPaid = ref(0);
const loading = ref(false);

const auth = useAuth();
const cart = useCart();
const modal = useModal();
const toast = useToast();
const page = usePage();

const onSubmit = () => {
  if (helpers.parseRupiah(totalPaid.value) >= cart.total) {
    cart.totalPaid = totalPaid.value;
    loading.value = true;

    checkOut();
  } else {
    toast.message = "Gagal";
    toast.description = "Total yang dibayar tidak mencukupi!";
    toast.type = "FAILED";
    toast.trigger();
  }
};

const checkOut = () => {
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
        payment_method: "cash",
        customer_pay: Number(helpers.parseRupiah(totalPaid.value)),
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

        loading.value = false;
      } else {
        toast.message = "Sukses";
        toast.description = data.message;
        toast.type = "SUCCESS";
        toast.trigger();

        setTimeout(() => showBill(data.data["ref_id"]), 2000);
      }
    })
    .catch(() => {
      loading.value = false;
    });
};

const showBill = (refId) => {
  cart.clearAll();
  page.order.step = 0;
  loading.value = false;

  modal.close();

  router.push({
    path: `/bill/${refId}`,
  });
};
</script>
