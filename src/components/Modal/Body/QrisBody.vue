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
      <div class="flex justify-between">
        <div>Pajak</div>
        <div class="flex justify-between w-5/12">
          <div>10%</div>
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
        <qrcode-vue value="value" :size="300" level="H" render-as="svg" />
      </div>
    </div>
    <div class="flex justify-center mt-4 lg:mt-8">
      <CustomButton
        size="md"
        label="Check Status"
        class="bg-primary-700 hover:bg-primary-800"
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
import QrcodeVue from "qrcode.vue";

const bill = ref({
  type: "SUCCESS",
  tr_datetime: "21 Agustus 2024, 18:07:12",
  cashier: "",
  details: () => [
    {
      item_name: "Bur",
      quantity: 2,
      price: 10000,
    },
    {
      item_name: "Ger",
      quantity: 1,
      price: 15000,
    },
  ],
  invoice_number: "invoice-000-000-001",
  total_item: 0,
  subtotal: 0,
  discount: 0,
  tax_fee: 0,
  total_price: 0,
  payment_method: "qris",
  amount_paid: 0,
  change: 0,
});

const paymentUrl = ref("");

const auth = useAuth();
const cart = useCart();
const modal = useModal();
const toast = useToast();
const page = usePage();

onMounted(async () => {
  await checkOut();
});

const checkStatus = () => {
  axios
    .get(
      `${process.env.VUE_APP_API_BASE_URL}/api/checkout/receipt?ref_id=${bill.value.invoice_number}&shop_id=${auth.shopId}`,
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

      if (data.data.type === "SUCCESS") {
        modal.close();
        cart.clearAll();
        page.order.step = 0;

        router.push({
          path: `/bill/${data.data.invoice_number}`,
        });
      }
    });
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
        payment_method: "qris",
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

        paymentUrl.value = data.data.payment_url;
        fetchBill(data.data.ref_id);
      }
    });
};

const fetchBill = (refId) => {
  axios
    .get(
      `${process.env.VUE_APP_API_BASE_URL}/api/checkout/receipt?ref_id=${refId}&shop_id=${auth.shopId}`,
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
        bill.value = data.data;
        bill.value["type"] = "PENDING";
      }
    });
};
</script>
