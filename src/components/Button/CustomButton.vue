<template>
  <button
    class="bg-primary-700 hover:bg-primary-800 p-2 rounded-lg text-white shadow-xl flex justify-center items-center gap-2 transition-all"
    :class="{
      'w-[200px]': size === 'sm',
      'w-[300px]': size === 'md',
      'w-[400px]': size === 'lg',
      'w-[500px]': size === 'xl',
      '!w-fit': buttonType === 'icon',
      'justify-start': align === 'start',
      'justify-end': align === 'end',
      'bg-transparent hover:bg-gray-100 border border-transparent text-black shadow-none':
        background === 'transparent',
      '!text-red-500': textColor === 'red',
    }"
    @click="$emit('click')"
  >
    <template v-if="buttonType === 'icon'">
      <component :is="icon"></component>
    </template>
    <template v-else-if="buttonType === 'text'">
      <span>{{ label }}</span>
    </template>
    <template v-else>
      <component v-if="iconSide === 'left'" :is="icon"></component>
      <span>{{ label }}</span>
      <component v-if="iconSide === 'right'" :is="icon"></component>
    </template>
  </button>
</template>

<script setup>
defineProps({
  buttonType: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  textColor: {
    type: String,
    default: "white",
  },
  align: {
    type: String,
    default: "center",
  },
  icon: null,
  iconSide: {
    type: String,
    default: "left",
  },
  size: {
    type: String,
    default: "md",
  },
  background: {
    type: String,
    default: "primary",
  },
});

defineEmits(["click"]);
</script>
