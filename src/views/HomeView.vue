<template>
  <div>Dashboard...</div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import useAuth from "@/stores/useAuth";

const auth = useAuth();
const route = useRoute();

onMounted(() => {
  auth.checkLoginSession(route);
});
</script>
