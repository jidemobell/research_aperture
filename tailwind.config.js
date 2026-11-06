/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0b0f14',
          900: '#11161d',
          800: '#1b232d',
          700: '#2a3441',
        },
        accent: '#7dd3fc',
        warm: '#fbbf24',
      },
    },
  },
  plugins: [],
};
