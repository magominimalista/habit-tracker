/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html",
  ],
  theme: {
    extend: {
      zIndex: {
        'modal': '50',
        'overlay': '40'
      }
    },
  },
  plugins: [],
}

