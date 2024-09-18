/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        'xsm': '460px',
        'sm': '640px',
        'md': '768px',
        'md-lg': '875px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      colors: {
        fern: "#527442",
        offwhite: "#F4F5F4",
        ocre: "#DA7829",
        blue: "#465FC0",
        eerie: "#212322",
        mindaro: "#CAE47C",
        guiaOrange: "#FF7434",
        guiaCyan: "#72DFFC",
        guiaMustard: "#F3BB44",
        guiaPurple: "#755EFA",
        guiaSunset: "#FF5542",
        guiaPink:"#FF60B8"
      },
    },
    fontWeight: {
      normal: '358',
      medium: '448',
    },
  },
  plugins: [],
};
