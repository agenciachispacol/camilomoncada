import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      colors: {
        neon: {
          pink: "#ff2bd6",
          cyan: "#00f0ff",
          purple: "#b026ff",
          green: "#39ff14",
          yellow: "#fff503",
        },
        ink: {
          950: "#05030f",
          900: "#0a0718",
          800: "#120a26",
        },
      },
      boxShadow: {
        neon: "0 0 20px rgba(255,43,214,0.45), 0 0 40px rgba(176,38,255,0.35)",
        "neon-cyan": "0 0 20px rgba(0,240,255,0.45), 0 0 40px rgba(0,240,255,0.3)",
        "neon-soft": "0 0 12px rgba(255,43,214,0.35)",
      },
      backgroundImage: {
        "grid-neon":
          "linear-gradient(rgba(255,43,214,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.08) 1px, transparent 1px)",
        "radial-neon":
          "radial-gradient(circle at 30% 10%, rgba(176,38,255,0.25), transparent 50%), radial-gradient(circle at 80% 80%, rgba(0,240,255,0.2), transparent 55%)",
      },
      animation: {
        "pulse-neon": "pulseNeon 3s ease-in-out infinite",
        "float-slow": "float 6s ease-in-out infinite",
        "float-slower": "float 9s ease-in-out infinite",
        "gradient-shift": "gradientShift 8s ease infinite",
        marquee: "marquee 25s linear infinite",
        "spin-slow": "spin 14s linear infinite",
        flicker: "flicker 2.6s infinite",
        "border-run": "borderRun 4s linear infinite",
      },
      keyframes: {
        pulseNeon: {
          "0%,100%": {
            textShadow:
              "0 0 8px #ff2bd6, 0 0 20px #ff2bd6, 0 0 35px #b026ff",
          },
          "50%": {
            textShadow:
              "0 0 14px #00f0ff, 0 0 28px #00f0ff, 0 0 48px #b026ff",
          },
        },
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        gradientShift: {
          "0%,100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        flicker: {
          "0%,19%,21%,23%,25%,54%,56%,100%": { opacity: "1" },
          "20%,24%,55%": { opacity: "0.4" },
        },
        borderRun: {
          "0%": { backgroundPosition: "0% 0%" },
          "100%": { backgroundPosition: "300% 0%" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
