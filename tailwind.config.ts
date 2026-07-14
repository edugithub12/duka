import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0E232B",
        paper: "#F6FAFB",
        brand: "#3EAECC",
        brandDark: "#257A92",
        signal: "#F2A33D",
        alert: "#C2452C",
        muted: "#5C7680",
        line: "#D8E6EA",
      },
      fontFamily: {
        display: ["var(--font-archivo)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        tag: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
