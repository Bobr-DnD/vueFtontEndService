export default {
  content: [
    './index.html',
    './src/**/*.{vue,js}',
  ],
  theme: {
    extend: {
      colors: {
        fallout: {
          dark: '#390c06',
          red: '#8f1b15',
          sand: '#f3a770',
          brown: '#4f2b1b',
          blackish: '#1a130d'
        }
      },
      fontFamily: {
        gothic: ['"Gothic 821 Condensed"', 'sans-serif'],
        univers: ['"Univers 59 Condensed"', 'sans-serif'],
        arialblack: ['"Arial Black"', 'sans-serif']
      }
    }
  },
  plugins: [],
}
