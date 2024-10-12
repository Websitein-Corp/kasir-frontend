<template>
  <div class="font-helvetica flex">
    <SideNavigation v-if="route.path !== '/login'" />
    <ModalPopup />
    <ToastAlert />
    <div class="w-full h-screen shrink overflow-hidden">
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
