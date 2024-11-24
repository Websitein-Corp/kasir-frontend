<template>
  <div class="font-helvetica flex">
    <SideNavigation
      v-if="
        route.path !== '/login' &&
        route.path !== '/shop-list' &&
        route.path !== '/forgot-password'
      "
    />
    <ModalPopup />
    <ToastAlert />
    <div class="w-full h-screen shrink overflow-x-hidden overflow-y-scroll">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import SideNavigation from "@/components/Navigation/SideNavigation.vue";
import ModalPopup from "@/components/Modal/ModalPopup.vue";
import ToastAlert from "@/components/Toast/ToastAlert.vue";

const route = useRoute();
</script>
