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
  error: '#E51111',
}

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
      fontWeight: 'normal',
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

      fontSize: 11,
      fontFamily: 'Muli',
      fontWeight: 'bold',
      letterSpacing: 1.1,

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
      letterSpacing: 1,

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
      letterSpacing: 1,

      titleHoverColor: colors.gray,
      backgroundHoverColor: colors.darkGreen,
      borderHoverColor: colors.darkGreen,
      iconHoverColor: colors.gray,
    },
    size150: {
      minWidth: 150,
      iconWidth: '14px',
      iconHeight: '14px',
      fontSize: '10px',
    },
    size100: {
      minWidth: 96,
      fontSize: '11px',
    },
    disabled: {
      borderDisabledColor: 'transparent',
    },
    small: {
      titlePadding: '5px 10px',
      fontSize: 9,
    },
    completeOnboarding: {
      fontWeight: 'normal',
      titleColor: colors.darkGray,
      borderColor: colors.darkGray,
      borderHoverColor: 'transparent',
      backgroundHoverColor: 'transparent',
      titleHoverColor: colors.paymentGreen,
      hoverShadow: true,
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
      fontSize: '13px',
      lineHeight: '21px',
      letterSpacing: 'inherit',
    },
    h2Poppins: {
      fontFamily: 'Poppins',
      fontWeight: 600,
      fontSize: '20px',
    },
    h3: {
      fontSize: 13,
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
    dateTime: {
      fontSize: 12,
      color: colors.mediumGray,
    },
    congrats: {
      fontSize: '13px',
    },
    error: {
      fontSize: '10px',
      color: colors.error,
    },
  },
  TextField: {
    filled: {
      backgroundColor: colors.gray,
      backgroundActiveColor: colors.white,
      textColor: colors.black,
      textActiveColor: colors.black,

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
}
