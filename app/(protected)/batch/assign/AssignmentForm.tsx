import {
  Autocomplete,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { Dispatch, SetStateAction } from "react";
import { JobworkForm } from "./page";
import { Employee } from "@/app/_types/Employee";

export type BatchSerialCode = {
  id: number;
  serialCode: string;
};

interface Props {
  pendingBatches: BatchSerialCode[];
  jobworkTypes: string[];
  employees: Employee[];
  setForm: Dispatch<SetStateAction<JobworkForm>>;
  jobwork: JobworkForm;
}

export default function AssignmentForm({
  pendingBatches,
  jobworkTypes,
  setForm,
  jobwork,
  employees
}: Props) {
  console.log("type", jobwork.jobworkType);
  return (
    <Paper
      sx={{
        height: "100%",
        p: 2,
        display: "flex",
        flexDirection: "column",
      }}
      elevation={2}
    >
      <Typography fontWeight={600} mb={1}>
        Assign Batch
      </Typography>
      <Divider />
      <Grid container spacing={2} mt={4}>
        <Grid size={4}>
          <Autocomplete
            disablePortal
            fullWidth
            autoHighlight
            options={pendingBatches.map((b) => b.serialCode)}
            value={jobwork.serialCode}
            onChange={(_, value) => {
              setForm((prev) => ({
                ...prev,
                serialCode: value ? value : "",
              }));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Batch Serial Code"
                // error={!!errors?.supplierID}
                // helperText={errors?.supplierID}
              />
            )}
          />
        </Grid>
        {jobworkTypes.length > 0 && (
          <Grid size={4}>
            <Autocomplete
              disablePortal
              fullWidth
              autoHighlight
              options={jobworkTypes}
              value={jobwork.jobworkType}
              onChange={(_, value) => {
                setForm((prev) => ({
                  ...prev,
                  jobworkType: value ? value : "",
                }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Jobwork Type"
                  // error={!!errors?.supplierID}
                  // helperText={errors?.supplierID}
                />
              )}
            />
          </Grid>
        )}
        {jobwork.jobworkType && (
          <Grid size={4}>
            <Autocomplete
              disablePortal
              fullWidth
              autoHighlight
              options={employees}
              getOptionLabel={(emp)=>emp.name}
              value={jobwork.employee}
              onChange={(_, value) => {
                setForm((prev) => ({
                  ...prev,
                  employee: value,
                }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Employee"
                  // error={!!errors?.supplierID}
                  // helperText={errors?.supplierID}
                />
              )}
            />
          </Grid>
        )}
      </Grid>
    </Paper>
  );
}
