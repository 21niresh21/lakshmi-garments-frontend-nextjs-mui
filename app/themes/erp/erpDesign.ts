// src/theme/designSystem.ts
import { createTheme } from "@mui/material/styles";
import { baseTheme } from "./baseTheme";
import { componentOverrides } from "../components";

const erpDesign = createTheme(baseTheme, {
  components: {
    ...componentOverrides,

    // keep your existing overrides here
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

export default erpDesign;
