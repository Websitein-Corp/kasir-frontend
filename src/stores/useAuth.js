import { defineStore } from "pinia";
import router from "@/router";
import axios from "axios";

export default defineStore("auth", {
  state: () => ({
    authToken: localStorage.getItem("auth_token"),
    shopId: localStorage.getItem("shop_id"),
    shopName: localStorage.getItem("shop_name"),
    shopAddress: localStorage.getItem("shop_address"),
    shopImageUrl: localStorage.getItem("shop_image_url"),
    shopImageReceipt: localStorage.getItem("shop_image_receipt"),
    userType: localStorage.getItem("userType"),
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

    setShopId(id, name, address, imageUrl, imageReceipt) {
      this.shopId = id;
      localStorage.setItem("shop_id", id);
      this.shopName = name;
      localStorage.setItem("shop_name", name);
      this.shopAddress = address;
      localStorage.setItem("shop_address", address);
      this.shopImageUrl = imageUrl;
      localStorage.setItem("shop_image_url", imageUrl);
      this.shopImageReceipt = imageReceipt;
      localStorage.setItem("shop_image_receipt", imageReceipt);
    },

    setPermission(userType, permission) {
      this.userType = userType;
      this.permission = permission;
      localStorage.setItem("permission", permission);
      localStorage.setItem("userType", userType);
    },

    clearLocalStorage(key = null) {
      if (key) {
        if (key === "shop_id") {
          localStorage.removeItem("shop_id");
          localStorage.removeItem("shop_name");
          localStorage.removeItem("shop_address");
          localStorage.removeItem("shop_image_url");
          localStorage.removeItem("shop_image_receipt");
          this.shopId = null;
          this.shopName = null;
          this.shopAddress = null;
          this.shopImageUrl = null;
          this.shopImageReceipt = null;
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
        localStorage.removeItem("shop_name");
        localStorage.removeItem("shop_address");
        localStorage.removeItem("shop_image_url");
        localStorage.removeItem("shop_image_receipt");
        this.authToken = null;
        this.permission = null;
        this.shopId = null;
      }
    },
  },
});
