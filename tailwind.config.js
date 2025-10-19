/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/client/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        wood: '#8b4513',
        metal: '#708090',
        plastic: '#4a90e2',
      },
      animation: {
        'stone-drop': 'bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'sparkle': 'sparkle 1s infinite',
      }
    },
  },
  plugins: [],
}
