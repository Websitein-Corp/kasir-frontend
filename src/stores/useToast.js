import { defineStore } from "pinia";

export default defineStore("toast", {
  state: () => ({
    isActive: false,
    message: "",
    description: "",
    type: "INFO",
  }),
  actions: {
    trigger() {
      this.isActive = true;

      setTimeout(() => this.close(), 4000);
    },
    close() {
      this.isActive = false;
    },
  },
});
