import { defineStore } from "pinia";

export default defineStore("toast", {
  state: () => ({
    isActive: false,
    message: "",
    description: "",
    type: "INFO",
    timout: null,
  }),
  actions: {
    trigger() {
      this.isActive = true;

      this.timeout = setTimeout(() => this.close(), 4000);
    },
    close() {
      this.isActive = false;

      clearTimeout(this.timeout);
    },
  },
});
