import { defineStore } from "pinia";

export default defineStore("table", {
  state: () => ({
    items: [],
    filters: {
      keyword: "",
      date: [
        new Date(new Date().setMonth(new Date().getMonth() - 1))
          .toISOString()
          .slice(0, 10),
        new Date().toISOString().slice(0, 10),
      ],
    },
    page: {
      current: 1,
      last: 1,
      per: 10,
      total: 0,
      links: {
        prev: "",
        next: "",
      },
    },
  }),

  actions: {
    nextPage() {
      if (this.page.current < this.page.last) {
        this.page.current++;
      }
    },

    prevPage() {
      if (this.page.current > 1) {
        this.page.current--;
      }
    },

    firstPage() {
      this.page.current = 1;
    },

    lastPage() {
      this.page.current = this.page.last;
    },

    resetPage() {
      this.page.current = 1;
      this.filters.keyword = "";
      this.filters.date = [
        new Date(new Date().setMonth(new Date().getMonth() - 1))
          .toISOString()
          .slice(0, 10),
        new Date().toISOString().slice(0, 10),
      ];
    },
  },
});
