import { defineStore } from "pinia";

export default defineStore("page", {
  state: () => ({
    navIsOpened: window.innerWidth >= 1024,
    order: {
      step: 0,
    },
  }),
});
