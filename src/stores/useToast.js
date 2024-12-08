import { defineStore } from "pinia";

export default defineStore("toast", {
  state: () => ({
    isActive: false,
    message: "",
    description: "",
    type: "INFO",
    timout: null,
    duration: 4000,
  }),
  actions: {
    trigger() {
      this.isActive = true;

      this.timeout = setTimeout(() => this.close(), this.duration);
    },
    close() {
      this.isActive = false;

      clearTimeout(this.timeout);
    },
  },
});
