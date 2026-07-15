import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50:  "#e8eef5",
          100: "#c5d3e5",
          200: "#9fb6d3",
          300: "#7899c1",
          400: "#5a82b3",
          500: "#3c6ba5",
          600: "#2f5a90",
          700: "#1B3A5C",
          DEFAULT: "#1B3A5C",
          800: "#122840",
          900: "#0a1828",
        },
        secondary: {
          50:  "#fef9ec",
          100: "#fdefc9",
          200: "#fbe3a2",
          300: "#f9d475",
          400: "#f7c74d",
          500: "#F0A500",
          DEFAULT: "#F0A500",
          600: "#d08f00",
          700: "#a87200",
          800: "#7d5500",
          900: "#543800",
        },
        accent: {
          50:  "#e4f5f0",
          100: "#bbe6d8",
          200: "#8dd5be",
          300: "#5dc4a4",
          400: "#34b690",
          500: "#0C9070",
          DEFAULT: "#0C9070",
          600: "#0a7d61",
          700: "#076651",
          800: "#044e3f",
          900: "#02382d",
        },
        navy: {
          900: "#0a1628",
          800: "#0e1f3a",
          700: "#152844",
          600: "#1B3A5C",
        },
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        card:          "0 4px 24px rgba(27, 58, 92, 0.08)",
        "card-hover":  "0 8px 40px rgba(27, 58, 92, 0.16)",
        nav:           "0 2px 20px rgba(27, 58, 92, 0.10)",
        "lg-primary":  "0 8px 32px rgba(27, 58, 92, 0.20)",
      },
      animation: {
        "fade-in":    "fadeIn 0.6s ease-out forwards",
        "slide-up":   "slideUp 0.6s ease-out forwards",
        "slide-down": "slideDown 0.4s ease-out forwards",
        "float":      "float 3s ease-in-out infinite",
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn:    { "0%": { opacity: "0" },                                           "100%": { opacity: "1" } },
        slideUp:   { "0%": { opacity: "0", transform: "translateY(24px)" },            "100%": { opacity: "1", transform: "translateY(0)" } },
        slideDown: { "0%": { opacity: "0", transform: "translateY(-12px)" },           "100%": { opacity: "1", transform: "translateY(0)" } },
        float:     { "0%, 100%": { transform: "translateY(0)" },                       "50%":  { transform: "translateY(-8px)" } },
      },
      backgroundImage: {
        "hero-gradient":       "linear-gradient(135deg, rgba(10,22,40,0.88) 0%, rgba(27,58,92,0.65) 50%, rgba(12,144,112,0.35) 100%)",
        "card-gradient":       "linear-gradient(to top, rgba(10,22,40,0.92) 0%, transparent 60%)",
        "section-gradient":    "linear-gradient(135deg, #f0f4f8 0%, #e8eef5 100%)",
        "primary-gradient":    "linear-gradient(135deg, #1B3A5C 0%, #2A5A8C 100%)",
        "secondary-gradient":  "linear-gradient(135deg, #F0A500 0%, #F5C042 100%)",
        "accent-gradient":     "linear-gradient(135deg, #0C9070 0%, #12B891 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
