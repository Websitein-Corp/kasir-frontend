<template>
  <div class="flex flex-col">
    <div
      v-if="cart.items.length === 0"
      class="h-full flex flex-col items-center justify-center space-y-4 mt-24"
    >
      <div class="w-1/5">
        <img src="@/assets/images/emptyCart.png" alt="emptyCart.png" />
      </div>
      <div class="text-slate-500 text-center">
        Keranjang kosong, tambahkan barang untuk lanjut
      </div>
    </div>
    <div v-for="item in cart.items" :key="item.sku" class="w-full">
      <SummaryCard
        :sku="item.sku"
        :name="item.name"
        :type="item.type"
        :selling-price="item.selling_price"
        :image-url="item.image_url"
        :amount="item.amount"
        :service-start="item.service_start"
        :service-end="item.service_end"
      />
    </div>
    <div
      v-if="page.order.step === 1"
      class="w-full lg:w-1/2 mx-auto flex flex-col items-center space-y-4 my-8"
    >
      <CustomButton
        size="full"
        iconSide="left"
        label="Add items"
        background="outline"
        :icon="Plus"
        @click="page.order.step--"
      />
      <div class="w-full block lg:hidden">
        <CustomButton
          size="full"
          iconSide="left"
          :label="
            cart.discount > 0 ? $helpers.money(cart.discount) : 'Add discount'
          "
          background="outline"
          :icon="TicketPercent"
          @click="modal.open()"
        />
      </div>
    </div>
    <div
      v-else-if="page.order.step === 2"
      class="space-y-2 font-helvetica-light block lg:hidden mt-4 p-4"
    >
      <hr class="my-4" />
      <div class="flex justify-between">
        <div>Jumlah</div>
        <div>
          {{ cart.amount }}
        </div>
      </div>
      <div class="flex justify-between">
        <div>Subtotal</div>
        <div>
          {{ $helpers.money(cart.sum) }}
        </div>
      </div>
      <div class="flex justify-between">
        <div>PPN 10%</div>
        <div>
          {{ $helpers.money(cart.tax) }}
        </div>
      </div>
      <div v-if="cart.discount > 0" class="flex justify-between">
        <div>Diskon</div>
        <div>
          {{ $helpers.money(cart.discount) }}
        </div>
      </div>
      <div class="flex justify-between">
        <div>Total</div>
        <div>
          {{ $helpers.money(cart.total) }}
        </div>
      </div>
      <hr class="!my-4" />
      <div class="w-full flex justify-center pt-8">
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
      </div>
    </div>
  </div>
  <div
    v-if="page.order.step === 1"
    class="lg:hidden fixed z-50 bottom-4 left-1/2 -translate-x-1/2 w-11/12 transition-all"
  >
    <transition name="fade">
      <CustomButton
        v-if="!page.navIsOpened"
        size="full"
        height="lg"
        iconSide="right"
        label="Payment"
        align="between"
        :icon="CornerDownRight"
        :disabled="cart.items.length < 1"
        @click="page.order.step++"
      >
        <div class="font-bold">Total | {{ $helpers.money(cart.total) }}</div>
      </CustomButton>
    </transition>
  </div>
</template>

<script setup>
import useCart from "@/stores/useCart";
import {
  CornerDownRight,
  Plus,
  QrCode,
  Receipt,
  TicketPercent,
} from "lucide-vue-next";
import CustomButton from "@/components/Button/CustomButton.vue";
import usePage from "@/stores/usePage";
import SummaryCard from "@/components/Card/SummaryCard.vue";
import useModal from "@/stores/useModal";
import { ref, watch } from "vue";
import CashBody from "@/components/Modal/Body/CashBody.vue";
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
