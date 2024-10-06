import { defineStore } from "pinia";

export default defineStore("table", {
  state: () => ({
    items: [],
    filters: {
      keyword: "",
      date: [
        new Date().toISOString().slice(0, 10),
        new Date().toISOString().slice(0, 10),
      ],
    },
    page: {
      current: 1,
      last: 1,
      per: 10,
      total: 0,
      links: [],
    },
  }),
});
