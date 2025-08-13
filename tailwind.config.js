export default {
  content: [
    './index.html',
    './src/**/*.{vue,js}',
  ],
  theme: {
    extend: {
      colors: {
        greenish: {
          dark: '#3E5F44',
          mid: '#5E936C',
          light: '#93DA97',
          pale: '#E8FFD7'
        },
        darkred: {
          dark: '#1D1616',
          red: '#8E1616',
          bright: '#D84040',
          light: '#EEEEEE'
        },
        orange: {
          gold: '#FABC3F',
          orange: '#E85C0D',
          red: '#C7253E',
          dark: '#821131'
        }
      },
      fontFamily: {
        gothic: ['"Rubik"', 'sans-serif'],
        univers: ['"TitilliumWeb"', 'sans-serif'],
        comic: ['"Comic Neue']
      }
    }
  },
  plugins: [],
}
