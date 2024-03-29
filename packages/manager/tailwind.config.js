/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      blue: {
        DEFAULT: "#007AFF",
        light: "#ECF5FF",
      },
      red: "#FF367A",
      white: "#FFFFFF",
      black: "#111111",
      gray: {
        DEFAULT: "#838A9A",
        light: "#F3F6FA",
        dark: "#454F5D",
        border: "#D4D4D4",
      },
    },
    extend: {
      boxShadow: {
        DEFAULT: "0px 4px 12px rgba(150, 154, 165, 0.16)",
        hover: "0px 4px 12px rgba(0, 122, 255, 0.3)",
      },
    },
  },
};
