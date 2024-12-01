<template>
  <div class="font-helvetica flex">
    <SideNavigation
      v-if="
        auth.authToken &&
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
import { onMounted } from "vue";
import usePwa from "@/stores/usePwa";
import useAuth from "@/stores/useAuth";

const route = useRoute();
const auth = useAuth();
const pwa = usePwa();

onMounted(() => {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();

    pwa.deferredPrompt = event;
    pwa.isInstallable = true;
  });
});
</script>
