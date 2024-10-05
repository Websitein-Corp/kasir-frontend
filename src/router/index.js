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
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/LoginView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
