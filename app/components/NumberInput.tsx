"use client";

import React from "react";
import { TextField, TextFieldProps } from "@mui/material";
import { sanitizeNumberInput } from "../utils/number";

interface NumberInputProps extends Omit<TextFieldProps, "onChange"> {
  value?: number;
  onChange: (val: number | undefined) => void;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  ...rest
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Remove any non-digit characters
    const sanitized = sanitizeNumberInput(raw);
    onChange(sanitized === "" ? undefined : Number(sanitized));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent e, +, -, . etc.
    if (["e", "E", "+", "-"].includes(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <TextField
      type="number"
      value={value ?? ""}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      {...rest}
      inputProps={{
        ...rest.inputProps,
        pattern: "[0-9]*", // optional HTML pattern
      }}
    />
  );
};
