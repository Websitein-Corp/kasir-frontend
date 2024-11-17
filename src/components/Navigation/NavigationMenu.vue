<template>
  <div
    class="relative group/container px-2 lg:px-0 max-h-fit h-[4.5rem] lg:h-14 transition-all"
    :class="{
      'lg:hover:h-64': page.navIsOpened,
    }"
  >
    <component
      :is="submenus.length > 0 ? 'span' : 'router-link'"
      :to="endpoint"
      @click="() => handleMenuClick(submenus.length > 0)"
      class="w-full group/menu lg:group-active/container:bg-primary-200 lg:hover:bg-primary-100 px-2 lg:pr-10 space-y-1 cursor-pointer lg:flex lg:items-center"
      :class="{
        'lg:bg-primary-200 lg:group-hover/menu:bg-primary-200': current,
      }"
    >
      <div
        class="w-full flex justify-center p-2 lg:py-4 group-active/container:bg-primary-200 group-hover/menu:bg-primary-100 lg:!bg-opacity-0 lg:hover:!bg-opacity-0 rounded-full transition-all"
        :class="{
          'bg-primary-200 group-hover/menu:bg-primary-200': current,
        }"
      >
        <div class="group-hover/menu:scale-125 transition-all">
          <component :is="icon"></component>
        </div>
      </div>
      <div
        class="w-full text-center lg:text-left text-[0.65rem] lg:text-xs text-gray-800 transition-transform"
        :class="{
          'lg:translate-x-6': !page.navIsOpened,
        }"
      >
        {{ label }}
      </div>
    </component>
    <div
      v-if="submenus.length > 0"
      class="absolute lg:static top-1/3 left-20 rounded-lg bg-primary-100 w-44 lg:w-full opacity-0 z-50 pointer-events-none group-hover/container:pointer-events-auto group-hover/container:translate-x-1 lg:group-hover/container:translate-x-0 overflow-hidden transition-all"
      :class="{
        'group-hover/container:opacity-100': page.navIsOpened,
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
          class="w-full lg:ml-6 bg-primary-100 group/submenu p-2 space-y-1 cursor-pointer hover:bg-primary-300 lg:hover:bg-primary-100 transition-all"
        >
          <component
            :is="submenu.endpoint ? 'router-link' : 'span'"
            :to="submenu.endpoint"
          >
            <span class="w-full flex items-center space-x-2 lg:space-x-4 p-2">
              <span class="group-hover/submenu:scale-125 transition-all">
                <component :is="submenu.icon"></component>
              </span>
              <span class="text-left text-[0.65rem] text-gray-800">
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
  } else if (!page.navIsOpened) {
    page.navIsOpened = true;
  }
};
</script>
