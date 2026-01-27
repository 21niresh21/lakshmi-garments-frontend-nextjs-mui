import { alpha, createTheme, Theme } from "@mui/material/styles";
import { ThemeConfiguration } from "@/app/context/ThemeContext";

export const createCustomTheme = (config: ThemeConfiguration) => {
  const baseTheme = createTheme({
    palette: {
      mode: config.mode,
      primary: {
        main: config.primaryMain,
        light: config.primaryLight,
        dark: config.primaryDark,
      },
      secondary: {
        main: config.secondaryMain,
      },
      background: {
        default: config.mode === "light" ? alpha(config.primaryMain, 0.04) : "#121212",
        paper: config.mode === "light" ? "#FFFFFF" : "#1E1E1E",
      },
    },
    shape: {
      borderRadius: config.borderRadius,
    },
    typography: {
      fontFamily: config.fontFamily,
      fontSize: config.fontSize,
    },
  });

  return createTheme(baseTheme, {
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 600,
            borderRadius: config.borderRadius,
          },
          containedPrimary: {
            "&:hover": {
              backgroundColor: baseTheme.palette.primary.dark,
            },
          },
          outlinedPrimary: {
            "&:hover": {
              backgroundColor: baseTheme.palette.primary.main + "10", // Very light tint 
            },
          },
        },
        defaultProps: {
          size: config.compactMode ? "small" : "medium",
        }
      },
      MuiTextField: {
        defaultProps: {
          size: config.compactMode ? "small" : "medium",
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: config.compactMode ? {
            padding: "6px 16px",
          } : {},
          head: {
            backgroundColor: baseTheme.palette.primary.main,
            color: baseTheme.palette.primary.contrastText,
            fontWeight: "bold",
            padding: config.compactMode ? "8px 16px" : "16px",
          },
        },
      },
      MuiDialogTitle: {
        styleOverrides: {
          root: {
            backgroundColor: baseTheme.palette.primary.main,
            color: baseTheme.palette.primary.contrastText,
          },
        },
      },
      MuiTableSortLabel: {
        styleOverrides: {
          root: {
            color: baseTheme.palette.primary.contrastText,
            "&:hover": {
              color: baseTheme.palette.primary.contrastText,
            },
            "&.Mui-active": {
              color: baseTheme.palette.primary.contrastText,
            },
          },
          icon: {
            color: baseTheme.palette.primary.contrastText + " !important",
          },
        },
      },
    },
  });
};

// Default export for initial load / server-side
const defaultTheme = createCustomTheme({
  primaryMain: "#AA60C8",
  primaryLight: "#B28CFA",
  primaryDark: "#6422CC",
  secondaryMain: "#3F4C6B",
  borderRadius: 4,
  mode: "light",
  fontSize: 14,
  fontFamily: "'Inter', 'Roboto', sans-serif",
  compactMode: false
});
export default defaultTheme;
