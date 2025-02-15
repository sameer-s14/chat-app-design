/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
          animation: {
            'fade-in': 'fadeIn 0.5s ease-out',
            'bounce-slow': 'bounce 2s infinite',
          },
          keyframes: {
            fadeIn: {
              '0%': { opacity: '0' },
              '100%': { opacity: '1' },
            },
          }
        },
      },
    plugins: [],
  };