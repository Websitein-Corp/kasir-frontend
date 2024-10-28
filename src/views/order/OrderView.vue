<template>
  <div v-if="auth.isAuthenticated" class="flex">
    <div
      class="w-full lg:w-full h-screen pb-20 px-2 xl:px-8 overflow-x-hidden overflow-y-scroll no-scrollbar"
    >
      <div
        id="header"
        class="w-full transition-all flex items-center ml-4"
        :class="{ 'pl-10 lg:pl-8': !page.navIsOpened }"
      >
        <div
          class="p-8 pb-8 flex"
          :class="{
            '!pl-28 lg:!pl-4': page.navIsOpened,
          }"
        >
          <div
            v-if="page.order.step > 0"
            class="flex items-center"
            :class="{
              'hidden lg:flex': page.navIsOpened,
            }"
          >
            <ArrowLeft @click="page.order.step--" class="cursor-pointer" />
          </div>
          <div
            class="ml-4"
            :class="{
              'ml-0 lg:ml-4': page.navIsOpened,
            }"
          >
            <div class="font-bold text-2xl">Pesan</div>
            <div class="text-slate-400">Membuat pesanan baru...</div>
          </div>
        </div>
      </div>
      <OrderBody v-if="page.order.step === 0" />
      <SummaryBody v-else />
    </div>
    <div
      id="summarySideBar"
      class="hidden lg:block ml-auto w-[26rem] shadow-2xl h-screen"
    >
      <div class="h-4/5 flex flex-col overflow-hidden">
        <div class="flex items-center space-x-4 p-8">
          <ShoppingCart size="40" />
          <div class="text-2xl font-bold">Pesanan#001</div>
        </div>
        <div class="p-4 w-full flex justify-center">
          <OrderProgressBar />
        </div>
        <OrderSidebar v-if="page.order.step === 0" />
        <SummarySidebar v-else />
      </div>
      <div
        class="w-full h-1/5 py-8 px-12 shadow-inner font-helvetica-light space-y-2"
      >
        <OrderBottomMenu v-if="page.order.step === 0" />
        <SummaryBottomMenu v-else />
      </div>
    </div>
  </div>
  <div v-else>
    <DefaultSkeleton class="mb-2" />
    <DefaultSkeleton class="mb-2" />
    <DefaultSkeleton class="mb-2" />
  </div>
</template>

<script setup>
import { ShoppingCart, ArrowLeft } from "lucide-vue-next";
import OrderProgressBar from "@/components/ProgressBar/OrderProgressBar.vue";
import usePage from "@/stores/usePage";
import OrderSidebar from "@/views/order/order/OrderSidebar.vue";
import OrderBottomMenu from "@/views/order/order/OrderBottomMenu.vue";
import OrderBody from "@/views/order/order/OrderBody.vue";
import SummaryBody from "@/views/order/summary/SummaryBody.vue";
import SummarySidebar from "@/views/order/summary/SummarySidebar.vue";
import SummaryBottomMenu from "@/views/order/summary/SummaryBottomMenu.vue";
import useAuth from "@/stores/useAuth";
import { onMounted } from "vue";
import DefaultSkeleton from "@/components/Skeleton/DefaultSkeleton.vue";
import { useRoute } from "vue-router";

const auth = useAuth();
const page = usePage();
const route = useRoute();

onMounted(async () => {
  page.loading = true;

  await auth.checkLoginSession(route);
});
</script>
