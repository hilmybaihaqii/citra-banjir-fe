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
        // Warna Slate yang "Deep" untuk kesan tech/gov modern
        slate: {
          850: "#151f32",
          900: "#0f172a",
          950: "#020617",
        },
        // Warna indikator status (Neon vibes)
        brand: {
          blue: "#3b82f6",
          accent: "#06b6d4", // Cyan
          danger: "#ef4444",
          warning: "#f59e0b",
          success: "#10b981",
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
export default config;