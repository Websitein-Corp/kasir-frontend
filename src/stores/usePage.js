import { defineStore } from "pinia";

export default defineStore("page", {
  state: () => ({
    navIsOpened: window.innerWidth >= 1024,
    order: {
      step: 0,
    },
    loading: false,
    buttonLoading: false,
    scroll: 0,
  }),
});
