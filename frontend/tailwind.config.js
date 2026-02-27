/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            colors: {
                primary: {
                    50: '#eef2ff',
                    100: '#e0e7ff',
                    200: '#c7d2fe',
                    300: '#a5b4fc',
                    400: '#818cf8',
                    500: '#6366f1',
                    600: '#4f46e5',
                    700: '#4338ca',
                    800: '#3730a3',
                    900: '#312e81',
                },
                accent: {
                    50: '#ecfdf5',
                    100: '#d1fae5',
                    400: '#34d399',
                    500: '#10b981',
                    600: '#059669',
                },
                danger: {
                    400: '#f87171',
                    500: '#ef4444',
                    600: '#dc2626',
                },
                warning: {
                    400: '#fbbf24',
                    500: '#f59e0b',
                },
                surface: {
                    light: '#ffffff',
                    dark: '#0f172a',
                },
            },
            animation: {
                'fade-in': 'fadeIn 0.4s ease-out',
                'slide-up': 'slideUp 0.4s ease-out',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
                shimmer: 'shimmer 2s linear infinite',
            },
            keyframes: {
                fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
                slideUp: { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
                shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
            },
            boxShadow: {
                glass: '0 8px 32px 0 rgba(31,38,135,0.18)',
                card: '0 4px 24px 0 rgba(99,102,241,0.10)',
            },
        },
    },
    plugins: [],
};
