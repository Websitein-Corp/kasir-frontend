<template>
  <div class="w-fit border-2 border-primary-700 rounded flex items-center">
    <button
      class="p-1 px-1 lg:px-3 hover:bg-slate-100 transition-all"
      :class="{
        'text-slate-400': disabled,
      }"
      :disabled="disabled"
      @click="model > 1 && model--"
    >
      <Minus class="h-4 md:h-fit" />
    </button>
    <input
      class="text-xs lg:text-xl py-2 w-12 md:w-16 text-center border-x-2 border-primary-700 hover:bg-slate-100 transition-all outline-none"
      :class="{
        'text-slate-400': disabled,
      }"
      :value="model"
      :disabled="disabled"
      @change="model = $event.target.value || model"
    />
    <button
      class="p-1 px-1 lg:px-3 hover:bg-slate-200 transition-all"
      :class="{
        'text-slate-400': disabled,
      }"
      :disabled="disabled"
      @click="model++"
    >
      <Plus class="h-4 md:h-fit" />
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
});

const model = defineModel();
</script>
