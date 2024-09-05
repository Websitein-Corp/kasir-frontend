/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#F0FDF9",
          100: "#CDFAEE",
          200: "#9AF5DD",
          300: "#48E5C2",
          400: "#2FD2B3",
          500: "#16B699",
          600: "#0F927E",
          700: "#107566",
          800: "#125D53",
          900: "#144D45",
          950: "#052E2B",
        },
      },
    },
    fontFamily: {
      helvetica: ["Helvetica"],
      "helvetica-light": ["HelveticaLight"],
    },
  },
  plugins: [],
};
