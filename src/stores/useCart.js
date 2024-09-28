import { defineStore } from "pinia";

export default defineStore("cart", {
  state: () => ({
    items: [],
    discount: 0,
    totalPaid: 0,
  }),
  getters: {
    sum: (state) =>
      state.items.length > 0
        ? state.items.reduce((sum, val) => sum + val.price * val.amount, 0)
        : 0,

    amount: (state) =>
      state.items.length > 0
        ? state.items.reduce((sum, val) => sum + val.amount, 0)
        : 0,

    tax() {
      return this.sum * 0.1;
    },

    total(state) {
      return this.sum + this.tax - state.discount;
    },
  },
  actions: {
    clearAll() {
      this.items = [];
    },

    clear(name) {
      this.items.splice(this.items.map((item) => item.name).indexOf(name), 1);
    },

    add(name, price, image) {
      if (!this.items.find((item) => item.name === name)) {
        this.items.push({
          name: name,
          price: price,
          image: image,
          amount: 1,
        });
      }
    },

    has(name) {
      return this.items.map((item) => item.name).includes(name);
    },

    getItem(name) {
      return this.items.find((item) => item.name === name);
    },

    setItem(name, attr, value) {
      this.items.find((item) => item.name === name)[attr] = value;
    },

    increment(name) {
      this.items.find((item) => item.name === name).amount++;
    },

    decrement(name) {
      this.items.find((item) => item.name === name).amount--;
    },
  },
});
