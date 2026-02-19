/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#09090b",
                surface: "#18181b",
                primary: "#6366f1", // Indigo
                success: "#22c55e",
                error: "#ef4444",
                text: "#fafafa",
                textSecondary: "#a1a1aa"
            }
        },
    },
    plugins: [],
}
