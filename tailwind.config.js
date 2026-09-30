/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          900: '#0B0D17',
          800: '#15192D',
          700: '#1F2644',
          accent: '#38BDF8',
          orange: '#FF6B35',
          gold: '#F59E0B'
        }
      }
    },
  },
  plugins: [],
}
