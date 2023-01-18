module.exports = {
  mode: 'jit',
  prefix: '',
  content: [
    './src/**/*.{html,ts}',
  ],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {},
    container: {
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['active', 'disabled'],
      textColor: ['disabled'],
    }
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
