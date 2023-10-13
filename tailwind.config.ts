import { radixThemePreset } from "radix-themes-tw";
import type { Config } from "tailwindcss";

const config: Config = {
  presets: [radixThemePreset],
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        bounce: {
          "0%, 20%, 50%, 80%, 100%": { transform: "translateY(0)" },
          "40%": { transform: "translateY(-30%)" },
          "60%": { transform: "translateY(-15%)" },
        },
      },
      animation: {
        bounce: "bounce 1s infinite",
      },
      height: {
        "1/4-screen": "25vh",
      },
    },
  },
};

module.exports = config;
