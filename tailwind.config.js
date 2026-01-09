module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2b8cee",
        "background-light": "#f6f6f8",
        "background-dark": "#131022",
        "surface-light": "#ffffff",
        "surface-dark": "#1a2632",
        "border-light": "#e2e8f0",
        "border-dark": "#2d3b4e",
      },
      fontFamily: {
        display: ["Manrope", "Noto Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
