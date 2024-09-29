<template>
  <div class="dtable-header space-y-5">
    <slot name="action-1"></slot>
    <div class="flex justify-between">
      <slot name="action-2"></slot>
      <slot name="action-3"></slot>
    </div>
  </div>
  <div class="dtable-content">
    <table class="w-full p-2">
      <thead class="text-center text-gray-400 border-b-2 border-gray-100">
        <slot name="thead"></slot>
      </thead>
      <tbody class="text-center">
        <slot name="tbody"></slot>
      </tbody>
    </table>
  </div>
  <div class="dtable-footer flex justify-end">
    <div v-if="needPagination" class="page-nav space-x-2">
      <button :disabled="activePage === 1" @click="changePage(activePage - 1)">
        Previous
      </button>
      <button
        v-for="page in pageLength"
        :key="page"
        class="px-3 py-1 rounded"
        :class="{
          'bg-primary-700 text-white': activePage === page, // Active page
          'text-primary-700': activePage !== page, // Inactive pages
        }"
        @click="changePage(page)"
      >
        {{ page }}
      </button>
      <button
        :disabled="activePage === pageLength"
        @click="changePage(activePage + 1)"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  pageLength: {
    type: Number,
    default: 1,
  },
  activePage: {
    type: Number,
    default: 1,
  },
  needPagination: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["update:activePage"]);

const changePage = (page) => {
  emit("update:activePage", page);
};
</script>

<style>
.dtable-content tbody td {
  @apply pt-5;
}

.page-nav button:disabled {
  @apply text-gray-400;
}
</style>
