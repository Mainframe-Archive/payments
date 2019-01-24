const colors = {
  white: '#fff',
  gray: '#F9F9F9',
  paymentGreen: '#8EDA11',
  darkGray: '#818181',
  borderGray: '#F1F0F0',
  textGray: '232323',
  black: '#000',
};

export default {
  Button: {
    default: {
      borderColor: colors.paymentGreen,
      titleColor: colors.paymentGreen,
      iconColor: colors.paymentGreen,
      backgroundColor: 'transparent',
      iconBackgroundColor: 'transparent',

      borderHoverColor: colors.paymentGreen,
      iconHoverBackgroundColor: 'transparent',
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
      iconHoverColor: colors.black,
      backgroundHoverColor: 'transparent',
    },
    borderless: {
      borderColor: 'transparent',

      borderHoverColor: 'transparent',
      titleHoverColor: colors.black,
      backgroundHoverColor: 'transparent',
      iconHoverColor: colors.black,
    },
    cancel: {
      borderColor: 'transparent',
      titleColor: colors.darkGray,

      borderHoverColor: 'transparent',
      titleHoverColor: colors.black,
      backgroundHoverColor: 'transparent',
      iconHoverColor: colors.black,
    },
    green: {
      titleColor: colors.white,
      iconColor: colors.white,
      backgroundColor: colors.paymentGreen,

      titleHoverColor: colors.white,
      iconHoverColor: colors.white,
      fontWeight: 'normal',
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
      fontSize: 11,
    },
    modalTitle: {
      fontSize: 18,
    },
  },
  TextField: {
    filled: {
      backgroundColor: colors.gray,
      backgroundActiveColor: colors.white,

      borderColor: colors.gray,
      borderActiveColor: colors.gray,

      activeShadow: true,
    },
    disabled: {
      backgroundDisabledColor: colors.gray,
    },
  },
  DropDown: {
    filled: {
      backgroundColor: colors.gray,
      borderColor: colors.gray,
      menuItemSelectedTextColor: colors.textGray,
      menuItemTextColor: colors.darkGray,
    },
  },

  // Special property used as styles where `styled-components` ThemeProvider would be used
  styled: {
    ...colors,
    spacing: '20px',
  },
};
