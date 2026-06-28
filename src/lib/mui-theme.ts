"use client";

import { createTheme } from "@mui/material/styles";

import {
  linearGradient,
  pxToRem,
  rgba,
  softColors,
  softGradients,
  softRadius,
  softShadow,
} from "./soft-ui";

export { softShadow } from "./soft-ui";

export const roveTheme = createTheme({
  palette: {
    primary: {
      main: softColors.info,
      dark: softColors.infoFocus,
      light: "#abe9f7",
      contrastText: softColors.white,
    },
    secondary: {
      main: softColors.secondary,
      light: "#a8b8d8",
      contrastText: softColors.white,
    },
    info: { main: softColors.info, dark: softColors.infoFocus },
    success: { main: softColors.success, dark: "#17ad37" },
    warning: { main: softColors.warning, dark: "#f53939" },
    error: { main: softColors.error, dark: "#c70505" },
    background: {
      default: softColors.background,
      paper: softColors.white,
    },
    text: {
      primary: softColors.dark,
      secondary: softColors.text,
    },
    divider: softColors.light,
    grey: softColors.grey,
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: { fontSize: pxToRem(48), fontWeight: 500, color: softColors.dark, lineHeight: 1.25 },
    h2: { fontSize: pxToRem(36), fontWeight: 500, color: softColors.dark, lineHeight: 1.3 },
    h3: { fontSize: pxToRem(30), fontWeight: 500, color: softColors.dark, lineHeight: 1.375 },
    h4: { fontSize: pxToRem(24), fontWeight: 500, color: softColors.dark, lineHeight: 1.375 },
    h5: { fontSize: pxToRem(20), fontWeight: 500, color: softColors.dark, lineHeight: 1.375 },
    h6: { fontSize: pxToRem(16), fontWeight: 500, color: softColors.dark, lineHeight: 1.625 },
    subtitle1: { fontSize: pxToRem(20), color: softColors.text, lineHeight: 1.625 },
    subtitle2: { fontSize: pxToRem(16), fontWeight: 500, color: softColors.text, lineHeight: 1.6 },
    body1: { fontSize: pxToRem(20), color: softColors.text, lineHeight: 1.625 },
    body2: { fontSize: pxToRem(16), color: softColors.text, lineHeight: 1.6 },
    button: {
      fontSize: pxToRem(12),
      fontWeight: 700,
      lineHeight: 1.5,
      textTransform: "uppercase",
    },
    caption: { fontSize: pxToRem(12), color: softColors.text, lineHeight: 1.25 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { scrollBehavior: "smooth" },
        body: {
          backgroundColor: softColors.background,
          color: softColors.text,
        },
        "a, a:link, a:visited": {
          textDecoration: "none",
          color: softColors.dark,
          transition: "color 150ms ease-in",
        },
        "a:hover, a:focus": {
          color: softColors.info,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          display: "flex",
          flexDirection: "column",
          backgroundColor: softColors.white,
          border: `${pxToRem(0)} solid ${rgba("#000000", 0.125)}`,
          borderRadius: softRadius.xl,
          boxShadow: softShadow.xxl,
        },
      },
    },
    MuiButton: {
      defaultProps: { disableRipple: true },
      styleOverrides: {
        root: {
          borderRadius: softRadius.md,
          padding: `${pxToRem(12)} ${pxToRem(24)}`,
          minHeight: pxToRem(40),
          lineHeight: 1.4,
          transition: "all 150ms ease-in",
          "&:hover": { transform: "scale(1.02)" },
          "&:disabled": { pointerEvents: "none", opacity: 0.65 },
        },
        sizeSmall: {
          minHeight: pxToRem(32),
          padding: `${pxToRem(8)} ${pxToRem(32)}`,
          fontSize: pxToRem(12),
        },
        sizeLarge: {
          minHeight: pxToRem(47),
          padding: `${pxToRem(14)} ${pxToRem(64)}`,
          fontSize: pxToRem(14),
        },
        contained: {
          backgroundColor: softColors.white,
          color: softColors.text,
          boxShadow: softShadow.button,
          "&:hover": {
            backgroundColor: softColors.white,
            boxShadow: softShadow.buttonHover,
          },
          "&.MuiButton-colorPrimary": {
            background: softColors.info,
            color: softColors.white,
            boxShadow: softShadow.button,
            "&:hover": {
              background: softColors.info,
              boxShadow: softShadow.buttonHover,
            },
            "&:focus:not(:hover)": {
              background: softColors.infoFocus,
              boxShadow: softShadow.buttonFocus,
            },
          },
          "&.MuiButton-colorSecondary": {
            background: softColors.secondary,
            color: softColors.white,
            "&:hover": { background: softColors.secondary },
          },
        },
        outlined: {
          minHeight: pxToRem(42),
          borderColor: softColors.light,
          color: softColors.text,
          "&:hover": {
            opacity: 0.75,
            backgroundColor: "transparent",
          },
          "&.MuiButton-colorPrimary": {
            borderColor: softColors.info,
            color: softColors.info,
            "&:focus:not(:hover)": { boxShadow: softShadow.buttonFocus },
          },
        },
        text: {
          color: softColors.text,
        },
      },
    },
    MuiTextField: {
      defaultProps: { size: "small", fullWidth: true },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: softRadius.md,
            backgroundColor: softColors.white,
            "& fieldset": { borderColor: softColors.inputBorder },
            "&:hover fieldset": { borderColor: softColors.text },
            "&.Mui-focused fieldset": {
              borderColor: softColors.inputFocus,
              boxShadow: softShadow.inputFocus,
            },
          },
          "& .MuiInputLabel-root": { color: softColors.text },
        },
      },
    },
    MuiSelect: {
      defaultProps: { size: "small", fullWidth: true },
    },
    MuiDrawer: {
      styleOverrides: {
        root: { width: pxToRem(250), whiteSpace: "nowrap", border: "none" },
        paper: {
          width: pxToRem(250),
          backgroundColor: rgba(softColors.white, 0.8),
          backdropFilter: `saturate(200%) blur(${pxToRem(30)})`,
          height: `calc(100vh - ${pxToRem(32)})`,
          margin: pxToRem(16),
          borderRadius: softRadius.xl,
          border: "none",
          boxShadow: softShadow.xxl,
          borderRight: "none",
        },
      },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0, color: "inherit" },
      styleOverrides: {
        root: {
          backgroundColor: rgba(softColors.background, 0.92),
          backdropFilter: "saturate(180%) blur(12px)",
          boxShadow: "none",
          color: softColors.dark,
          borderBottom: `1px solid ${softColors.light}`,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: `${pxToRem(12)} ${pxToRem(16)}`,
          borderBottom: `1px solid ${softColors.light}`,
          fontSize: pxToRem(14),
          color: softColors.text,
        },
        head: {
          fontSize: pxToRem(10.4),
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          color: softColors.text,
          borderBottom: `1px solid ${softColors.light}`,
          backgroundColor: softColors.white,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:last-child td": { borderBottom: 0 },
          "&:hover": { backgroundColor: rgba(softColors.info, 0.04) },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          fontSize: pxToRem(10.4),
          height: pxToRem(24),
          borderRadius: pxToRem(4),
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: softRadius.lg },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: softColors.dark,
          textDecoration: "none",
          transition: "color 150ms ease-in",
          "&:hover": { color: softColors.info },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: softColors.text,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: softColors.light },
      },
    },
  },
});

/** Gradient backgrounds for icon boxes, avatars, etc. */
export const softUiGradients = {
  info: linearGradient(softGradients.info.main, softGradients.info.state, 195),
  success: linearGradient(softGradients.success.main, softGradients.success.state, 195),
  warning: linearGradient(softGradients.warning.main, softGradients.warning.state, 195),
  error: linearGradient(softGradients.error.main, softGradients.error.state, 195),
  primary: linearGradient(softGradients.primary.main, softGradients.primary.state, 195),
  secondary: linearGradient(softGradients.secondary.main, softGradients.secondary.state, 195),
  dark: linearGradient(softGradients.dark.main, softGradients.dark.state, 195),
};
