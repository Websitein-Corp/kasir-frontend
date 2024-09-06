<template>
  <transition name="slide-fade-left">
    <div
      v-if="toast.isActive"
      class="fixed top-0 left-0 w-screen h-screen p-5 z-10"
    >
      <div
        class="z-50 relative top-0 left-0 bg-primary-50 w-full ml-auto md:w-1/3 xl:w-1/4 h-fit rounded-lg p-6 flex flex-col shadow-xl"
        :class="{
          'bg-yellow-200': toast.type === 'WARNING',
          'bg-green-200': toast.type === 'SUCCESS',
          'bg-red-200': toast.type === 'FAILED',
        }"
      >
        <div class="flex items-center space-x-3">
          <div>
            <CircleCheckBig
              v-if="toast.type === 'SUCCESS'"
              class="w-10 h-10"
              :stroke-width="1.25"
            />
            <CircleX
              v-else-if="toast.type === 'FAILED'"
              class="w-10 h-10"
              :stroke-width="1.25"
            />
            <OctagonAlert v-else class="w-10 h-10" :stroke-width="1.25" />
          </div>
          <div class="w-full px-2 space-y-2">
            <div class="text-lg">
              {{ toast.message }}
            </div>
            <div class="font-helvetica-light">
              {{ toast.description }}
            </div>
          </div>
          <div class="flex justify-end">
            <X
              :stroke-width="1.25"
              class="w-8 h-8 cursor-pointer"
              @click="toast.close()"
            />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { X, OctagonAlert, CircleCheckBig, CircleX } from "lucide-vue-next";
import useToast from "@/stores/useToast";

const toast = useToast();
</script>
