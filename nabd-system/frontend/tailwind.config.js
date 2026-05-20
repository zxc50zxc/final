/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        nabd: {
          primary: "#0077B6",
          teal: "#00A896",
          dark: "#1A1A2E",
        },
      },
      fontFamily: {
        sans: ["Inter", "IBM Plex Sans Arabic", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
