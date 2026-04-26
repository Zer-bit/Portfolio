import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                accent: {
                    50: "#f7fee7",
                    100: "#ecfccb",
                    200: "#d9f99d",
                    300: "#bef264",
                    400: "#a3e635",
                    500: "#9cbd09",
                    600: "#7a9a07",
                    700: "#65a30d",
                    800: "#4d7c0f",
                    900: "#365314",
                    950: "#1a2e05",
                },
            },
            animation: {
                "float": "float 8s ease-in-out infinite",
            },
            keyframes: {
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-20px)" },
                },
            },
        },
    },
    plugins: [],
};
export default config;
