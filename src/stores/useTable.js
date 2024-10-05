import { defineStore } from "pinia";

export default defineStore("table", {
  state: () => ({
    items: [
      {
        invoiceNumber: "tokotok_001",
        trDatetime: "2024-08-19 10:00:00",
        totalPrice: "Rp200.000",
        status: "SUCCESS",
      },
      {
        invoiceNumber: "tokotok_002",
        trDatetime: "2024-08-19 10:00:00",
        totalPrice: "Rp200.000",
        status: "SUCCESS",
      },
    ],
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
