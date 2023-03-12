import { Components, createTheme, Theme } from "@mui/material/styles";

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    nav: true;
    landing: true;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    landing: true;
  }
}

export const palette = {
  primary: {
    main: "#0a3045",
    light: "rgb(51, 101, 128)",
    dark: "rgb(0, 44, 67)",
    contrast: "#fff",
  },
  secondary: {
    main: "hsl(49, 39%, 52%)",
    //light: 'hsl(49, 39%, 61.6%)',
    //light2: 'rgb(255, 232, 181)',
    //light3: 'hsl(52, 72%, 87%)',
    //light4: '#fff8c9',
    light: "#FFF9D3",
    dark: "hsl(49, 39%, 36.4%)",
    contrast: "rgba(0, 0, 0, 0.87)",
  },
  text: {
    primary: "rgba(0, 0, 0, 0.87)",
    secondary: "rgba(0, 0, 0, 0.54)",
    disabled: "rgba(0, 0, 0, 0.38)",
    hint: "rgba(0, 0, 0, 0.38)",
  },
  error: {
    main: "#f44336",
    light: "#e57373",
    dark: "#d32f2f",
    contrast: "#fff",
  },
  warning: {
    main: "#ff9800",
    light: "#ffb74d",
    dark: "#f57c00",
    contrast: "rgba(0, 0, 0, 0.87)",
  },
  info: {
    main: "#2196f3",
    light: "#64b5f6",
    dark: "#1976d2",
    contrast: "#fff",
  },
  success: {
    main: "#4caf50",
    light: "#81c784",
    dark: "#388e3c",
    contrast: "rgba(0, 0, 0, 0.87)",
  },
};

export const typography = {
  fontFamily: "Josefin Slab",
  h1: {
    fontWeight: 500,
    fontSize: 48,
  },
  h2: {
    fontWeight: 500,
    fontSize: 40,
  },
  h3: {
    fontWeight: 500,
    fontSize: 32,
  },
  h4: {
    fontWeight: 500,
    fontSize: 24,
  },
  fontSize: 18,
  fontWeightLight: 400,
  fontWeightRegular: 500,
  fontWeightMedium: 600,
  fontWeightBold: 800,
  button: {
    fontWeight: 600,
  },
};

const components: Components<Omit<Theme, "components">> = {
  MuiAppBar: {
    defaultProps: {},
    styleOverrides: {
      root: {
        boxShadow: "none",
      },
    },
  },
  MuiAvatar: {
    defaultProps: {},
    styleOverrides: {
      root: {
        backgroundColor: palette.secondary.main,
        color: palette.primary.main,
      },
    },
  },
  MuiButton: {
    defaultProps: {
      size: "small",
    },
    variants: [
      {
        props: { variant: "nav" },
        style: {
          "&:hover": {
            color: palette.secondary.main,
            backgroundColor: "transparent",
          },
        },
      },
      {
        props: { variant: "landing" },
        style: {
          backgroundColor: palette.primary.light,
          color: "white",
          borderRadius: "10px",
          "&:hover": {
            backgroundColor: palette.primary.light,
            color: "white",
          },
        },
      },
    ],
    styleOverrides: {
      root: {
        backgroundColor: palette.primary.main,
        color: palette.secondary.main,
        "&:hover": {
          backgroundColor: palette.secondary.main,
          color: palette.primary.main,
        },
      },
    },
  },
  MuiButtonBase: {
    styleOverrides: {
      root: {
        ".MuiButton": {
          root: {},
        },
      },
    },
  },
  MuiButtonGroup: {
    defaultProps: {
      size: "small",
    },
  },
  MuiCheckbox: {
    defaultProps: {
      size: "small",
    },
  },
  MuiFormControl: {
    defaultProps: {
      size: "small",
      margin: "dense",
    },
  },
  MuiFormHelperText: {
    defaultProps: {
      margin: "dense",
    },
  },
  MuiFab: {
    defaultProps: {
      size: "small",
    },
  },
  MuiIconButton: {
    defaultProps: {
      size: "small",
    },
  },
  MuiInputBase: {
    defaultProps: {
      margin: "dense",
    },
  },
  MuiInputLabel: {
    defaultProps: {
      margin: "dense",
    },
  },
  MuiLink: {
    defaultProps: {
      underline: "none",
    },
    styleOverrides: {
      root: {
        color: palette.secondary.main,
      },
    },
  },
  MuiList: {
    styleOverrides: {
      root: {},
    },
  },
  MuiMenu: {
    styleOverrides: {
      root: {},
    },
  },
  MuiMenuItem: {
    styleOverrides: {
      root: {},
    },
  },
  MuiRadio: {
    defaultProps: {
      size: "small",
    },
  },
  MuiSwitch: {
    defaultProps: {
      size: "small",
    },
  },
  MuiTextField: {
    defaultProps: {
      margin: "dense",
      size: "small",
    },
  },
  MuiTypography: {
    styleOverrides: {
      root: {},
    },
    variants: [
      {
        props: { variant: "landing" },
        style: {
          ...typography.h1,
          fontFamily: "Josefin Slab",
          fontSize: 64,
          display: "flex",
          alignItems: "center",
        },
      },
    ],
  },
};

const theme = createTheme({ typography, palette, components });
export default theme;
