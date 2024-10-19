<template>
  <div class="relative group/container mx-2 h-20">
    <component
      :is="submenus.length > 0 ? 'span' : 'router-link'"
      :to="endpoint"
      @click="() => handleMenuClick(submenus.length > 0)"
      class="w-full group/menu px-2 space-y-1 cursor-pointer"
    >
      <div
        class="w-full flex justify-center p-2 group-active/container:bg-primary-200 group-hover/menu:bg-primary-100 rounded-full transition-all"
        :class="{
          'bg-primary-200 group-hover/menu:bg-primary-200': current,
        }"
      >
        <div class="group-hover/menu:scale-125 transition-all">
          <component :is="icon"></component>
        </div>
      </div>
      <div class="w-full text-center text-xs text-gray-800">{{ label }}</div>
    </component>
    <div
      v-if="submenus.length > 0"
      class="absolute top-1/3 left-20 rounded-lg bg-primary-100 w-44 opacity-0 z-50 pointer-events-none group-hover/container:pointer-events-auto group-hover/container:opacity-100 group-hover/container:translate-x-1 overflow-hidden transition-all"
      :class="{
        '!-top-12': isLogout,
      }"
    >
      <template v-for="(submenu, index) in submenus" :key="index">
        <div
          @click="
            () => {
              handleMenuClick(false);
              $emit('submenuClick', submenu.label);
            }
          "
          class="w-full bg-primary-100 group/submenu p-2 space-y-1 cursor-pointer hover:bg-primary-300 transition-all"
        >
          <component
            :is="submenu.endpoint ? 'router-link' : 'span'"
            :to="submenu.endpoint"
          >
            <span class="w-full flex items-center space-x-2 p-2">
              <span class="group-hover/submenu:scale-125 transition-all">
                <component :is="submenu.icon"></component>
              </span>
              <span class="text-left text-xs text-gray-800">
                {{ submenu.label }}
              </span>
            </span>
          </component>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import usePage from "@/stores/usePage";

defineProps({
  label: {
    type: String,
    default: "",
  },
  icon: null,
  endpoint: {
    type: String,
    default: "/",
  },
  submenus: {
    type: Array,
    default: () => [],
  },
  current: {
    type: Boolean,
    default: false,
  },
  isLogout: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["submenuClick"]);

const page = usePage();

const handleMenuClick = (hasSubmenu) => {
  if (!hasSubmenu && window.innerWidth < 1024) {
    page.navIsOpened = false;
  }
};
</script>
