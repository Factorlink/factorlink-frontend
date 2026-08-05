import { createTheme } from "@mui/material/styles";

const radiusM = "var(--radius-m)";
const radiusL = "var(--radius-l)";

export const theme = createTheme({
  cssVariables: {
    nativeColor: true,
  },
  palette: {
    primary: {
      main: "var(--color-bg-accent-primary)",
      dark: "var(--color-bg-accent-primary-hover)",
      light: "var(--color-bg-accent-secondary)",
      contrastText: "var(--color-fg-on-accent-primary)",
    },
    secondary: {
      main: "var(--brand-secondary)",
      dark: "var(--brand-primary-hover)",
      light: "var(--color-bg-accent-tertiary)",
      contrastText: "var(--brand-primary)",
    },
    success: {
      main: "var(--color-bg-success-primary)",
      dark: "var(--color-bg-success-primary-hover)",
      light: "var(--color-bg-success-secondary)",
      contrastText: "var(--color-fg-on-success-primary)",
    },
    error: {
      main: "var(--color-bg-danger-primary)",
      dark: "var(--color-bg-danger-primary-hover)",
      light: "var(--color-bg-danger-secondary)",
      contrastText: "var(--color-fg-on-danger-primary)",
    },
    warning: {
      main: "var(--color-bg-warning-primary)",
      dark: "var(--color-bg-warning-primary-hover)",
      light: "var(--color-bg-warning-secondary)",
      contrastText: "var(--color-fg-on-warning-primary)",
    },
    background: {
      default: "var(--color-bg-default-secondary)",
      paper: "var(--color-bg-default-primary)",
    },
    text: {
      primary: "var(--color-fg-default-primary)",
      secondary: "var(--color-fg-default-secondary)",
      disabled: "var(--color-fg-disabled-primary)",
    },
    divider: "var(--color-border-default-primary)",
    action: {
      disabled: "var(--color-fg-disabled-primary)",
      disabledBackground: "var(--color-bg-disabled-primary)",
    },
  },
  typography: {
    fontFamily: "var(--font-body)",
    h1: {
      fontFamily: "var(--font-heading)",
      fontWeight: 400,
      fontSize: "var(--font-size-display-h1)",
      lineHeight: 1.33,
    },
    h2: {
      fontFamily: "var(--font-heading)",
      fontWeight: 400,
      fontSize: "var(--font-size-display-h2)",
      lineHeight: 1.4,
    },
    h3: {
      fontFamily: "var(--font-heading)",
      fontWeight: 400,
      fontSize: "var(--font-size-display-h3)",
      lineHeight: 1.33,
    },
    h4: {
      fontFamily: "var(--font-heading)",
      fontWeight: 400,
      fontSize: "var(--font-size-display-h4)",
      lineHeight: 1.4,
    },
    h5: {
      fontFamily: "var(--font-heading)",
      fontWeight: 500,
    },
    h6: {
      fontFamily: "var(--font-heading)",
      fontWeight: 500,
      fontSize: "var(--font-size-l)",
    },
    button: {
      fontFamily: "var(--font-heading)",
      fontWeight: 500,
      fontSize: "var(--font-size-s)",
      textTransform: "none",
    },
    body1: {
      fontSize: "var(--font-size-m)",
      lineHeight: "var(--line-height-m)",
    },
    body2: {
      fontSize: "var(--font-size-s)",
      lineHeight: "var(--line-height-s)",
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "var(--color-bg-default-primary)",
          color: "var(--color-fg-default-primary)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: radiusM,
          textTransform: "none",
          fontWeight: 500,
          padding: "10px 24px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
          "&:focus-visible": {
            outline: "2px solid var(--color-border-accent-primary)",
            outlineOffset: "2px",
          },
        },
        containedPrimary: {
          backgroundColor: "var(--color-bg-accent-primary)",
          color: "var(--color-fg-on-accent-primary)",
          "&:hover": {
            backgroundColor: "var(--color-bg-accent-primary-hover)",
          },
        },
        containedSecondary: {
          backgroundColor: "var(--brand-secondary)",
          color: "var(--brand-primary)",
          "&:hover": {
            backgroundColor: "var(--color-bg-accent-secondary-hover)",
          },
        },
        containedSuccess: {
          backgroundColor: "var(--color-bg-success-primary)",
          color: "var(--color-fg-on-success-primary)",
          "&:hover": {
            backgroundColor: "var(--color-bg-success-primary-hover)",
          },
        },
        containedError: {
          backgroundColor: "var(--color-bg-danger-primary)",
          color: "var(--color-fg-on-danger-primary)",
          "&:hover": {
            backgroundColor: "var(--color-bg-danger-primary-hover)",
          },
        },
        outlined: {
          borderColor: "var(--brand-border-neutral)",
          color: "var(--color-fg-default-primary)",
          backgroundColor: "var(--color-bg-default-primary)",
          "&:hover": {
            borderColor: "var(--color-border-accent-primary)",
            backgroundColor: "var(--color-bg-default-primary-hover)",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: radiusM,
          backgroundColor: "var(--color-bg-default-primary)",
          "& fieldset": {
            borderColor: "var(--color-border-default-primary)",
          },
          "&:hover fieldset": {
            borderColor: "var(--color-border-default-secondary)",
          },
          "&.Mui-focused fieldset": {
            borderColor: "var(--color-border-accent-primary)",
            borderWidth: "1.5px",
          },
          "&.Mui-error fieldset": {
            borderColor: "var(--color-border-danger-primary)",
          },
          "&.Mui-error": {
            backgroundColor: "var(--color-bg-danger-tertiary)",
          },
        },
        input: {
          color: "var(--color-fg-default-primary)",
          "&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus, &:-webkit-autofill:active":
            {
              WebkitTextFillColor: "var(--color-fg-default-primary)",
              caretColor: "var(--color-fg-default-primary)",
              WebkitBoxShadow:
                "0 0 0 1000px var(--color-bg-default-primary) inset",
              transition: "background-color 99999s ease-in-out 0s",
            },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "var(--color-fg-default-secondary)",
          "&.Mui-focused": {
            color: "var(--color-fg-accent-primary)",
          },
          "&.Mui-error": {
            color: "var(--color-fg-danger-primary)",
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          "&.Mui-error": {
            color: "var(--color-fg-danger-primary)",
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: radiusM,
          backgroundColor: "var(--color-bg-default-primary)",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--color-border-default-primary)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--color-border-default-secondary)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--color-border-accent-primary)",
            borderWidth: "1.5px",
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: "var(--color-fg-accent-primary)",
          "&:hover": {
            color: "var(--color-fg-accent-secondary)",
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: "var(--font-size-s)",
          "&.Mui-selected": {
            backgroundColor: "var(--color-bg-accent-tertiary)",
            "&:hover": {
              backgroundColor: "var(--color-bg-accent-tertiary-hover)",
            },
          },
          "&:hover": {
            backgroundColor: "var(--color-bg-default-tertiary-hover)",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontFamily: "var(--font-heading)",
          fontWeight: 500,
          fontSize: "var(--font-size-s)",
          color: "var(--color-fg-default-secondary)",
          backgroundColor: "var(--color-bg-default-tertiary)",
          borderBottom: "1px solid var(--color-border-default-primary)",
        },
        body: {
          fontSize: "var(--font-size-s)",
          color: "var(--color-fg-default-primary)",
          borderBottom: "1px solid var(--brand-divider)",
        },
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          fontFamily: "var(--font-heading)",
          fontSize: "var(--font-size-s)",
          "&.Mui-selected": {
            backgroundColor: "var(--color-bg-accent-primary)",
            color: "var(--color-fg-on-accent-primary)",
            "&:hover": {
              backgroundColor: "var(--color-bg-accent-primary-hover)",
            },
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          "&:focus-visible": {
            outline: "2px solid var(--color-border-accent-primary)",
            outlineOffset: "2px",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: "var(--color-bg-default-primary)",
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: "var(--color-bg-accent-primary)",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: "var(--font-heading)",
          fontWeight: 500,
          fontSize: "var(--font-size-s)",
          textTransform: "none",
          color: "var(--color-fg-default-secondary)",
          "&.Mui-selected": {
            color: "var(--color-fg-accent-primary)",
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        root: {
          "& .MuiBackdrop-root": {
            backgroundColor: "var(--color-bg-overlay-primary)",
          },
        },
        paper: {
          borderRadius: radiusL,
          backgroundColor: "var(--color-bg-default-primary)",
          boxShadow: "var(--shadow-popover)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: radiusM,
        },
        elevation1: {
          boxShadow: "var(--shadow-card)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: radiusM,
          fontWeight: 500,
          fontSize: "var(--font-size-xs)",
        },
        colorPrimary: {
          backgroundColor: "var(--color-bg-accent-secondary)",
          color: "var(--color-fg-accent-primary)",
        },
        colorSuccess: {
          backgroundColor: "var(--color-bg-success-secondary)",
          color: "var(--color-fg-success-primary)",
        },
        colorError: {
          backgroundColor: "var(--color-bg-danger-secondary)",
          color: "var(--color-fg-danger-primary)",
        },
        colorWarning: {
          backgroundColor: "var(--color-bg-warning-secondary)",
          color: "var(--color-fg-warning-primary)",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        standardSuccess: {
          backgroundColor: "var(--color-bg-success-secondary)",
          color: "var(--color-fg-success-primary)",
          border: "1px solid var(--color-border-success-tertiary)",
        },
        standardError: {
          backgroundColor: "var(--color-bg-danger-secondary)",
          color: "var(--color-fg-danger-primary)",
          border: "1px solid var(--color-border-danger-tertiary)",
        },
        standardWarning: {
          backgroundColor: "var(--color-bg-warning-secondary)",
          color: "var(--color-fg-warning-primary)",
          border: "1px solid var(--color-border-warning-tertiary)",
        },
        standardInfo: {
          backgroundColor: "var(--color-bg-accent-secondary)",
          color: "var(--color-fg-accent-primary)",
          border: "1px solid var(--color-border-accent-tertiary)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "var(--shadow-nav)",
          backgroundColor: "var(--color-bg-default-primary)",
          color: "var(--color-fg-default-primary)",
        },
      },
    },
  },
});
