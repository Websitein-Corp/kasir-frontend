<template>
  <div class="font-helvetica flex">
    <SideNavigation />
    <ModalPopup />
    <ToastAlert />
    <div class="w-full h-screen shrink overflow-hidden">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import SideNavigation from "@/components/Navigation/SideNavigation.vue";
import ModalPopup from "@/components/Modal/ModalPopup.vue";
import ToastAlert from "@/components/Toast/ToastAlert.vue";
</script>
