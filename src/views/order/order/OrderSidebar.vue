<template>
  <div class="w-full mt-4 flex justify-end p-4">
    <CustomButton
      size="fit"
      iconSide="right"
      text-color="red"
      label="Hapus Semua"
      :icon="Trash2"
      background="transparent"
      @click="cart.clearAll()"
    />
  </div>
  <div class="p-4 space-y-4 overflow-y-scroll">
    <div
      v-if="cart.items.length === 0"
      class="h-full flex flex-col items-center justify-center space-y-4"
    >
      <div class="w-1/3">
        <img src="../../../assets/images/emptyCart.png" alt="emptyCart.png" />
      </div>
      <div class="text-slate-500 text-center">
        Tekan barang untuk memasukkan ke dalam keranjang
      </div>
    </div>
    <div v-else class="space-y-2">
      <SummaryCard
        v-for="item in cart.items"
        :key="item.name"
        :title="item.name"
        :price="item.price"
        :amount="item.amount"
      />
    </div>
  </div>
</template>

<script setup>
import { Trash2 } from "lucide-vue-next";
import CustomButton from "@/components/Button/CustomButton.vue";
import SummaryCard from "@/components/Card/SummaryCard.vue";
import useCart from "@/stores/useCart";

const cart = useCart();
</script>
