const colors = {
  white: '#fff',
  gray: '#F9F9F9',
  paymentGreen: '#8EDA11',
  black: '#000',
};

export default {
  Button: {
    default: {
      borderColor: colors.paymentGreen,
      titleColor: colors.paymentGreen,
      iconColor: colors.paymentGreen,

      borderHoverColor: colors.paymentGreen,
      backgroundHoverColor: colors.paymentGreen,
      iconHoverColor: colors.black,
      titleHoverColor: colors.black,
    },
  },
  Text: {
    default: {
      color: colors.black,
      fontFamily: 'Muli',
    },
    h3: {
      fontSize: 16,
      color: colors.black,
      fontWeight: 700,
    },
  },

  // Special property used as styles where `styled-components` ThemeProvider would be used
  styled: {
    ...colors,
    spacing: '20px',
  },
};
