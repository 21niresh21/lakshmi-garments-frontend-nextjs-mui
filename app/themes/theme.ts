import { createTheme, ThemeProvider } from "@mui/material/styles";
import { purple } from "@mui/material/colors";

const baseTheme = createTheme({
  palette: {
    primary: {
      main: purple[500],
    },
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
  },
});

export default theme;
