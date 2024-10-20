import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/HomeView.vue"),
  },
  {
    path: "/table",
    name: "table",
    component: () => import("@/views/TableView.vue"),
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
    path: "/table",
    name: "table",
    component: () => import("@/views/TableView.vue"),
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
    path: "/shop",
    name: "shop",
    component: () => import("@/views/ShopListView.vue"),
  },
  {
    path: "/recon",
    name: "recon",
    component: () => import("../views/ReconView.vue"),
  },
  {
    path: "/supplier",
    name: "supplier",
    component: () => import("../views/supplier/SupplierView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
