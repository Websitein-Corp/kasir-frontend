<template>
  <div
    class="w-full lg:w-fit h-12 input-group border-2 border-gray-200 py-2 px-4 rounded hover:border-gray-300 focus-within:border-gray-300 transition-colors duration-300 flex items-center"
    :class="{
      'border-primary-700 hover:border-primary-800 focus-within:border-primary-800':
        border === 'primary',
    }"
  >
    <Search />
    <input
      class="ml-5 border-none outline-none focus:outline-none focus:text-primary-800 text-base lg:text-lg mt-1"
      type="text"
      :placeholder="placeholder"
      v-model="model"
      v-bind="$attrs"
    />
  </div>
</template>

<script setup>
import { Search } from "lucide-vue-next";

defineProps({
  border: {
    type: String,
    default: "default",
  },
  placeholder: {
    type: String,
    default: "Cari kata kunci...",
  },
});

const model = defineModel();
</script>
