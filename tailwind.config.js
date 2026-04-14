/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef9ff",
          100: "#daf2ff",
          200: "#bde8ff",
          300: "#8bd8ff",
          400: "#52c3ff",
          500: "#28a8f8",
          600: "#1087dc",
          700: "#106dae",
          800: "#135d8f",
          900: "#154f76",
        },
      },
    },
  },
  plugins: [],
};
