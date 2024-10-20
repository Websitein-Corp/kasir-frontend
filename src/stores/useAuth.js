import { defineStore } from "pinia";
import router from "@/router";
import axios from "axios";

export default defineStore("auth", {
  state: () => ({
    authToken: localStorage.getItem("auth_token"),
    shopId: localStorage.getItem("shop_id"),
    isAuthenticated: false,
  }),

  actions: {
    async checkLoginSession(route) {
      if (!this.authToken) {
        await router.push("/login");
      } else if (!this.shopId) {
        await router.push("/shop");
      }

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
          await router.push("/");
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

    clearLocalStorage(key = null) {
      if (key) {
        if (key === "shop_id") {
          localStorage.removeItem("shop_id");
          this.shopId = null;
        } else {
          localStorage.removeItem("auth_token");
          this.authToken = null;
        }
      } else {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("shop_id");
        this.authToken = null;
        this.shopId = null;
      }
    },
  },
});
