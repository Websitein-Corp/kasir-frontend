<template>
  <div class="flex justify-between">
    <div>Jumlah</div>
    <div>
      {{ cart.amount }}
    </div>
  </div>
  <div class="flex justify-between">
    <div>Total</div>
    <div>
      {{ $helpers.money(cart.sum) }}
    </div>
  </div>
  <div class="flex justify-center !mt-8">
    <CustomButton
      size="lg"
      iconSide="right"
      label="Konfirmasi"
      class="bg-primary-700 hover:bg-primary-800"
      :icon="CornerDownRight"
      :disabled="cart.items.length < 1"
      @click="page.order.step++"
    />
  </div>
</template>

<script setup>
import { CornerDownRight } from "lucide-vue-next";
import CustomButton from "@/components/Button/CustomButton.vue";
import useCart from "@/stores/useCart";
import usePage from "@/stores/usePage";

const cart = useCart();
const page = usePage();
</script>
