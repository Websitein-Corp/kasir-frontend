<template>
  <div class="h-[70dvh] overflow-y-auto no-scrollbar">
    <div
      class="h-[25dvh] lg:h-[30dvh] bg-yellow-100 space-y-1 lg:space-y-2 p-2 lg:p-4 flex flex-col justify-center"
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
      <div
        v-if="paymentTimeLeft"
        class="flex justify-center items-center font-helvetica text-xs lg:text-lg font-bold"
      >
        <Timer class="mr-2 mb-1" />
        Batas waktu bayar
        <div class="ml-2 text-red-500">{{ paymentTimeLeft }}</div>
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
      <div class="flex justify-between" v-if="!cart.settings.shop_payment_fee">
        <div>Biaya Admin</div>
        <div>{{ $helpers.money(bill.payment_fee) }}</div>
      </div>
      <div class="flex justify-between">
        <div>Total</div>
        <div class="flex justify-between w-5/12">
          <div>{{ bill.total_item }} barang</div>
          <div class="font-helvetica font-bold">
            {{ $helpers.money(bill.final_price) }}
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
        :loading="page.buttonLoading"
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
import { CircleEllipsis, Timer } from "lucide-vue-next";
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
  payment_fee: 0,
  final_price: 0,
  amount_paid: 0,
  expired_at: null,
  change: 0,
});

const paymentTimeLeft = ref();

const auth = useAuth();
const cart = useCart();
const modal = useModal();
const toast = useToast();
const page = usePage();

onMounted(() => {
  fetchBill();

  window.Echo.channel(`status.update.${bill.value.invoice_number}`).listen(
    bill.value.type,
    (event) => {
      toast.message = "Sukses";
      toast.description = `Status: ${getBillMessage(event.status)}`;
      toast.type = "SUCCESS";
      toast.trigger();

      showBill(bill.value.invoice_number);
    }
  );
});

const checkStatus = () => {
  page.buttonLoading = true;

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
        toast.description = `Status: ${getBillMessage(data.data.status)}`;
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

      if (data.data.status === "PENDING") {
        handleCountDown();
      } else {
        paymentTimeLeft.value = null;
      }
    });
};

const showBill = (refId) => {
  cart.reset();
  page.order.step = 0;
  page.buttonLoading = false;

  modal.close();

  router.push({
    path: `/bill/${refId}`,
  });
};

const getBillMessage = (status) => {
  switch (status) {
    case "SUCCESS":
      return "Pembayaran Berhasil!";
    case "FAILED":
      return "Pembayaran Gagal!";
    case "EXPIRED":
      return "Pembayaran Kedaluwarsa!";
    case "REFUNDED":
      return "Pembayaran Berhasil Dikembalikan!";
    default:
      return "Menunggu Pembayaran...";
  }
};

let countdownInterval;

const handleCountDown = () => {
  const expiredTime = new Date(bill.value.expired_at.replace(" ", "T"));

  updateCountdown(expiredTime);
  countdownInterval = setInterval(() => updateCountdown(expiredTime), 1000);
};

const updateCountdown = (expiredTime) => {
  const currentTime = new Date();

  const timeDifference = expiredTime - currentTime;
  if (timeDifference <= 0) {
    bill.value.status = "EXPIRED";
    paymentTimeLeft.value = null;

    toast.message = "Gagal";
    toast.description = "Pembayaran kedaluwarsa!";
    toast.type = "FAILED";
    toast.trigger();

    clearInterval(countdownInterval);
    showBill(modal.props.ref_id);
  } else {
    const hours = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    paymentTimeLeft.value = `${padZero(hours)}:${padZero(minutes)}:${padZero(
      seconds
    )}`;
  }
};

const padZero = (num) => {
  return num.toString().padStart(2, "0");
};
</script>
