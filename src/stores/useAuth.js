import { defineStore } from "pinia";
import router from "@/router";
import axios from "axios";

export default defineStore("auth", {
  state: () => ({
    authToken: localStorage.getItem("auth_token"),
    shopId: localStorage.getItem("shop_id"),
    shopName: localStorage.getItem("shop_name"),
    shopAddress: localStorage.getItem("shop_address"),
    permission: localStorage.getItem("permission"),
  }),

  actions: {
    handleUnauthenticated() {
      const baseURL = process.env.VUE_APP_API_BASE_URL;
      const endpoint = `${baseURL}/api/auth/logout`;

      axios
        .post(
          endpoint,
          {},
          {
            headers: {
              Authorization: `Bearer ${this.authToken}`,
            },
            withCredentials: true,
          }
        )
        .then(() => {
          this.clearLocalStorage();

          router.push("/login");
        })
        .catch(() => {
          this.clearLocalStorage();

          router.push("/login");
        });
    },

    handleAxiosError() {
      if (this.authToken) {
        if (!this.shopId) {
          router.push("/shop-list");
        }
      } else {
        router.push("/login");
      }
    },

    setAuthToken(token) {
      this.authToken = token;
      localStorage.setItem("auth_token", token);
    },

    setShopId(id, name, address) {
      this.shopId = id;
      localStorage.setItem("shop_id", id);
      localStorage.setItem("shop_name", name);
      localStorage.setItem("shop_address", address);
    },

    setPermission(permission) {
      this.permission = permission;
      localStorage.setItem("permission", permission);
    },

    clearLocalStorage(key = null) {
      if (key) {
        if (key === "shop_id") {
          localStorage.removeItem("shop_id");
          localStorage.removeItem("shop_name");
          localStorage.removeItem("shop_address");
          this.shopId = null;
        } else if (key === "permission") {
          localStorage.removeItem("permission");
          this.permission = null;
        } else {
          localStorage.removeItem("auth_token");
          this.authToken = null;
        }
      } else {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("permission");
        localStorage.removeItem("shop_id");
        this.authToken = null;
        this.permission = null;
        this.shopId = null;
      }
    },
  },
});
