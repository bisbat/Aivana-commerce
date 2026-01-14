import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      typography: {
        installationGuide: {
          css: {
            table: {
              borderCollapse: "collapse",
              width: "100%",
            },
            th: {
              border: "1px solid #475569",
              padding: "0.5rem",
            },
            td: {
              border: "1px solid #475569",
              padding: "0.5rem",
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
