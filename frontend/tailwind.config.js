/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cosmic: {
          950: '#050811',
          900: '#080d1a',
          850: '#0c1222',
          800: '#11192e',
          700: '#1a2644',
          600: '#263760',
        },
        brand: {
          50: '#fff1f4',
          100: '#ffe4e9',
          200: '#fecdd7',
          300: '#fda4b7',
          400: '#fb7190',
          500: '#f43f68',
          600: '#e11d48', // Vibrant crimson
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        },
        neon: {
          rose: '#ff2a5f',
          amber: '#ffb800',
          emerald: '#00f59b',
          cyan: '#00f0ff',
          indigo: '#6366f1',
          purple: '#a855f7',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
        'glass-sm': '0 4px 16px 0 rgba(0, 0, 0, 0.35)',
        'glass-lg': '0 16px 48px 0 rgba(0, 0, 0, 0.65)',
        'neon-rose': '0 0 25px -5px rgba(255, 42, 95, 0.5)',
        'neon-amber': '0 0 25px -5px rgba(255, 184, 0, 0.5)',
        'neon-emerald': '0 0 25px -5px rgba(0, 245, 155, 0.5)',
        'neon-cyan': '0 0 25px -5px rgba(0, 240, 255, 0.5)',
        'neon-indigo': '0 0 25px -5px rgba(99, 102, 241, 0.5)',
      },
      animation: {
        'like-bounce': 'likeBounce 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'pulse-subtle': 'pulseSubtle 2.5s infinite ease-in-out',
        'glow-pulse': 'glowPulse 3s infinite alternate',
        'sound-bar-1': 'soundWave 1s ease-in-out infinite alternate',
        'sound-bar-2': 'soundWave 0.7s ease-in-out infinite 0.2s alternate',
        'sound-bar-3': 'soundWave 1.2s ease-in-out infinite 0.4s alternate',
        'sound-bar-4': 'soundWave 0.9s ease-in-out infinite 0.1s alternate',
        'float-slow': 'floatSlow 6s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2.5s infinite linear',
      },
      keyframes: {
        likeBounce: {
          '0%': { transform: 'scale(0) rotate(-15deg)', opacity: '0' },
          '45%': { transform: 'scale(1.35) rotate(5deg)', opacity: '1' },
          '70%': { transform: 'scale(0.95) rotate(-2deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.65', transform: 'scale(0.98)' },
        },
        glowPulse: {
          '0%': { opacity: '0.4', filter: 'blur(20px)' },
          '100%': { opacity: '0.85', filter: 'blur(35px)' },
        },
        soundWave: {
          '0%': { height: '4px' },
          '100%': { height: '18px' },
        },
        floatSlow: {
          '0%': { transform: 'translateY(0px)' },
          '100%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
