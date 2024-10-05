<template>
  <div
    class="w-full h-screen pb-20 px-2 xl:px-8 overflow-hidden overflow-y-auto"
  >
    <div
      id="header"
      class="w-full transition-all flex items-center ml-4"
      :class="{ 'pl-10 lg:pl-8': !page.navIsOpened }"
    >
      <div v-if="backEndpoint && page.navIsOpened">
        <RouterLink :to="backEndpoint">
          <ArrowLeft class="cursor-pointer" />
        </RouterLink>
      </div>
      <div
        class="p-8 pb-8"
        :class="{
          '!pl-28 lg:!pl-4': page.navIsOpened,
        }"
      >
        <div class="font-bold text-2xl">{{ title }}</div>
        <div class="text-slate-400">{{ subtitle }}</div>
      </div>
    </div>
    <div id="body">
      <slot />
    </div>
  </div>
</template>

<script setup>
import usePage from "@/stores/usePage";
import { ArrowLeft } from "lucide-vue-next";

defineProps({
  title: {
    type: String,
    default: "",
  },
  subtitle: {
    type: String,
    default: "",
  },
  backEndpoint: {
    type: String,
    default: "",
  },
});

const page = usePage();
</script>
