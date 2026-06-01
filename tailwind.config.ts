import type { Config } from "tailwindcss";

// Lumen design tokens — luminous editorial direction (chosen by the user from the
// Claude Design handoff). Spectral serif on warm ivory, royal-violet ink, antique gold.
// Source of truth for color/type/motion; mirrored from site/lumen-theme.jsx.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#F8F2E7",
        bgAlt: "#F2EADB",
        paper: "#FFFFFF",
        ink: "#241B2E",
        sub: "#6E6456",
        faint: "#9A8E7C",
        violet: "#5A3E8C",
        violetDeep: "#3F2A66",
        gold: "#B0822B",
        goldSoft: "#C99A3F",
        line: "rgba(36,27,46,0.12)",
        lineSoft: "rgba(36,27,46,0.07)",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Spectral", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Hanken Grotesk", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        kicker: "0.22em",
      },
      transitionTimingFunction: {
        lumen: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      maxWidth: {
        site: "1180px",
      },
      keyframes: {
        pulse: {
          "0%,100%": { boxShadow: "0 0 0 0 rgba(176,130,43,0.45)" },
          "50%": { boxShadow: "0 0 0 6px rgba(176,130,43,0)" },
        },
      },
      animation: {
        "pulse-dot": "pulse 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
