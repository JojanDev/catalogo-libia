/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#FAF8F5",
        "warm-accent": "#E8A838",
        "warm-accent-hover": "#D4942E",
        "text-primary": "#2C3E50",
        "text-muted": "#8B7E74",
        "card-bg": "#FFFFFF",
        "border-soft": "#E8E0D8",
        "pastel-blue": "#A8D8EA",
        "pastel-green": "#B5EAD7",
        "pastel-pink": "#FFD1DC",
      },
      fontFamily: {
        heading: ["Comfortaa", "sans-serif"],
        body: ["Nunito", "sans-serif"],
      },
      borderRadius: {
        soft: "16px",
        softer: "24px",
      },
    },
  },
  plugins: [],
};
