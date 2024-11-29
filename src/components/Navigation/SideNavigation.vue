<template>
  <div
    class="fixed z-40 top-0 left-0 h-screen bg-slate-800/50"
    :class="{
      'w-screen lg:w-0': page.navIsOpened,
      'w-0': !page.navIsOpened,
    }"
  ></div>
  <div
    class="fixed z-50 top-4 left-5 p-2 lg:p-0 mt-3 lg:mt-0 hidden lg:block transition-opacity"
    :class="{
      'opacity-100': page.navIsOpened,
      'opacity-0': !page.navIsOpened,
    }"
  >
    <div class="w-20 h-20 p-2 mx-auto">
      <img
        src="@/assets/images/websiteinLogo.svg"
        alt="websiteinLogo.svg"
        class="object-cover"
      />
    </div>
  </div>
  <div class="fixed z-50 top-4 left-5 p-2 mt-3 lg:mt-0">
    <Menu
      class="cursor-pointer transition-all"
      :class="{
        'rotate-180 lg:ml-24': page.navIsOpened,
      }"
      size="40"
      @click="page.navIsOpened = !page.navIsOpened"
    />
  </div>
  <div
    class="shrink-0 transition-all"
    :class="{
      'lg:w-[200px]': page.navIsOpened,
      'lg:w-[100px]': !page.navIsOpened,
    }"
  ></div>
  <div
    class="fixed transition-all z-40"
    :class="{
      'w-[100px] lg:w-[200px] opacity-100': page.navIsOpened,
      'w-0 lg:w-[100px] opacity-0 lg:opacity-100 overflow-hidden':
        !page.navIsOpened,
    }"
  >
    <nav
      class="w-[300px] lg:w-[200px] h-dvh pt-4 flex flex-col overflow-x-visible"
    >
      <div
        class="w-[100px] lg:w-[200px] absolute top-0 left-0 h-full bg-primary-50"
      ></div>
      <div
        class="w-[100px] lg:w-[200px] p-2 mt-20 relative top-0 left-0 flex justify-center lg:hidden"
      >
        <img
          src="@/assets/images/websiteinLogo.svg"
          alt="websiteinLogo.svg"
          class="object-cover"
        />
      </div>
      <div
        class="flex flex-col grow lg:mt-24 h-[70%] overflow-y-scroll overflow-x-visible no-scrollbar"
        :class="{
          'pointer-events-none lg:pointer-events-auto': !page.navIsOpened,
        }"
      >
        <NavigationMenu
          class="w-[100px] lg:w-[200px]"
          v-for="(menu, index) in filteredMenus"
          :key="index"
          :label="menu.label"
          :icon="menu.icon"
          :endpoint="menu.endpoint"
          :submenus="menu.submenus"
          :current="menu.current"
          @click="
            setCurrent(menu.label, menu.submenus && menu.submenus.length > 0)
          "
          @submenu-click="setCurrent(menu.label, false)"
        />
      </div>
      <div
        class="w-[100px] lg:w-[200px] h-20 flex flex-col justify-end text-red-500 mb-4 lg:mb-0"
      >
        <div class="hidden lg:block">
          <NavigationMenu
            :icon="LogOut"
            label="Logout"
            :submenus="logoutSubmenus"
            isLogout
            @submenu-click="
              (label) => (label === 'Logout' ? logout() : backToShopList())
            "
          />
        </div>
        <div class="block lg:hidden">
          <NavigationMenu
            :icon="LogOut"
            :submenus="logoutSubmenus"
            isLogout
            @submenu-click="
              (label) => (label === 'Logout' ? logout() : backToShopList())
            "
          />
        </div>
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
  Box,
  ShoppingBasket,
  List,
  Menu,
  Store,
  Settings,
  Package,
  UserCog,
} from "lucide-vue-next";
import NavigationMenu from "@/components/Navigation/NavigationMenu.vue";
import usePage from "@/stores/usePage";
import { axios } from "@/sdk/axios";
import router from "@/router";
import useToast from "@/stores/useToast";
import useAuth from "@/stores/useAuth";
import { ref } from "vue";

