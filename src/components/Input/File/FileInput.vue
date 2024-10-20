<template>
  <div class="w-full mt-6">
    <div class="text-primary-600 text-sm mb-2">
      {{ label }}
    </div>
    <DropZone
      :maxFiles="1"
      :multipleUpload="false"
      :uploadOnDrop="false"
      class="cursor-pointer"
      v-bind="$attrs"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  label: {
    type: String,
    default: "File",
  },
  modelValue: null,
});
</script>
