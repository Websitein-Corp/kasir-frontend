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
        ? state.items.reduce(
            (sum, val) => sum + val.selling_price * val.amount,
            0
          )
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

    clear(sku) {
      this.items.splice(this.items.map((item) => item.sku).indexOf(sku), 1);
    },

    add(sku, name, price, image) {
      if (!this.items.find((item) => item.name === name)) {
        this.items.push({
          sku,
          name,
          selling_price: price,
          image_url: image,
          amount: 1,
        });
      }
    },

    has(sku) {
      return this.items.map((item) => item.sku).includes(sku);
    },

    getItem(sku) {
      return this.items.find((item) => item.sku === sku);
    },

    setItem(sku, attr, value) {
      this.items.find((item) => item.sku === sku)[attr] = value;
    },

    increment(sku) {
      this.items.find((item) => item.sku === sku).amount++;
    },

    decrement(sku) {
      this.items.find((item) => item.sku === sku).amount--;
    },
  },
});
