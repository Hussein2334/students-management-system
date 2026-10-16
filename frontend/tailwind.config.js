/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ===== Ink dark (Home, Navbar, Footer) =====
        ink: {
          950: '#07130e',
          900: '#0a1a12',
          800: '#0f2318',
          700: '#162e20',
          600: '#1e3a2a',
        },
        // ===== Brand green (Home, Navbar, Footer) =====
        brand: {
          50:  '#ecfdf5',
          100: '#d1fae5',
          300: '#6ee7b7',
          400: '#3ecf8e',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        // ===== Primary blue (Login, Register, Forgot, Reset) =====
        // 👇 HII ILIKOSEKANA — ndiyo sababu vitufe havikuwa na rangi
        primary: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // ===== Accent colors =====
        sun: '#e6b85c',
        sky: '#63b3ed',
        violet: '#9f8cf2',
        coral: '#ed7f9d',
        mint: '#51d3cb',
      },
      fontFamily: {
        sans: ['DM Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}