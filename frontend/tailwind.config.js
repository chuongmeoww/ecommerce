export default {
  content: ["./index.html","./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {500:"#4F46E5",600:"#4338CA"},
        secondary:{500:"#10B981",600:"#059669"}
      },
      boxShadow:{ soft:"0 20px 25px -5px rgba(0,0,0,.1), 0 10px 10px -5px rgba(0,0,0,.04)"}
    }
  },
  plugins:[require('@tailwindcss/forms'),require('@tailwindcss/line-clamp'),require('@tailwindcss/aspect-ratio')]
}
