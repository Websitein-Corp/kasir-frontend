<template>
  <div class="dtable-header space-y-5">
    <slot name="action-1"></slot>
    <div
      class="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4 justify-between my-6 mb-12"
    >
      <slot name="action-2"></slot>
      <slot name="action-3"></slot>
    </div>
  </div>
  <div class="dtable-content overflow-x-auto no-scrollbar">
    <table class="w-full p-2">
      <thead class="text-center text-gray-400 border-b-2 border-gray-100">
        <slot name="thead"></slot>
      </thead>
      <tbody class="text-center">
        <template v-if="table.items.length > 0">
          <slot name="tbody"></slot>
        </template>
        <template v-else>
          <tr>
            <td :colspan="columnCount" class="!pt-12 py-4 text-slate-500">
              <div class="flex items-center justify-center space-x-4">
                <SearchX />
                <span>No data found...</span>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
  <div
    v-if="table.page.links"
    class="dtable-footer flex justify-between items-center text-sm border-t-2 border-gray-100"
  >
    <div>Page {{ table.page.current }} / {{ table.page.last }}</div>
    <div class="page-nav space-x-2 flex">
      <CustomButton
        label="First"
        size="fit"
        text-size="sm"
        class="bg-transparent !hover:bg-slate-100 border border-transparent !text-black !shadow-none disabled:opacity-30 disabled:cursor-not-allowed"
        :disabled="table.page.current === 1"
        @click="table.firstPage"
      />
      <CustomButton
        label="Prev"
        size="fit"
        text-size="sm"
        class="bg-transparent !hover:bg-slate-100 border border-transparent !text-black !shadow-none disabled:opacity-30 disabled:cursor-not-allowed"
        :disabled="table.page.current === 1"
        @click="table.prevPage"
      />
      <CustomButton
        label="Next"
        size="fit"
        text-size="sm"
        class="bg-transparent !hover:bg-slate-100 border border-transparent !text-black !shadow-none disabled:opacity-30 disabled:cursor-not-allowed"
        :disabled="table.page.current === table.page.last"
        @click="table.nextPage"
      />
      <CustomButton
        label="Last"
        size="fit"
        text-size="sm"
        class="bg-transparent !hover:bg-slate-100 border border-transparent !text-black !shadow-none disabled:opacity-30 disabled:cursor-not-allowed"
        :disabled="table.page.current === table.page.last"
        @click="table.lastPage"
      />
    </div>
  </div>
</template>

<script setup>
import useTable from "@/stores/useTable";
import CustomButton from "@/components/Button/CustomButton.vue";
import { SearchX } from "lucide-vue-next";

defineProps({
  columnCount: {
    type: Number,
    default: 1,
  },
});

const table = useTable();
</script>

<style>
.dtable-content tbody td,
.dtable-content th {
  @apply py-2 align-middle;
}

.page-nav button:disabled {
  @apply text-gray-400;
}

.dtable-content td,
.dtable-content th {
  @apply min-w-[150px];
}
</style>
