<template>
  <div
    class="w-full h-screen pb-20 px-2 xl:px-8 overflow-hidden overflow-y-auto"
    @scroll="handleScroll"
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
          <div @click="handleBack()">
            <ArrowLeft class="cursor-pointer" size="30" />
          </div>
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
import router from "@/router";

const props = defineProps({
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
  enableRouterBack: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["back"]);

const page = usePage();

const handleScroll = (event) => {
  page.scroll = event.target.scrollTop;
};

const handleBack = () => {
  if (props.enableRouterBack) {
    router.back();
  }

  emit("back");
};
</script>
