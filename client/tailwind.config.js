/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        theBase: "#dbdbdb",
        darkest: "#111111",
        darker: "#222222",
        dark: "#333333",
        medium: "#888888",
        light: "#888888",
        lighter: "#cccccc",
        lightest: "#fafafa",
      },

      fontFamily: {
        // Big fonts variants
        biggest: ["canterbury", "sans-serif"],
        bigPrimary: ["canopee", "sans-serif"],
        bigSecondary: ["DomaineDisplay", "sans-serif"],
        bigSecondaryItalic: ["DomaineDisplayItalic", "sans-serif"],
        bigThird: ["Satisfactory", "sans-serif"],

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
  plugins: [],
};
