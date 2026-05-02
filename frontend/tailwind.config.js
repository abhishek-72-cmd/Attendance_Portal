/** @type {import('tailwindcss').Config} */
export default {
  content: [
   "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",   // 👈 ADD THIS
    "./Dashbord/**/*.{js,jsx,ts,tsx}",
    "./Leave/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};