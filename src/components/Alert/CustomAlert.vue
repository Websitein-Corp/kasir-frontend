<template>
  <div
    class="w-full rounded-lg p-4 flex items-center space-x-4 shadow-lg border-2"
    :class="{
      'border-primary-800': type === 'info',
      'border-red-800': type === 'danger',
      'border-yellow-600': type === 'warning',
      'border-green-800': type === 'success',
    }"
    v-bind="$attrs"
  >
    <CircleAlert
      size="44"
      strokeWidth="1"
      class="text-primary-800"
      v-if="type === 'info'"
    />
    <CircleX
      size="44"
      strokeWidth="1"
      class="text-red-800"
      v-else-if="type === 'danger'"
    />
    <TriangleAlert
      size="44"
      strokeWidth="1"
      class="text-yellow-600"
      v-else-if="type === 'warning'"
    />
    <CircleCheckBig
      size="44"
      strokeWidth="1"
      class="text-green-800"
      v-else-if="type === 'success'"
    />
    <div>
      <div class="font-bold text-base lg:text-lg">
        {{ title }}
      </div>
      <div class="font-helvetica-light text-sm lg:text-base">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  CircleAlert,
  CircleX,
  TriangleAlert,
  CircleCheckBig,
} from "lucide-vue-next";

defineProps({
  type: {
    type: String,
    default: "info",
  },
  title: {
    type: String,
    default: "",
  },
});
</script>
