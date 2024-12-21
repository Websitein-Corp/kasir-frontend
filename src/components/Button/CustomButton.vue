<template>
  <button
    class="h-10 lg:h-12 p-2 px-4 rounded-lg !text-base lg:!text-xl text-white shadow-xl flex justify-center items-center cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed"
    :class="{
      'w-[65px] lg:w-[100px] !text-sm lg:!text-base': size === 'xs',
      'w-[150px] lg:w-[200px]': size === 'sm',
      'w-[200px] lg:w-[300px]': size === 'md',
      'w-[250px] lg:w-[400px]': size === 'lg',
      'w-[300px] lg:w-[500px]': size === 'xl',
      'font-bold': labelWeight === 'bold',
      'w-fit': size === 'fit',
      'w-full': size === 'full',
      'w-full md:w-[200px]': size === 'mobile',
      '!w-fit': buttonType === 'icon',
      '!justify-start': align === 'start',
      '!justify-end': align === 'end',
      '!justify-between': align === 'between',
      '!text-sm': textSize === 'sm',
    }"
    :disabled="disabled || loading"
    @click="$emit('click')"
    v-bind="$attrs"
  >
    <slot />
    <template v-if="buttonType === 'icon'">
      <component :is="icon" :size="iconSize"></component>
    </template>
    <template v-else-if="buttonType === 'text'">
      <div>
        <span
          v-if="loading"
          :class="{
            'text-sm': textSize === 'sm',
            'text-base': textSize === 'md',
            'text-lg': textSize === 'lg',
            'text-xl': textSize === 'xl',
          }"
          ><LoadingAnim
        /></span>
        {{ label }}
      </div>
    </template>
    <template v-else>
      <div
        class="flex items-center space-x-2"
        :class="{
          '!flex-col !space-y-2.5': orientation === 'vertical',
          '!space-x-0': loading,
        }"
      >
        <span v-if="iconSide === 'left'">
          <span v-if="loading"><LoadingAnim /></span>
          <span v-else>
            <component
              :is="icon"
              :size="iconSize"
              class="mr-0.5"
              :class="{ '!m-0': orientation === 'vertical' }"
            ></component>
          </span>
        </span>
        <span
          v-if="label"
          class="mt-0.5"
          :class="{
            '!m-0': orientation === 'vertical',
            'text-sm': textSize === 'sm',
            'text-base': textSize === 'md',
            'text-lg': textSize === 'lg',
            'text-xl': textSize === 'xl',
          }"
          >{{ label }}</span
        >
        <span v-if="iconSide === 'right'">
          <span v-if="loading"><LoadingAnim /></span>
          <span v-else>
            <component
              :is="icon"
              :size="iconSize"
              class="ml-0.5"
              :class="{ '!m-0': orientation === 'vertical' }"
            ></component>
          </span>
        </span>
      </div>
    </template>
  </button>
</template>

<script setup>
import LoadingAnim from "@/assets/animations/LoadingAnim.vue";

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
  textSize: {
    type: String,
    default: "md", // "sm" / "md" / "lg" / "xl"
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["click"]);
</script>
