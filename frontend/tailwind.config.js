// // frontend/tailwind.config.js
// /** @type {import('tailwindcss').Config} */

// export default {
//   content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
//   theme: {
//     extend: {
//       colors: {
//         brand: {
//           50:  '#eef2ff',
//           100: '#e0e7ff',
//           200: '#c7d2fe',
//           300: '#a5b4fc',
//           400: '#818cf8',
//           500: '#6366f1', // Indigo-500
//           600: '#4f46e5', // Indigo-600
//           700: '#4338ca',
//           800: '#3730a3',
//           900: '#312e81',
//         },
//       },
//       boxShadow: {
//         soft: '0 4px 24px rgba(0,0,0,.06)',
//       },
//       borderRadius: {
//         '2xl': '1rem',
//       },
//     },
//   },
//   plugins: [],
// };

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    // "./node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}", // nếu dùng Flowbite
  ],
  theme: {
    container: { center: true, padding: "1rem" },
    extend: {
      colors: {
        brand: {
          50:"#eef6ff",100:"#d9ecff",200:"#baddff",300:"#8cc5ff",
          400:"#56a6ff",500:"#2b8aff",600:"#186fe6",
          700:"#1459b4",800:"#134c95",900:"#123f7a"
        }
      },
      boxShadow: {
        soft: "0 8px 24px rgba(0,0,0,.06)"
      }
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/line-clamp"),
    require("@tailwindcss/aspect-ratio"),
    require("daisyui") // nếu dùng
  ],
  // daisyUI (tuỳ chọn)
  daisyui: {
    themes: [
      {
        ecommerce: {
          "primary": "#2b8aff",
          "secondary": "#0ea5e9",
          "accent": "#16a34a",
          "neutral": "#111827",
          "base-100": "#ffffff",
          "info": "#38bdf8",
          "success": "#22c55e",
          "warning": "#fbbf24",
          "error": "#ef4444",
        },
      },
      "light"
    ],
  },
};