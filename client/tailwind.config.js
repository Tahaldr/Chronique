import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import aspect from "@tailwindcss/aspect-ratio";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        // paper: "url('/OtherImg/NewsPaper_texture.png')",
      },

      colors: {
        theBase: "#dbdbdb",
        darkest: "#111111",
        darker: "#222222",
        dark: "#333333",
        // darkish: "#444444",
        // lightish: "#c1c1c1",
        light: "#888888",
        lighter: "#cccccc",
        lightest: "#fafafa",
      },

      fontFamily: {
        // Big fonts variants
        biggest: ["canterbury", "sans-serif"],
        bigPrimary: ["canopee", "sans-serif"],
        bigSecondary: ["DomaineDisplay", "canopee", "serif"],
        bigSecondaryItalic: ["DomaineDisplayItalic", "sans-serif"],
        bigThird: ["Cheltenham", "sans-serif"],

        // Medium fonts variants
        mediumPrimary: ["cormorantBold", "serif"],
        mediumSecondary: ["cormorantMedium", "serif"],

        // Small fonts variants
        small: ["EBGaramond-Regular", "serif"],
        smallItalic: ["EBGaramond-Italic", "serif"],
        smallMedium: ["EBGaramond-Medium", "serif"],
        smallMediumItalic: ["EBGaramond-MediumItalic", "serif"],
        smallSemiBold: ["EBGaramond-SemiBold", "serif"],
        smallSemiBoldItalic: ["EBGaramond-SemiBoldItalic", "serif"],
        smallBold: ["EBGaramond-Bold", "serif"],
        smallBoldItalic: ["EBGaramond-BoldItalic", "serif"],
        smallExtraBold: ["EBGaramond-ExtraBold", "serif"],
        smallExtraBoldItalic: ["EBGaramond-ExtraBoldItalic", "serif"],

        smallSecondary: ["aldhabi", "serif"],
      },
    },
  },
  plugins: [tailwindcss, autoprefixer, aspect],
  // safelist: [
  //   {
  //     pattern: /(bg|text|border|fill|stroke)-semidark/,
  //   },
  // ],
};
