import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sand: {
          50:  "#FDFCF8",
          100: "#F5F0E8",
          200: "#EDE6D8",
          300: "#DDD4C0",
        },
        forest: {
          900: "#12271D",
          800: "#1A3828",
          700: "#234D36",
        },
        ink: {
          900: "#1A1A1A",
          700: "#3D3D3D",
          500: "#6B6B6B",
          400: "#888888",
          300: "#A8A8A8",
          200: "#D4D4D4",
          100: "#EBEBEB",
        },
        badge: {
          green: "#3A5C43",
        },
      },
      fontFamily: {
        sans: ["Helvetica Neue", "Helvetica", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        display: ["Helvetica Neue", "Helvetica", "-apple-system", "sans-serif"],
        mono: ["DM Mono", "monospace"],
      },
      borderRadius: {
        "4xl": "2rem",
        "3xl": "1.5rem",
        "2xl": "1rem",
      },
      transitionTimingFunction: {
        "expo-out": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      animation: {
        "marquee": "marquee 30s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%":   { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
