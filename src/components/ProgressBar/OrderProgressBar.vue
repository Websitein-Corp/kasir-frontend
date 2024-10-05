<template>
  <div class="flex">
    <div class="bg-primary-800 rounded-full w-fit p-3 relative">
      <Check color="white" size="30" />
      <div class="absolute -bottom-8 left-1/2 -translate-x-1/2">Pesan</div>
    </div>
    <div class="border-b-[6px] border-primary-800 w-20 -translate-y-1/2"></div>
    <div
      class="bg-white border-[6px] border-primary-800 w-14 rounded-full relative"
      :class="{
        '!bg-primary-800 !border-0 !w-fit p-3': page.order.step > 0,
      }"
    >
      <Check v-if="page.order.step > 0" color="white" size="30" />
      <div
        class="absolute -bottom-8 left-1/2 -translate-x-1/2"
        :class="{
          '-bottom-[2.4rem]': page.order.step < 1,
        }"
      >
        Konfirmasi
      </div>
    </div>
    <div class="border-b-[6px] border-primary-800 w-20 -translate-y-1/2"></div>
    <div
      class="bg-white border-[6px] border-primary-800 w-14 rounded-full relative"
      :class="{
        '!bg-primary-800 !border-0 !w-fit p-3': page.order.step > 1,
      }"
    >
      <Check v-if="page.order.step > 1" color="white" size="30" />
      <div
        class="absolute -bottom-8 left-1/2 -translate-x-1/2"
        :class="{
          '-bottom-[2.4rem]': page.order.step < 2,
        }"
      >
        Bayar
      </div>
    </div>
  </div>
</template>

<script setup>
import { Check } from "lucide-vue-next";
import usePage from "@/stores/usePage";

const page = usePage();
</script>
