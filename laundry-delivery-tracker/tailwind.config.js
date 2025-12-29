/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx}", 
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",  "./src/app/**/*.{js,ts,jsx,tsx}",
    
  ],


  theme: {
    extend: {
      colors: {
        sky: {
          50: "#f0faff",
          100: "#e0f2fe",
          600: "#0284c7",
          700: "#0369a1",
        },
      },
    },
  },



 plugins: [
  require('@tailwindcss/forms'),
  require('@tailwindcss/typography'),
  require('@tailwindcss/aspect-ratio'),
],

};
