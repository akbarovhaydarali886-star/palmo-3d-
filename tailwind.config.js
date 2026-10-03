/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#f8f8f0',
        foreground: '#463721',
        beige: '#ffe386',
        'light-beige': '#ece2b1',
        'light-brown': '#684900',
        gold: '#b9902e',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        khand: ['Khand', 'sans-serif'],
        'patrick-hand': ['Patrick Hand', 'cursive'],
      },
      zIndex: {
        '800': '800',
        '900': '900',
        '980': '980',
        '998': '998',
        '999': '999',
      }
    },
  },
  plugins: [],
}
