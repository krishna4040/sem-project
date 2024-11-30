/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-light": "#FFFBE6",
        "secondary-light": "#FAEDCD",
        "primary-dark": "#C2FFC7",
        "secondary-dark": "#00712D",
      },
    },
  },
  plugins: [],
}
