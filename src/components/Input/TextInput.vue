<template>
  <div class="relative mt-6">
    <input
      :id="name"
      :type="type"
      :name="name"
      :placeholder="placeholder"
      :value="modelValue"
      class="peer w-full border-b rounded-lg placeholder:text-transparent p-4 focus:outline-none focus:ring-2 ring-primary-600 transition-all"
      :class="{
        'ring-2': modelValue,
        'cursor-not-allowed !bg-white !ring-slate-500 !text-slate-500':
          disabled,
      }"
      :disabled="disabled"
      @input="$emit('update:modelValue', $event.target.value)"
      v-bind="$attrs"
    />
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
    default: "username",
  },
  type: {
    type: String,
    default: "text",
  },
  label: {
    type: String,
    default: "Username",
  },
  placeholder: {
    type: String,
    default: "username",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  modelValue: null,
});
</script>
