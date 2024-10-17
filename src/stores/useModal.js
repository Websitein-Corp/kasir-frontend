import { defineStore } from "pinia";

export default defineStore("modal", {
  state: () => ({
    isOpened: false,
    title: "",
    icon: null,
    body: null,
    props: null,
  }),
  actions: {
    open() {
      this.isOpened = true;
    },
    close() {
      this.isOpened = false;
    },
    toggle() {
      this.isOpened = !this.isOpened;
    },
  },
});
