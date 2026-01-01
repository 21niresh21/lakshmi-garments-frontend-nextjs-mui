"use client";
import { Button, Grid, TextField } from "@mui/material";
import React, { Dispatch, SetStateAction } from "react";
import { JobworkForm } from "./_types/jobwork.types";

interface Props {
  setJobwork: Dispatch<SetStateAction<JobworkForm>>;
  jobwork: JobworkForm;
  maxQty: number
}

export default function CuttingForm({ setJobwork, jobwork, maxQty }: Props) {
  return (
    <Grid>
      <Grid></Grid>
      <TextField
        id="quantity"
        type="number"
        label="Quantity"
        fullWidth
        value={jobwork.quantity ?? ""}
        onChange={(e) => {
          const raw = e.target.value;
          let value = raw === "" ? undefined : Number(raw);

          if (value !== undefined && value > maxQty) {
            value = maxQty; // clamp
          }

          setJobwork((prev) => ({
            ...prev,
            quantity: value,
          }));
        }}
        // error={!!errors.transportCost}
        helperText={`Available quantity ${maxQty}`}
      />
    </Grid>
  );
}
