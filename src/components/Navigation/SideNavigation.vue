<template>
  <div class="fixed z-30 top-0 left-5 p-2 mt-3">
    <Menu
      class="w-10 h-10 cursor-pointer transition-all"
      :class="{
        'rotate-180': isOpened,
      }"
      @click="isOpened = !isOpened"
    />
  </div>
  <div
    class="shrink-0 transition-all"
    :class="{
      'w-[100px]': isOpened,
      'w-0': !isOpened,
    }"
  ></div>
  <div
    class="fixed transition-all"
    :class="{
      'w-[100px] opacity-100': isOpened,
      'w-0 opacity-0': !isOpened,
    }"
  >
    <nav class="w-[100px] h-screen bg-primary-50 flex flex-col">
      <div class="w-20 h-20 p-2 mx-auto mt-20 relative top-0 left-0">
        <img
          src="../../assets/images/websiteinLogo.svg"
          alt="websiteinLogo.svg"
          class="object-cover"
        />
      </div>
      <div class="flex flex-col">
        <NavigationMenu
          v-for="(menu, index) in menus"
          :key="index"
          :label="menu.label"
          :icon="menu.icon"
          :submenus="menu.submenus"
          :current="menu.current"
        />
      </div>
      <div class="h-full flex flex-col justify-end text-red-500 mb-4">
        <NavigationMenu :icon="LogOut" />
      </div>
    </nav>
  </div>
</template>

<script setup>
import {
  ChartPie,
  ShoppingCart,
  PackageSearch,
  ArrowRightLeft,
  Truck,
  Shuffle,
  Users,
  LogOut,
  Ham,
  Package,
  HandPlatter,
  Clock,
  Box,
  ShoppingBasket,
  List,
  Menu,
} from "lucide-vue-next";
import NavigationMenu from "@/components/Navigation/NavigationMenu.vue";
import { ref } from "vue";

const menus = [
  {
    label: "Dashboard",
    icon: ChartPie,
  },
  {
    label: "Order",
    icon: ShoppingCart,
    submenus: [
      {
        label: "Food",
        icon: Ham,
        endpoint: "/",
      },
      {
        label: "Goods",
        icon: Package,
        endpoint: "/",
      },
      {
        label: "Service",
        icon: HandPlatter,
        endpoint: "/",
      },
      {
        label: "Timed Service",
        icon: Clock,
        endpoint: "/",
      },
    ],
    current: true,
  },
  {
    label: "Product",
    icon: PackageSearch,
    submenus: [
      {
        label: "Product Category",
        icon: Box,
        endpoint: "/",
      },
      {
        label: "Product Ingredient",
        icon: ShoppingBasket,
        endpoint: "/",
      },
      {
        label: "Product List",
        icon: List,
        endpoint: "/",
      },
    ],
  },
  {
    label: "Transaction",
    icon: ArrowRightLeft,
  },
  {
    label: "Supplier",
    icon: Truck,
  },
  {
    label: "Recon",
    icon: Shuffle,
  },
  {
    label: "Subuser",
    icon: Users,
  },
];

const isOpened = ref(true);
</script>
