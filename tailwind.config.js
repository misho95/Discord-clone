/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      height: {
        C_H: "calc(100vh - 32px)",
        C_H2: "calc(100vh - 32px - 48px)",
      },
    },
  },
  plugins: [],
};
