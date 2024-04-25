/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        outfit: ["Outfit", "sans-serif"],
      },
      colors: {
        primary: "#0055FF",
        primaryLight: "#E5EEFF",
        primaryLight2: "#B7CFFF",
        black: "#222222",
        primaryBorder: "#B7CFFF",
        gray: "#888888",
      },
    },
  },
  plugins: [],
};
