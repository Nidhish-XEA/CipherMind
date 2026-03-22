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
        background: "#0a0a0f",
        primary: "#00d4ff",
        secondary: "#7c3aed",
        success: "#00ff88",
        surface: "#111116",
        border: "#1f1f2e",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-space-mono)", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        glow: {
          "0%": { textShadow: "0 0 5px #00d4ff, 0 0 10px #00d4ff, 0 0 20px #7c3aed" },
          "100%": { textShadow: "0 0 20px #00d4ff, 0 0 40px #00d4ff, 0 0 80px #7c3aed" },
        },
      }
    },
  },
  plugins: [],
};
export default config;
