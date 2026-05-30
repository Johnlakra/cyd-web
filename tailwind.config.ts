import type { Config } from "tailwindcss";

// NOTE: tokens here are PLACEHOLDERS. The anubhav-web-designer pass owns final
// tokens (src/styles/tokens.ts + DESIGN.md). Warm/luminous, reverent-joyful, NO purple.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: "#1a1714",
        paper: "#faf7f2",
        primary: "#b4541e",
        accent: "#c8a24a",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
