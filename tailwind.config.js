/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'tavazi-navy': '#1971C2',
        'tavazi-dark': '#0B1929',
        'tavazi-charcoal': '#112640',
        'tavazi-slate': '#1A3555',
        'gold-accent': '#D4A853',
        cream: '#F5F0E6',
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
      fontFamily: {
        display: ['"DM Serif Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
