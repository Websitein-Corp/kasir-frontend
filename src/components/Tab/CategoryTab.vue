<template>
  <div
    class="bg-slate-100 w-full lg:w-fit flex flex-grow p-2 rounded gap-4 text-xs lg:text-base overflow-auto whitespace-nowrap transition-all"
  >
    <div
      v-for="item in items"
      :key="item.code"
      class="p-1 px-2 rounded cursor-pointer"
      :class="{
        '!bg-primary-50 border border-primary-700 cursor-default':
          currentTab === item.code,
      }"
      @click="onTabChange(item.code)"
    >
      {{ item.name }}
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import usePage from "@/stores/usePage";

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["tabChange"]);

const page = usePage();

const currentTab = ref(props.items[0].code);

const onTabChange = (tab) => {
  currentTab.value = tab;
  emit("tabChange", tab);
};
</script>
