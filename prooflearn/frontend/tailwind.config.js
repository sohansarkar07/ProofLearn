/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#020617",
                surface: "#0b0f1a",
                border: "rgba(255, 255, 255, 0.1)",
                primary: {
                    DEFAULT: "#22d3ee",
                    glow: "rgba(34, 211, 238, 0.5)",
                },
                secondary: {
                    DEFAULT: "#a855f7",
                    glow: "rgba(168, 85, 247, 0.5)",
                },
                accent: {
                    DEFAULT: "#ec4899",
                    glow: "rgba(236, 72, 153, 0.5)",
                }
            },
            animation: {
                'glow-pulse': 'glow-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                'glow-pulse': {
                    '0%, 100%': { opacity: 1, filter: 'brightness(1)' },
                    '50%': { opacity: 0.7, filter: 'brightness(1.5)' },
                },
                'float': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                }
            },
            backgroundImage: {
                'mesh-gradient': "radial-gradient(at 0% 0%, rgba(34, 211, 238, 0.15) 0, transparent 50%), radial-gradient(at 50% 0%, rgba(168, 85, 247, 0.1) 0, transparent 50%), radial-gradient(at 100% 0%, rgba(236, 72, 153, 0.15) 0, transparent 50%)",
            }
        },
    },
    plugins: [],
}
