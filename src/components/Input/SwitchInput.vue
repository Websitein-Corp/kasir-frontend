<template>
  <div class="flex items-center">
    <span
      class="toggle-wrapper"
      role="checkbox"
      :aria-checked="isActive.toString()"
      tabindex="0"
      @click="toggle"
      @keydown.space.prevent="toggle"
    >
      <span class="toggle-background" :class="backgroundStyles" />
      <span class="toggle-indicator" :style="indicatorStyles" />
    </span>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";

const props = defineProps({
  isActive: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["switch"]);

const currentState = ref(props.isActive);

watch(
  () => props.isActive,
  () => {
    currentState.value = props.isActive;
  }
);

const backgroundStyles = computed(() => {
  return {
    active: currentState.value,
    inactive: !currentState.value,
  };
});

const indicatorStyles = computed(() => {
  return {
    transform: currentState.value ? "translateX(32px) " : "translateX(0)",
  };
});

const toggle = () => {
  emit("switch", !currentState.value);
  currentState.value = !currentState.value;
};
</script>

<style>
.active {
  @apply bg-green-700;
}

.inactive {
  @apply bg-slate-300;
}

.toggle-wrapper {
  display: inline-block;
  position: relative;
  cursor: pointer;
  width: 64px;
  height: 32px;
  border-radius: 9999px;
}

.toggle-wrapper:focus {
  outline: 0;
}

.toggle-background {
  display: inline-block;
  border-radius: 9999px;
  height: 100%;
  width: 100%;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s ease;
}

.toggle-indicator {
  position: absolute;
  height: 24px;
  width: 24px;
  left: 4px;
  bottom: 4px;
  background-color: #ffffff;
  border-radius: 9999px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}
</style>
