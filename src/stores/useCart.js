import { defineStore } from "pinia";
import helpers from "@/helpers";

export default defineStore("cart", {
  state: () => ({
    items: [],
    discount: 0,
    totalPaid: 0,
    settings: {
      active_tax_flag: true,
    },
  }),
  getters: {
    sum: (state) => {
      return state.items.length > 0
        ? state.items.reduce(
            (sum, val) =>
              sum +
              helpers.parseRupiah(val.selling_price) *
                (val.amount ||
                  helpers.getHourDifference(
                    val.service_start,
                    val.service_end
                  )),
            0
          )
        : 0;
    },

    amount: (state) =>
      state.items.length > 0
        ? state.items.reduce((sum, val) => sum + (val.amount || 1), 0)
        : 0,

    tax(state) {
      return (
        (this.sum - state.discount) * (this.settings.active_tax_flag ? 0.1 : 0)
      );
    },

    total() {
      return this.sum + this.tax;
    },
  },
  actions: {
    clearAll() {
      this.items = [];
    },

    clear(sku) {
      this.items.splice(this.items.map((item) => item.sku).indexOf(sku), 1);
    },

    add(sku, name, type, price, image) {
      if (!this.getItem(sku)) {
        this.items.push({
          sku,
          name,
          type,
          selling_price: price,
          image_url: image,
          amount: type === "SERVICE TIME" ? null : 1,
          service_start:
            type === "SERVICE TIME" ? helpers.formatDate(new Date()) : null,
          service_end:
            type === "SERVICE TIME"
              ? helpers.formatDate(new Date(new Date().getTime() + 3600000))
              : null,
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
      this.getItem(sku)[attr] = value;
    },

    increment(sku) {
      this.getItem(sku).amount++;
    },

    decrement(sku) {
      this.getItem(sku).amount--;
    },

    setServiceTime(sku, serviceRange) {
      const [startString, endString] = serviceRange;
      const serviceStart = helpers.formatDate(startString);
      const serviceEnd = helpers.formatDate(endString);

      this.getItem(sku).service_start = serviceStart;
      this.getItem(sku).service_end = serviceEnd;
    },
  },
});
