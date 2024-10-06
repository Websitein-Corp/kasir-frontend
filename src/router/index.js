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
    path: "/bill",
    name: "bill",
    component: () => import("@/views/order/BillView.vue"),
  },
  {
    path: "/table",
    name: "table",
    component: () => import("@/views/TableView.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/LoginView.vue"),
  },
  {
    path: "/transaction",
    name: "transaction",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/TransactionView.vue"),
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
