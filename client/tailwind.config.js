/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#090B13',
        sidebar: '#111420',
        card: '#161B27',
        cardHover: '#1E2536',
        purple: {
          PRIMARY: '#8B5CF6',
          DEFAULT: '#8B5CF6',
          hover: '#A855F7',
          glow: 'rgba(139, 92, 246, 0.15)',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        text: {
          primary: '#F8FAFC',
          secondary: '#94A3B8',
          muted: '#64748B',
        },
        border: '#2B3245',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'card-glow': '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 0 15px 0 rgba(139, 92, 246, 0.05)',
        'purple-glow': '0 0 25px -5px rgba(139, 92, 246, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}