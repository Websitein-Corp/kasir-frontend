<template>
  <div
    class="w-full h-screen pb-20 px-2 xl:px-8 overflow-hidden overflow-y-auto"
    @scroll="(event) => (page.scroll = event.target.scrollTop)"
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
          v-if="enableBack"
          class="flex items-center"
          :class="{
            'hidden lg:flex': page.navIsOpened,
          }"
        >
          <RouterLink :to="backEndpoint" @click="$emit('back')">
            <ArrowLeft class="cursor-pointer" size="30" />
          </RouterLink>
        </div>
        <div
          class="ml-4"
          :class="{
            'ml-0 lg:ml-4': page.navIsOpened,
          }"
        >
          <div class="font-bold text-lg md:text-2xl">{{ title }}</div>
          <div class="text-slate-400 text-sm md:text-base">{{ subtitle }}</div>
        </div>
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
  enableBack: {
    type: Boolean,
    default: false,
  },
  backEndpoint: {
    type: String,
    default: "",
  },
});

defineEmits(["back"]);

const page = usePage();
</script>
