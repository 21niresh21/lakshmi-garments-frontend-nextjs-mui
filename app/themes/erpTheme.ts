import { alpha } from "@mui/material/styles";
import { outlinedInputClasses } from "@mui/material/OutlinedInput";

const textFieldOverrides = {
  MuiTextField: {
    defaultProps: {
      variant: "outlined",
      size: "medium",
    },
  },

  MuiInputBase: {
    styleOverrides: {
      root: {
        borderRadius: 8,
      },
      input: {
        padding: "10px 12px",
        fontSize: "0.95rem",
        "&::placeholder": {
          opacity: 0.6,
        },
      },
    },
  },

  MuiOutlinedInput: {
    styleOverrides: {
      root: ({ theme }: any) => ({
        backgroundColor: theme.palette.background.paper,
        borderRadius: 8,
        border: `1px solid ${theme.palette.divider}`,
        transition: "border-color 120ms ease, box-shadow 120ms ease",

        "&:hover": {
          borderColor: theme.palette.primary.light,
        },

        [`&.${outlinedInputClasses.focused}`]: {
          borderColor: theme.palette.primary.main,
          boxShadow: `0 0 0 3px ${alpha(
            theme.palette.primary.main,
            0.2
          )}`,
        },

        [`&.${outlinedInputClasses.error}`]: {
          borderColor: theme.palette.error.main,
          boxShadow: `0 0 0 3px ${alpha(
            theme.palette.error.main,
            0.2
          )}`,
        },

        "&.Mui-disabled": {
          backgroundColor: theme.palette.action.disabledBackground,
        },
      }),

      notchedOutline: {
        border: "none",
      },
    },
  },

  MuiFormLabel: {
    styleOverrides: {
      root: ({ theme }: any) => ({
        fontSize: "0.75rem",
        fontWeight: 500,
        marginBottom: 6,
        color: theme.palette.text.secondary,

        "&.Mui-focused": {
          color: theme.palette.primary.main,
        },

        "&.Mui-error": {
          color: theme.palette.error.main,
        },
      }),
    },
  },

  MuiFormHelperText: {
    styleOverrides: {
      root: {
        marginLeft: 0,
        fontSize: "0.75rem",
      },
    },
  },

  MuiInputAdornment: {
    styleOverrides: {
      root: ({ theme }: any) => ({
        color: theme.palette.text.secondary,
      }),
    },
  },
};
