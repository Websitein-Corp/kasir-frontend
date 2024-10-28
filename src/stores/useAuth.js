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
      if (!this.authToken) {
        await router.push("/login");
        return;
      } else if (!this.shopId) {
        await router.push("/shop");
        return;
      }

      axios
        .get(`${process.env.VUE_APP_API_BASE_URL}/api/auth/check`, {
          headers: {
            Authorization: `Bearer ${this.authToken}`,
          },
          withCredentials: true,
        })
        .then((res) => {
          this.isAuthenticated = res.data.data.is_logged_in;

          if (this.isAuthenticated) {
            if (
              route.path === "/login" ||
              (this.shopId && route.path === "/shop")
            ) {
              router.push("/");
              return true;
            }
          } else {
            this.handleUnauthenticated();
            return false;
          }
        })
        .catch(async () => {
          await this.handleUnauthenticated();
          return false;
        });
    },

    async handleUnauthenticated() {
      const baseURL = process.env.VUE_APP_API_BASE_URL;
      const endpoint = `${baseURL}/api/auth/logout`;

      try {
        await axios.post(
          endpoint,
          {},
          {
            headers: {
              Authorization: `Bearer ${this.authToken}`,
            },
            withCredentials: true,
          }
        );
      } catch (error) {}
      this.clearLocalStorage();

      await router.push("/login");
    },

    handleAxiosError(response) {
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

    clearLocalStorage(key = null) {
      if (key) {
        if (key === "shop_id") {
          localStorage.removeItem("shop_id");
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
