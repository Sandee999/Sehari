/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        // Poppins Fonts
        poppinsBlack: ["Poppins-Black", "sans-serif"],
        poppinsBlackItalic: ["Poppins-BlackItalic", "sans-serif"],
        poppinsBold: ["Poppins-Bold", "sans-serif"],
        poppinsBoldItalic: ["Poppins-BoldItalic", "sans-serif"],
        poppinsExtraBold: ["Poppins-ExtraBold", "sans-serif"],
        poppinsExtraBoldItalic: ["Poppins-ExtraBoldItalic", "sans-serif"],
        poppinsExtraLight: ["Poppins-ExtraLight", "sans-serif"],
        poppinsExtraLightItalic: ["Poppins-ExtraLightItalic", "sans-serif"],
        poppinsItalic: ["Poppins-Italic", "sans-serif"],
        poppinsLight: ["Poppins-Light", "sans-serif"],
        poppinsLightItalic: ["Poppins-LightItalic", "sans-serif"],
        poppinsMedium: ["Poppins-Medium", "sans-serif"],
        poppinsMediumItalic: ["Poppins-MediumItalic", "sans-serif"],
        poppinsRegular: ["Poppins-Regular", "sans-serif"],
        poppinsSemiBold: ["Poppins-SemiBold", "sans-serif"],
        poppinsSemiBoldItalic: ["Poppins-SemiBoldItalic", "sans-serif"],
        poppinsThin: ["Poppins-Thin", "sans-serif"],
        poppinsThinItalic: ["Poppins-ThinItalic", "sans-serif"],

        // Josefin Sans Fonts
        josefinBold: ["JosefinSans-Bold", "sans-serif"],
        josefinBoldItalic: ["JosefinSans-BoldItalic", "sans-serif"],
        josefinExtraLight: ["JosefinSans-ExtraLight", "sans-serif"],
        josefinExtraLightItalic: ["JosefinSans-ExtraLightItalic", "sans-serif"],
        josefinItalic: ["JosefinSans-Italic", "sans-serif"],
        josefinLight: ["JosefinSans-Light", "sans-serif"],
        josefinLightItalic: ["JosefinSans-LightItalic", "sans-serif"],
        josefinMedium: ["JosefinSans-Medium", "sans-serif"],
        josefinMediumItalic: ["JosefinSans-MediumItalic", "sans-serif"],
        josefinRegular: ["JosefinSans-Regular", "sans-serif"],
        josefinSemiBold: ["JosefinSans-SemiBold", "sans-serif"],
        josefinSemiBoldItalic: ["JosefinSans-SemiBoldItalic", "sans-serif"],
        josefinThin: ["JosefinSans-Thin", "sans-serif"],
        josefinThinItalic: ["JosefinSans-ThinItalic", "sans-serif"],

        // Lilita One Fonts
        lilitaOne: ["LilitaOne-Regular", "sans-serif"],
      },
    },
  },
  plugins: [],
}