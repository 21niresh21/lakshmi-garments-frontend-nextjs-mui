// src/theme/baseTheme.ts
import { createTheme } from "@mui/material/styles";

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
