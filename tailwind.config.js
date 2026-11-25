export default {
  content: [
    './index.html',
    './src/**/*.{vue,js}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          page: 'rgb(var(--brand-page) / <alpha-value>)',
          base: 'rgb(var(--brand-base) / <alpha-value>)',
          ink: 'rgb(var(--brand-ink) / <alpha-value>)',
          surface: 'rgb(var(--brand-surface) / <alpha-value>)',
          muted: 'rgb(var(--brand-muted) / <alpha-value>)',
          subtle: 'rgb(var(--brand-subtle) / <alpha-value>)',
          faint: 'rgb(var(--brand-faint) / <alpha-value>)',
          accent: 'rgb(var(--brand-accent) / <alpha-value>)',
          'accent-hover': 'rgb(var(--brand-accent-hover) / <alpha-value>)',
          'accent-secondary': 'rgb(var(--brand-accent-secondary) / <alpha-value>)',
          text: 'rgb(var(--brand-text) / <alpha-value>)',
          'surface-inverted': 'rgb(var(--brand-surface-inverted) / <alpha-value>)'
        },
        state: {
          success: '#3E5F44',
          'success-accent': '#5E936C',
          'success-hover': '#00B305',
          'success-surface': '#E8FFD7',
          new: '#FABC3F',
          warning: '#E85C0D',
          error: '#8E1616',
          'text-white': '#ffffff'
        },
        system: {
          
        }
      },
      keyframes: {
        'gradient-pulse': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        'gradient-pulse': 'gradient-pulse 3s ease-in-out infinite',
      },
      fontFamily: {
        gothic: ['var(--brand-font-heading)', '"Rubik"', 'sans-serif'],
        univers: ['"TitilliumWeb"', 'sans-serif'],
        comic: ['"Comic Neue"', 'sans-serif']
      }
    }
  },
  plugins: [],
}
