import { defineStore } from "pinia";
import router from "@/router";
import axios from "axios";

export default defineStore("auth", {
  state: () => ({
    authToken: localStorage.getItem("auth_token"),
    shopId: localStorage.getItem("shop_id"),
    permission: localStorage.getItem("permission"),
    isAuthenticated: false,
  }),

  actions: {
    async checkLoginSession(route) {
      try {
        await axios.get(`${process.env.VUE_APP_API_BASE_URL}/api/shop-list`, {
          headers: {
            Authorization: `Bearer ${this.authToken}`,
          },
          withCredentials: true,
        });

        this.isAuthenticated = true;

        if (
          route.path === "/login" ||
          (this.shopId && route.path === "/shop")
        ) {
          router.push("/");
        }
      } catch (response) {
        this.handleUnauthenticated(response);
      }
    },

    handleUnauthenticated(response) {
      if (response.status === 401) {
        router.push("/login");
      } else {
        if (this.authToken) {
          if (this.shopId) {
            router.push("/");
          } else {
            router.push("/shop");
          }
        } else {
          router.push("/login");
        }
      }
    },

    setAuthToken(token) {
      this.authToken = token;
      localStorage.setItem("auth_token", token);
    },

    setShopId(id) {
      this.shopId = id;
      localStorage.setItem("shop_id", id);
    },

    setPermission(permission) {
      this.permission = permission;
      localStorage.setItem("permission", permission);
    },

    clearLocalStorage() {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("shop_id");
      localStorage.removeItem("permission");
    },
  },
});
