/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#070A12',
          900: '#0B0F19',
          850: '#111726',
          800: '#161E30',
          700: '#1E2740',
          600: '#27324F',
          500: '#33405F',
        },
        neon: {
          50: '#E6FCFF',
          100: '#B3F6FF',
          200: '#80EFFF',
          300: '#4DE8FF',
          400: '#1AE1FF',
          500: '#00E5FF',
          600: '#00B8CC',
          700: '#008A99',
          800: '#005C66',
          900: '#002E33',
        },
        amber: {
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
        },
        alarm: {
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
        },
        ok: {
          400: '#34D399',
          500: '#10B981',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        neon: '0 0 20px rgba(0, 229, 255, 0.35), 0 0 40px rgba(0, 229, 255, 0.15)',
        neonSoft: '0 0 12px rgba(0, 229, 255, 0.25)',
        alarm: '0 0 24px rgba(239, 68, 68, 0.45), 0 0 48px rgba(239, 68, 68, 0.2)',
        amber: '0 0 18px rgba(245, 158, 11, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'radar-sweep 3.5s linear infinite',
        'ping-ring': 'ping-ring 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
        'shake': 'shake 0.5s ease-in-out both',
        'slide-up': 'slide-up 0.35s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fade-in 0.3s ease-out both',
        'border-pulse-alarm': 'border-pulse-alarm 1s ease-in-out infinite',
        'border-pulse-amber': 'border-pulse-amber 1.4s ease-in-out infinite',
      },
      keyframes: {
        'radar-sweep': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'ping-ring': {
          '0%': { transform: 'scale(0.7)', opacity: '0.8' },
          '80%, 100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-6px)' },
          '40%': { transform: 'translateX(6px)' },
          '60%': { transform: 'translateX(-4px)' },
          '80%': { transform: 'translateX(4px)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'border-pulse-alarm': {
          '0%, 100%': { boxShadow: 'inset 0 0 0 3px rgba(239, 68, 68, 0.9), inset 0 0 60px rgba(239, 68, 68, 0.3)' },
          '50%': { boxShadow: 'inset 0 0 0 6px rgba(239, 68, 68, 0.6), inset 0 0 90px rgba(239, 68, 68, 0.5)' },
        },
        'border-pulse-amber': {
          '0%, 100%': { boxShadow: 'inset 0 0 0 3px rgba(245, 158, 11, 0.8), inset 0 0 50px rgba(245, 158, 11, 0.2)' },
          '50%': { boxShadow: 'inset 0 0 0 5px rgba(245, 158, 11, 0.5), inset 0 0 80px rgba(245, 158, 11, 0.4)' },
        },
      },
    },
  },
  plugins: [],
};
