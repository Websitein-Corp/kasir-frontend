<template>
  <div class="dtable-header space-y-5">
    <slot name="action-1"></slot>
    <div class="flex justify-between my-6 mb-12">
      <slot name="action-2"></slot>
      <slot name="action-3"></slot>
    </div>
  </div>
  <div class="dtable-content">
    <table class="w-full p-2 overflow-x-auto">
      <thead class="text-center text-gray-400 border-b-2 border-gray-100">
        <slot name="thead"></slot>
      </thead>
      <tbody class="text-center">
        <slot name="tbody"></slot>
      </tbody>
    </table>
  </div>
  <div v-if="table.page.links" class="dtable-footer flex justify-end mt-6">
    <div class="page-nav space-x-2">
      <template v-for="(link, key) in table.page.links" v-bind:key="key">
        <button
          v-if="!link.url"
          class="px-3 py-1 rounded bg-primary-700 text-white"
          disabled
        >
          {{ table.page.link.label }}
        </button>
        <button
          v-else
          class="px-3 py-1 rounded text-primary-700"
          :disabled="table.page.current === 1"
        >
          <RouterLink :to="link.url">
            {{ link.label }}
          </RouterLink>
        </button>
      </template>
    </div>
  </div>
</template>

<script setup>
import useTable from "@/stores/useTable";

const table = useTable();
</script>

<style>
.dtable-content tbody td {
  @apply pt-5;
}

.page-nav button:disabled {
  @apply text-gray-400;
}
</style>
