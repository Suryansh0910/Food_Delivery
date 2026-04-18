/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
        display: ['Barlow Condensed', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        navy: {
          900: '#0B132B',
          800: '#1C2541',
          700: '#3A506B',
          600: '#4A6583'
        },
        accent: {
          yellow: '#FFD700',
          green: '#00E59B',
          bg: '#f4f0ea',
        }
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      },
      animation: {
        marquee: 'marquee 25s linear infinite',
        float: 'float 3s ease-in-out infinite',
        slideUp: 'slideUp 0.4s ease-out forwards',
      },
      boxShadow: {
        brutal: '6px 6px 0px #000',
        'brutal-sm': '3px 3px 0px #000',
        'brutal-lg': '12px 12px 0px #000',
        'brutal-green': '6px 6px 0px #00E59B',
        'brutal-yellow': '6px 6px 0px #FFD700',
        'brutal-red': '6px 6px 0px #dc2626',
      }
    },
  },
  plugins: [],
}
