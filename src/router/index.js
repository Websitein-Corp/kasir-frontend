import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "dashboard",
    component: () => import("@/views/DashboardView.vue"),
  },
  {
    path: "/order",
    name: "order",
    component: () => import("@/views/order/OrderView.vue"),
  },
  {
    path: "/bill/:invoiceNumber",
    name: "bill",
    component: () => import("@/views/order/BillView.vue"),
    props: true,
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/LoginView.vue"),
  },
  {
    path: "/transaction",
    name: "transaction",
    component: () => import("@/views/TransactionView.vue"),
  },
  {
    path: "/subuser",
    name: "subuser",
    component: () => import("@/views/subuser/SubuserView.vue"),
  },
  {
    path: "/product",
    name: "product",
    component: () => import("@/views/product/ProductView.vue"),
  },
  {
    path: "/category",
    name: "category",
    component: () => import("@/views/category/CategoryView.vue"),
  },
  {
    path: "/ingredient",
    name: "ingredient",
    component: () => import("@/views/ingredient/IngredientView.vue"),
  },
  {
    path: "/shop-list",
    name: "shop-list",
    component: () => import("@/views/ShopListView.vue"),
  },
  {
    path: "/recon",
    name: "recon",
    component: () => import("@/views/ReconView.vue"),
  },
  {
    path: "/supplier",
    name: "supplier",
    component: () => import("@/views/supplier/SupplierView.vue"),
  },
  {
    path: "/supply",
    name: "supply",
    component: () => import("@/views/supplier/supply/SupplyView.vue"),
  },
  {
    path: "/setting",
    name: "setting",
    component: () => import("@/views/SettingView.vue"),
  },
  {
    path: "/shop",
    name: "shop",
    component: () => import("@/views/shop/ShopView.vue"),
  },
  {
    path: "/forgot-password",
    name: "forgot-password",
    component: () => import("@/views/ForgotPasswordView.vue"),
  },
  {
    path: "/report-ingredient",
    name: "report-ingredient",
    component: () => import("@/views/report/IngredientReportView.vue"),
  },
  {
    path: "/report-product",
    name: "report-product",
    component: () => import("@/views/report/ProductReportView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
