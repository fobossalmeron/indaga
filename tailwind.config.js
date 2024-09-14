/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontWeight: {
      normal: '358',
      medium: '448',
    },
    extend: {
      colors: {
        fern: "#527442",
        offwhite: "#F4F5F4",
        ocre: "#DA7829",
        blue: "#465FC0",
        eerie: "#212322",
        mindaro: "#CAE47C",
        guiaOrange: "#FF7434",
        guiaBlue: "#72DFFC",
        guiaPurple: "#755EFA",
      },
    },
  },
  plugins: [],
};
