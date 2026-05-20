/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        body: ['"Outfit"', 'sans-serif'],
      },
      colors: {
        stone: {
          950: '#0c0a09',
        },
        brand: {
          DEFAULT: '#c8a96e',
          light: '#e8d5a8',
          dark: '#9a7a42',
        },
      },
      animation: {
        'slide-in-right': 'slideInRight 0.35s cubic-bezier(0.32, 0.72, 0, 1)',
        'fade-in': 'fadeIn 0.4s ease',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        slideInRight: {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
