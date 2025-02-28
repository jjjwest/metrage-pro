export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#f59e0b",
        'primary-hover': "#ea580c",
        'bg-dark': "rgba(15, 23, 42, 0.9)",
        'bg-input': "rgba(15, 23, 42, 0.8)",
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}