import { defineStore } from "pinia";
import router from "@/router";

export default defineStore("auth", {
  state: () => ({
    authToken: localStorage.getItem("auth_token"),
    shopId: localStorage.getItem("shop_id"),
  }),

  actions: {
    async checkLoginSession() {
      if (this.authToken) {
        if (this.shopId) {
          await router.push("/home");
        } else {
          await router.push("/shop");
        }
      } else {
        await router.push("/login");
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
  },
});
