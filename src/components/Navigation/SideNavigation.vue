<template>
  <div class="fixed z-50 top-4 left-5 p-2 mt-3">
    <Menu
      class="cursor-pointer transition-all"
      :class="{
        'rotate-180': page.navIsOpened,
      }"
      size="40"
      @click="page.navIsOpened = !page.navIsOpened"
    />
  </div>
  <div
    class="shrink-0 transition-all"
    :class="{
      'lg:w-[100px]': page.navIsOpened,
      'lg:w-0': !page.navIsOpened,
    }"
  ></div>
  <div
    class="fixed transition-all z-40"
    :class="{
      'w-[100px] opacity-100': page.navIsOpened,
      'w-0 opacity-0 overflow-hidden': !page.navIsOpened,
    }"
  >
    <nav class="w-[100px] h-screen bg-primary-50 flex flex-col pt-4">
      <div class="w-20 h-20 p-2 mx-auto mt-20 relative top-0 left-0">
        <img
          src="@/assets/images/websiteinLogo.svg"
          alt="websiteinLogo.svg"
          class="object-cover"
        />
      </div>
      <div
        class="flex flex-col"
        :class="{ 'pointer-events-none': !page.navIsOpened }"
      >
        <NavigationMenu
          v-for="(menu, index) in menus"
          :key="index"
          :label="menu.label"
          :icon="menu.icon"
          :endpoint="menu.endpoint"
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
import usePage from "@/stores/usePage";

const menus = [
  {
    label: "Beranda",
    endpoint: "/",
    icon: ChartPie,
  },
  {
    label: "Pesan",
    icon: ShoppingCart,
    submenus: [
      {
        label: "Makanan",
        icon: Ham,
        endpoint: "/order",
      },
      {
        label: "Barang",
        icon: Package,
        endpoint: "/order",
      },
      {
        label: "Jasa",
        icon: HandPlatter,
        endpoint: "/order",
      },
      {
        label: "Jasa Berwaktu",
        icon: Clock,
        endpoint: "/order",
      },
    ],
    current: true,
  },
  {
    label: "Produk",
    icon: PackageSearch,
    submenus: [
      {
        label: "Kategori Produk",
        icon: Box,
        endpoint: "/",
      },
      {
        label: "Bahan Baku Produk",
        icon: ShoppingBasket,
        endpoint: "/",
      },
      {
        label: "Daftar Produk",
        icon: List,
        endpoint: "/",
      },
    ],
  },
  {
    label: "Transaksi",
    icon: ArrowRightLeft,
    endpoint: "/transaction",
  },
  {
    label: "Supplier",
    icon: Truck,
    endpoint: "/",
  },
  {
    label: "Rekon",
    icon: Shuffle,
    endpoint: "/",
  },
  {
    label: "Karyawan",
    icon: Users,
    endpoint: "/subuser",
  },
];

const page = usePage();
</script>
