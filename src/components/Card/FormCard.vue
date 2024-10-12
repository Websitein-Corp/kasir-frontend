<template>
  <div
    class="h-fit border-2 border-primary-800 rounded-lg p-5 lg:p-10 flex flex-col shadow-xl"
    v-bind="$attrs"
  >
    <div
      id="header"
      class="flex items-center space-x-3 py-1 pb-4 lg:py-4 border-b-2"
    >
      <div>
        <component :is="icon" :stroke-width="1.25"></component>
      </div>
      <div class="w-full text-lg font-helvetica-light">
        {{ title }}
      </div>
    </div>
    <div id="body" class="py-4 lg:py-8">
      <slot />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  icon: null,
});
</script>
