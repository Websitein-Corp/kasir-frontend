<template>
  <div class="relative mt-6">
    <select
      :id="name"
      :name="name"
      :value="modelValue"
      class="peer !shadow-none !bg-white w-full h-14 border-b rounded-lg placeholder:text-transparent p-4 focus:outline-none focus:ring-2 ring-primary-600 transition-all"
      :class="{
        'ring-2': modelValue,
        'cursor-not-allowed !bg-white !ring-slate-500 !text-slate-500':
          disabled,
      }"
      :disabled="disabled"
      @input="$emit('update:modelValue', $event.target.value)"
      v-bind="$attrs"
    >
      <option value="" disabled>Pilih...</option>
      <template v-for="item in list" :key="item.code">
        <option :value="item.code">
          {{ item.label }}
        </option>
      </template>
    </select>
    <label
      :for="name"
      class="absolute left-0 ml-1 -translate-y-3 bg-white px-1 text-sm duration-100 ease-linear peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base peer-placeholder-shown:text-primary-700 text-primary-600 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:text-sm"
    >
      {{ label }}
    </label>
  </div>
</template>

<script setup>
const props = defineProps({
  name: {
    type: String,
    default: "",
  },
  list: {
    type: Array,
    default: () => [],
  },
  label: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  modelValue: null,
});
</script>
