<template>
  <button
    class="bg-primary-700 hover:bg-primary-800 p-2 px-4 rounded-lg text-white shadow-xl flex justify-center items-center gap-2 cursor-pointer transition-all"
    :class="{
      'h-[50px]': height === 'lg',
      'w-[150px] lg:w-[200px]': size === 'sm',
      'w-[200px] lg:w-[300px]': size === 'md',
      'w-[250px] lg:w-[400px]': size === 'lg',
      'w-[300px] lg:w-[500px]': size === 'xl',
      'font-bold': labelWeight === 'bold',
      'w-fit': size === 'fit',
      'w-full': size === 'full',
      '!w-fit': buttonType === 'icon',
      '!justify-start': align === 'start',
      '!justify-end': align === 'end',
      '!justify-between': align === 'between',
      'bg-transparent hover:bg-slate-100 border border-transparent !text-black !shadow-none':
        background === 'transparent',
      'bg-transparent hover:bg-slate-100 border-2 border-primary-700 !text-primary-700 !shadow-none':
        background === 'outline',
      '!text-red-500': textColor === 'red',
      '!bg-primary-700/50 cursor-not-allowed':
        disabled && background === 'primary',
      '!text-slate-800/50 !border-slate-400/50 cursor-not-allowed':
        disabled && background === 'outline',
      'opacity-30 cursor-not-allowed': disabled && background === 'transparent',
    }"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot />
    <template v-if="buttonType === 'icon'">
      <component :is="icon" :size="iconSize"></component>
    </template>
    <template v-else-if="buttonType === 'text'">
      <div>{{ label }}</div>
    </template>
    <template v-else>
      <div
        class="flex items-center space-x-2"
        :class="{ '!flex-col !space-y-2.5': orientation === 'vertical' }"
      >
        <component
          v-if="iconSide === 'left'"
          :is="icon"
          :size="iconSize"
          class="mr-0.5"
          :class="{ '!m-0': orientation === 'vertical' }"
        ></component>
        <span class="mt-0.5" :class="{ '!m-0': orientation === 'vertical' }">{{
          label
        }}</span>
        <component
          v-if="iconSide === 'right'"
          :is="icon"
          :size="iconSize"
          class="ml-0.5"
          :class="{ '!m-0': orientation === 'vertical' }"
        ></component>
      </div>
    </template>
  </button>
</template>

<script setup>
defineProps({
  buttonType: {
    type: String,
    default: "", // "text" / "icon"
  },
  label: {
    type: String,
    default: "",
  },
  labelWeight: {
    type: String,
    default: "light", // "light" / "bold"
  },
  textColor: {
    type: String,
    default: "white", // "white" / "red"
  },
  align: {
    type: String,
    default: "center", // "start" / "end" / "center" / "between"
  },
  orientation: {
    type: String,
    default: "horizontal", // "horizontal" / "vertical"
  },
  icon: null,
  iconSize: {
    type: Number,
    default: 20,
  },
  iconSide: {
    type: String,
    default: "left", // "left" / "right"
  },
  size: {
    type: String,
    default: "md", // "sm" / "md" / "lg" / "xl" / "fit" / "full"
  },
  height: {
    type: String,
    default: "md", // "md" / "lg"
  },
  background: {
    type: String,
    default: "primary", // "primary" / "outline" / "transparent"
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["click"]);
</script>
