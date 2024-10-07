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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
