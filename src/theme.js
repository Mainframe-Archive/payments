const colors = {
  white: '#fff',
  gray: '#F9F9F9',
  paymentGreen: '#8EDA11',
  darkGray: '#818181',
  borderGray: '#F1F0F0',
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
    textLike: {
      borderColor: colors.paymentGreen,
      titleColor: colors.black,

      borderHoverColor: colors.paymentGreen,
      titleHoverColor: colors.paymentGreen,
      backgroundHoverColor: 'transparent',
    },
    close: {
      iconColor: colors.darkGray,
      iconHoverColor: colors.paymentGreen,
      backgroundHoverColor: 'transparent',
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
    faded: { color: colors.darkGray, fontWeight: 500 },
    green: {
      color: colors.paymentGreen,
    },
    small: {
      fontSize: 12,
    },
    modalTitle: {
      fontSize: 18,
    },
  },

  // Special property used as styles where `styled-components` ThemeProvider would be used
  styled: {
    ...colors,
    spacing: '20px',
  },
};
