<template>
  <div class="font-helvetica">
    <SideNavigation />
    <ModalPopup />
    <router-view />
  </div>
</template>

<script setup>
import SideNavigation from "@/components/Navigation/SideNavigation.vue";
import ModalPopup from "@/components/Modal/ModalPopup.vue";
</script>
