<template>
  <div class="h-[70dvh] overflow-y-auto no-scrollbar">
    <div
      class="h-[20dvh] lg:h-[25dvh] bg-yellow-100 space-y-1 lg:space-y-2 p-2 lg:p-4 flex flex-col justify-center"
    >
      <div class="flex justify-center">
        <CircleEllipsis
          size="100"
          stroke-width="0.7"
          class="w-20 h-20 lg:w-32 lg:h-32 text-yellow-600"
        />
      </div>
      <div class="flex justify-center font-bold text-base lg:text-2xl">
        Menunggu Pembayaran...
      </div>
      <div class="flex justify-center font-helvetica-light text-xs lg:text-lg">
        {{ bill.tr_datetime }}
      </div>
    </div>
    <div
      class="mx-2 my-4 space-y-2 p-4 flex flex-col justify-center font-helvetica-light text-xs lg:text-base"
    >
      <div class="flex justify-between font-helvetica font-bold">
        <div>Nomor Order</div>
        <div>{{ bill.invoice_number }}</div>
      </div>
      <div class="flex justify-between">
        <div>Kasir</div>
        <div>{{ bill.cashier }}</div>
      </div>
      <hr class="my-2" />
      <div class="flex justify-between font-bold">
        <div>Barang</div>
        <div class="flex justify-between w-5/12">
          <div>Jumlah</div>
          <div>Harga</div>
        </div>
      </div>
      <div
        v-for="item in bill.details"
        :key="item.name"
        class="flex justify-between"
      >
        <div>{{ item.item_name }}</div>
        <div class="flex justify-between w-5/12">
          <div>{{ item.quantity }}</div>
          <div>{{ $helpers.money(item.price) }}</div>
        </div>
      </div>
      <hr class="my-2" />
      <div class="flex justify-between">
        <div>Subtotal</div>
        <div>{{ $helpers.money(bill.subtotal) }}</div>
      </div>
      <div class="flex justify-between">
        <div>Diskon</div>
        <div>{{ $helpers.money(bill.discount) }}</div>
      </div>
      <div class="flex justify-between" v-if="cart.settings.tax_amount !== 0.0">
        <div>Pajak</div>
        <div class="flex justify-between w-5/12">
          <div>{{ cart.settings.tax_amount }}%</div>
          <div>{{ $helpers.money(bill.tax_fee) }}</div>
        </div>
      </div>
      <div class="flex justify-between">
        <div>Total</div>
        <div class="flex justify-between w-5/12">
          <div>{{ bill.total_item }} barang</div>
          <div class="font-helvetica font-bold">
            {{ $helpers.money(bill.total_price) }}
          </div>
        </div>
      </div>
      <hr class="my-2" />
      <div class="flex justify-between">
        <div>Metode Pembayaran</div>
        <div class="uppercase font-helvetica font-bold">
          {{ bill.payment_method }}
        </div>
      </div>
      <div class="flex justify-center items-center">
        <img
          :src="modal.props.payment_url"
          alt="QRIS"
          class="w-80 h-80 object-cover"
        />
      </div>
    </div>
    <div class="flex justify-center mt-4">
      <CustomButton
        size="md"
        label="Check Status"
        class="bg-primary-700 hover:bg-primary-800"
        :loading="loading"
        @click="checkStatus"
      />
    </div>
  </div>
</template>

<script setup>
import useCart from "@/stores/useCart";
import { onMounted, ref } from "vue";
import useModal from "@/stores/useModal";
import useToast from "@/stores/useToast";
import { axios } from "@/sdk/axios";
import usePage from "@/stores/usePage";
import useAuth from "@/stores/useAuth";
import { CircleEllipsis } from "lucide-vue-next";
import router from "@/router";
import CustomButton from "@/components/Button/CustomButton.vue";

const bill = ref({
  type: "",
  tr_datetime: "",
  cashier: "",
  details: () => [
    {
      item_name: "",
      quantity: 0,
      price: 0,
    },
  ],
  invoice_number: "",
  total_item: 0,
  subtotal: 0,
  discount: 0,
  tax_fee: 0,
  total_price: 0,
  payment_method: "",
  amount_paid: 0,
  change: 0,
});

const loading = ref(false);

const auth = useAuth();
const cart = useCart();
const modal = useModal();
const toast = useToast();
const page = usePage();

onMounted(() => {
  fetchBill();
});

const checkStatus = () => {
  axios
    .get(
      `${process.env.VUE_APP_API_BASE_URL}/api/payment/status?invoice_number=${modal.props.ref_id}&shop_id=${auth.shopId}`,
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

        showBill(data.data.ref_id);
      }
    });
};

const fetchBill = () => {
  axios
    .get(
      `${process.env.VUE_APP_API_BASE_URL}/api/checkout/receipt?ref_id=${modal.props.ref_id}&shop_id=${auth.shopId}`,
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
      }

      bill.value = data.data;
    });
};

const showBill = (refId) => {
  cart.reset();
  page.order.step = 0;
  loading.value = false;

  modal.close();

  router.push({
    path: `/bill/${refId}`,
  });
};
</script>
