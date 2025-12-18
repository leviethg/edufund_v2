/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0f62fe',
          50: '#eef4ff',
          600: '#0b5be6',
        },
        accent: {
          DEFAULT: '#00b37e',
          light: '#e6f8f1',
          warm: '#ff8a65'
        },
        surface: '#ffffff',
        background: '#f6f9fc',
        text: {
          main: '#161616',
          secondary: '#525252',
          muted: '#878787'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'card': '0 2px 8px rgba(0, 0, 0, 0.04), 0 0 1px rgba(0,0,0,0.1)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // Ensure this is installed or remove if not needed
  ],
}