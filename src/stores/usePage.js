import { defineStore } from "pinia";

export default defineStore("page", {
  state: () => ({
    navIsOpened: true,
    order: {
      step: 0,
    },
  }),
});
