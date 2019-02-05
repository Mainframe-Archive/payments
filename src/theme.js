const colors = {
  white: '#fff',
  gray: '#F9F9F9',
  paymentGreen: '#8EDA11',
  darkGreen: '#74A720',
  darkGray: '#818181',
  borderGray: '#F1F0F0',
  textGray: '232323',
  mediumGray: '#B5B5B5',
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
      titlePadding: 0,
      borderHoverColor: colors.paymentGreen,
      titleHoverColor: colors.paymentGreen,
      backgroundHoverColor: 'transparent',
    },
    close: {
      iconColor: colors.darkGray,
      iconHoverColor: colors.black,
      iconHeight: '12px',
      iconWidth: '12px',
      backgroundHoverColor: 'transparent',
    },
    borderless: {
      borderColor: 'transparent',
      iconHeight: '24px',
      iconWidth: '24px',

      fontSize: 12,
      fontFamily: 'Muli',
      fontWeight: 'bold',

      borderHoverColor: 'transparent',
      backgroundHoverColor: 'transparent',
      iconHoverColor: colors.darkGreen,
      titleHoverColor: colors.darkGreen,
    },
    borderlessMobile: {
      iconHoverColor: colors.paymentGreen,
      titlePadding: 0,
    },
    cancel: {
      borderColor: 'transparent',
      titleColor: colors.mediumGray,

      borderHoverColor: 'transparent',
      titleHoverColor: colors.black,
      backgroundHoverColor: 'transparent',
      iconHoverColor: colors.black,
    },
    green: {
      titleColor: colors.gray,
      iconColor: colors.gray,
      backgroundColor: colors.paymentGreen,

      fontFamily: 'Muli',
      fontWeight: 'normal',

      titleHoverColor: colors.gray,
      backgroundHoverColor: colors.darkGreen,
      borderHoverColor: colors.darkGreen,
      iconHoverColor: colors.gray,
    },
    size150: {
      minWidth: 150,
      iconWidth: '14px',
      iconHeight: '14px',
      fontSize: '12px',
    },
    size100: {
      minWidth: 96,
      fontSize: '11px',
    },
    disabled: {
      borderDisabledColor: 'transparent',
    },
  },
  Text: {
    default: {
      color: colors.black,
      fontFamily: 'Muli',
    },
    welcome: {
      fontFamily: 'Muli',
      fontWeight: 'regular',
      fontSize: '16px',
      lineHeight: '25px',
      letterSpacing: 'inherit',
    },
    h2Poppins: {
      fontFamily: 'Poppins',
      fontWeight: 600,
      fontSize: '25px',
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
      fontSize: 13,
      letterSpacing: 2,
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
    disabledLabel: {
      textDisabledColor: colors.darkGray,
      labelActiveColor: colors.darkGray,
      labelWithContentColor: colors.darkGray,
      labelDisabledWithContentColor: colors.darkGray,
    },
  },
  DropDown: {
    filled: {
      backgroundColor: colors.gray,
      borderColor: colors.gray,
      menuItemSelectedTextColor: colors.textGray,
      menuItemTextColor: colors.darkGray,
    },
    disabled: {
      backgroundDisabledColor: colors.gray,
      borderDisabledColor: colors.gray,
    },
  },

  // Special property used as styles where `styled-components` ThemeProvider would be used
  styled: {
    ...colors,
    spacing: '20px',
  },
};
