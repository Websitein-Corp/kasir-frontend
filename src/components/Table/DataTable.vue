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
  <div class="dtable-content overflow-x-auto">
    <table class="w-full p-2 overflow-x-auto">
      <thead class="text-center text-gray-400 border-b-2 border-gray-100">
        <slot name="thead"></slot>
      </thead>
      <tbody class="text-center">
        <slot name="tbody"></slot>
      </tbody>
    </table>
  </div>
  <div
    v-if="table.page.links"
    class="dtable-footer flex justify-between items-center mt-8 text-sm"
  >
    <div>Page {{ table.page.current }} / {{ table.page.last }}</div>
    <div class="page-nav space-x-2 flex">
      <CustomButton
        label="First"
        size="fit"
        class="bg-transparent !hover:bg-slate-100 border border-transparent !text-black !shadow-none disabled:opacity-30 disabled:cursor-not-allowed"
        :disabled="table.page.current === 1"
        @click="table.firstPage"
      />
      <CustomButton
        label="Prev"
        size="fit"
        class="bg-transparent !hover:bg-slate-100 border border-transparent !text-black !shadow-none disabled:opacity-30 disabled:cursor-not-allowed"
        :disabled="table.page.current === 1"
        @click="table.prevPage"
      />
      <CustomButton
        label="Next"
        size="fit"
        class="bg-transparent !hover:bg-slate-100 border border-transparent !text-black !shadow-none disabled:opacity-30 disabled:cursor-not-allowed"
        :disabled="table.page.current === table.page.last"
        @click="table.nextPage"
      />
      <CustomButton
        label="Last"
        size="fit"
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

const table = useTable();
</script>

<style>
.dtable-content tbody td {
  @apply pt-5;
}

.page-nav button:disabled {
  @apply text-gray-400;
}

.dtable-content td {
  @apply min-w-[150px];
}
</style>
