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
        size="lg"
        iconSide="left"
        label="QRIS"
        label-weight="bold"
        :icon-size="45"
        background="outline"
        orientation="vertical"
        :icon="QrCode"
        :disabled="cart.items.length < 1"
        @click="page.order.step++"
      />
      <CustomButton
        size="lg"
        iconSide="left"
        label="Tunai"
        label-weight="bold"
        :icon-size="45"
        background="outline"
        orientation="vertical"
        :icon="Receipt"
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
import { watch } from "vue";
import CashBody from "@/components/Modal/Body/CashBody.vue";
import useCart from "@/stores/useCart";

const cart = useCart();
const page = usePage();
const modal = useModal();

watch(
  () => page.order.step,
  () => {
    if (page.order.step === 2) {
      modal.title = "Tunai";
      modal.icon = Receipt;
      modal.body = CashBody;
    }
  }
);
</script>
