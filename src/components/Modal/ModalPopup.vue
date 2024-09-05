<template>
  <transition name="fade">
    <div
      v-if="modal.isOpened"
      class="z-40 fixed top-0 left-0 w-screen h-screen bg-gray-400/50"
    />
  </transition>
  <transition name="slide-fade">
    <div
      v-if="modal.isOpened"
      class="z-50 fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-white w-11/12 md:w-1/2 xl:w-1/3 h-fit rounded-lg p-10 flex flex-col"
    >
      <div id="header" class="flex items-center space-x-3 py-4 border-b-2">
        <div>
          <component :is="modal.icon" :stroke-width="1.25"></component>
        </div>
        <div class="w-full text-lg font-helvetica-light">
          {{ modal.title }}
        </div>
        <div class="flex justify-end">
          <X
            :stroke-width="1.25"
            class="w-8 h-8 cursor-pointer"
            @click="modal.close()"
          />
        </div>
      </div>
      <div id="body" class="py-8">
        <component :is="modal.body"></component>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { X } from "lucide-vue-next";
import useModal from "@/stores/useModal";

const modal = useModal();
</script>
