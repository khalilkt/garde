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
        // primary: "#0055FF",
        // primaryLight: "#E5EEFF",
        // primaryLight2: "#B7CFFF",
        // black: "#222222",
        // primaryBorder: "#B7CFFF",
        // gray: "#888888",
        primary: "#00825B",
        primaryLight: "#DCFFF5",
        primaryLight2: "#DCFFF5",
        primaryBorder: "#E1E1E1",
        gray: "#AAAAAA",
        black: "#222222",
      },
    },
  },
  plugins: [],
};
