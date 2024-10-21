<template>
  <div class="w-fit border-2 border-primary-700 rounded flex items-center">
    <button
      class="px-1 lg:px-3 hover:bg-slate-100 transition-all"
      :class="{
        'text-slate-400': disabled,
      }"
      :disabled="disabled"
      @click="model > 1 ? model-- : allowZero && (model = 0)"
    >
      <Minus class="h-8 lg:h-10" />
    </button>
    <input
      class="text-sm lg:text-xl py-2 w-12 lg:w-16 text-center border-x-2 border-primary-700 hover:bg-slate-100 transition-all outline-none"
      :class="{
        'text-slate-400': disabled,
      }"
      :value="model"
      :disabled="disabled"
      @change="model = $event.target.value || model"
    />
    <button
      class="px-1 lg:px-3 hover:bg-slate-200 transition-all"
      :class="{
        'text-slate-400': disabled,
      }"
      :disabled="disabled"
      @click="model++"
    >
      <Plus class="h-8 md:h-10" />
    </button>
  </div>
</template>

<script setup>
import { Minus, Plus } from "lucide-vue-next";

defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  allowZero: {
    type: Boolean,
    default: false,
  },
});

const model = defineModel();
</script>
