// src/theme/designSystem.ts
import { createTheme } from "@mui/material/styles";
import { baseTheme } from "./baseTheme";
import { componentOverrides } from "../components";

const erpDesign = createTheme(baseTheme, {
  components: {
    ...componentOverrides,

    // keep your existing overrides here
    MuiOutlinedInput: {
  styleOverrides: {
    root: {
      height: 40,
      fontWeight: 500,
    },
    notchedOutline: {
      borderWidth: 2,
    },
  },
},

    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: "0.75rem",
          color: "#667085",
        },
      },
    },
  },
});

export default erpDesign;