const menus = ref([
  {
    label: "Beranda",
    endpoint: "/",
    icon: ChartPie,
    current: true,
  },
  {
    label: "Pesan",
    icon: ShoppingCart,
    endpoint: "/order",
    current: false,
  },
  {
    label: "Produk",
    icon: PackageSearch,
    submenus: [
      {
        label: "Daftar Produk",
        icon: List,
        endpoint: "/product",
      },
      {
        label: "Kategori Produk",
        icon: Box,
        endpoint: "/category",
      },
      {
        label: "Bahan Baku Produk",
        icon: ShoppingBasket,
        endpoint: "/ingredient",
      },
    ],
    current: false,
  },
  {
    label: "Transaksi",
    icon: ArrowRightLeft,
    endpoint: "/transaction",
    current: false,
  },
  {
    label: "Supplier",
    icon: Truck,
    submenus: [
      {
        label: "Supplier",
        icon: UserCog,
        endpoint: "/supplier",
      },
      {
        label: "Supply",
        icon: Package,
        endpoint: "/supply",
      },
    ],
    current: false,
  },
  {
    label: "Rekon",
    icon: Shuffle,
    endpoint: "/recon",
    current: false,
  },
  {
    label: "Karyawan",
    icon: Users,
    endpoint: "/subuser",
    current: false,
  },
  {
    label: "Konfigurasi",
    icon: Settings,
    endpoint: "/setting",
    current: false,
  },
  {
    label: "Toko",
    icon: Store,
    endpoint: "/shop",
    current: false,
  },
]);

const logoutSubmenus = [
  {
    label: "Toko",
    icon: Store,
  },
  {
    label: "Logout",
    icon: LogOut,
  },
];

const rolePermissions = {
  KASIR: ["Pesan", "Transaksi"],
  PENYIMPANAN: [
    "Kategori Produk",
    "Daftar Produk",
    "Bahan Baku Produk",
    "Supplier",
    "Supply",
  ],
  MANAGER: [
    "Beranda",
    "Pesan",
    "Produk",
    "Transaksi",
    "Supplier",
    "Rekon",
    "Karyawan",
    "Konfigurasi",
    "Toko",
  ],
  MASTER: null,
};

const auth = useAuth();
const page = usePage();
const toast = useToast();

const backToShopList = () => {
  auth.clearLocalStorage("shop_id");
  router.push("/shop-list");
};

function filterMenuByRole(menus, role) {
  const allowedLabels = rolePermissions[role] || [];

  if (role === "MASTER") {
    return menus;
  } else {
    return menus
      .map((menu) => {
        if (menu.submenus) {
          const filteredSubmenus = menu.submenus.filter((submenu) =>
            allowedLabels.includes(submenu.label)
          );
          if (filteredSubmenus.length > 0) {
            return { ...menu, submenus: filteredSubmenus };
          }
        }

        if (allowedLabels.includes(menu.label)) {
          return menu;
        }
        return null;
      })
      .filter((menu) => menu !== null);
  }
}

const filteredMenus = filterMenuByRole(menus.value, auth.permission);

const logout = () => {
  const baseURL = process.env.VUE_APP_API_BASE_URL;
  const endpoint = `${baseURL}/api/auth/logout`;

  axios
    .post(
      endpoint,
      {},
      {
        headers: {
          Authorization: `Bearer ${auth.authToken}`,
        },
        withCredentials: true,
      }
    )
    .then(({ data }) => {
      if (!data.error_type) {
        toast.message = "Sukses";
        toast.description = "Logout berhasil!";
        toast.type = "SUCCESS";
        toast.trigger();

        router.push("/login");
      } else {
        toast.message = "Gagal";
        toast.description = "Logout gagal!";
        toast.type = "FAILED";
        toast.trigger();
      }
    });

  auth.clearLocalStorage();
};

const setCurrent = (label, hasSubmenu) => {
  if (!hasSubmenu) {
    menus.value.map((menu) => (menu.current = false));
    menus.value.find((menu) => menu["label"] === label).current = true;
  }
};
</script>
