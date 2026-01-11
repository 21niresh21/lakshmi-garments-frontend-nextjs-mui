import { createTheme, ThemeProvider } from "@mui/material/styles";
import { purple } from "@mui/material/colors";

export const baseTheme = createTheme({
  palette: {
    primary: {
      main: "#00569d",
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
  },

  shape: {
    borderRadius: 8,
  },

  typography: {
    fontFamily: `"Inter", "Roboto", "Helvetica", "Arial", sans-serif`,
    fontSize: 14,
  },
});

const theme = createTheme(baseTheme, {
  components: {
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: baseTheme.palette.primary.main,
          color: baseTheme.palette.primary.contrastText,
          fontWeight: "bold",
        },
      },
    },

    MuiTableSortLabel: {
      styleOverrides: {
        root: {
          color: baseTheme.palette.primary.contrastText, // default white

          "&:hover": {
            color: baseTheme.palette.primary.contrastText, // hover white
          },

          "&.Mui-active": {
            color: baseTheme.palette.primary.contrastText, // active white
          },
        },

        icon: {
          color: baseTheme.palette.primary.contrastText + " !important", // arrow white
        },
      },
    },
  },
});

export default theme;
