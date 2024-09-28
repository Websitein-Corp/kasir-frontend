import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/table",
    name: "table",
    component: () => import("../views/TableView.vue"),
  },
  {
    path: "/order",
    name: "order",
    component: () => import("../views/order/OrderView.vue"),
  },
  {
    path: "/bill",
    name: "bill",
    component: () => import("../views/order/BillView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
