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
  <div v-if="table.page.links" class="dtable-footer flex justify-between mt-8">
    <div>Page {{ table.page.current }} / {{ table.page.last }}</div>
    <div class="page-nav space-x-2 flex">
      <CustomButton
        label="First"
        size="fit"
        background="transparent"
        :disabled="table.page.current === 1"
        @click="table.firstPage"
      />
      <CustomButton
        label="Prev"
        size="fit"
        background="transparent"
        :disabled="table.page.current === 1"
        @click="table.prevPage"
      />
      <CustomButton
        label="Next"
        size="fit"
        background="transparent"
        :disabled="table.page.current === table.page.last"
        @click="table.nextPage"
      />
      <CustomButton
        label="Last"
        size="fit"
        background="transparent"
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
</style>
