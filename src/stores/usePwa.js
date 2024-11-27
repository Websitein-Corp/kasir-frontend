import { defineStore } from "pinia";

export default defineStore("pwa", {
  state: () => ({
    deferredPrompt: null,
    isInstallable: false,
  }),
});
