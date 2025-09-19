/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1rem', sm: '1.5rem', lg: '2rem' },
      screens: { sm:'640px', md:'768px', lg:'1024px', xl:'1280px' }
    },
    extend: {
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      colors: { brand:{50:'#eef2ff',100:'#e0e7ff',500:'#6366f1',600:'#4f46e5'} },
      boxShadow: { soft: '0 4px 20px rgba(0,0,0,.06)' }
    }
  },
  plugins: []
};
