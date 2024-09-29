<template>
  <div
    class="input-group border-2 border-gray-100 py-2 px-4 rounded hover:border-primary-800 focus-within:border-primary-800 transition-colors duration-300 flex"
  >
    <Search />
    <input
      class="ml-5 border-none outline-none focus:outline-none focus:text-primary-800"
      type="text"
      placeholder="Search item...."
      v-bind="$attrs"
    />
  </div>
</template>

<script setup>
import { Search } from "lucide-vue-next";
</script>
