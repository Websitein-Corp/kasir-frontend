import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
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
