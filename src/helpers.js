export default {
  money: (value) => {
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    });

    return formatter.format(value).replace(/\s/g, "");
  },

  getHourDifference: (date1, date2) => {
    if (date1 && date2) {
      const diffInMs = Math.abs(new Date(date2) - new Date(date1));

      return diffInMs / (1000 * 60 * 60);
    } else {
      return 0;
    }
  },

  formatDate: (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  },

  convertToCurrency: (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  },

  parseRupiah: (value) => {
    const numberString = value.toString().replace("Rp", "").replace(".", "");
    return parseInt(numberString, 10);
  },
};
