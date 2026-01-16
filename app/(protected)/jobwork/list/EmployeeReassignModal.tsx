import { Employee } from "@/app/_types/Employee";
import { fetchEmployees } from "@/app/api/employeeApi";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { JobworkRow } from "./page";

type EmployeeReassignForm = {
  open: boolean;
  selectedEmployee?: Employee;
  setSelectedEmployee: (employee: Employee | null) => void;
  onClose: () => void;
  onSubmit: () => void;
  currentEmployee?: string;
  jobwork?: JobworkRow;
};

export default function EmployeeReassignModal({
  open,
  onClose,
  selectedEmployee,
  setSelectedEmployee,
  onSubmit,
  currentEmployee,
  jobwork,
}: EmployeeReassignForm) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const filteredEmployees = currentEmployee
    ? employees.filter((e) => e.name !== currentEmployee)
    : employees;

  useEffect(() => {
    if (jobwork) {
      fetchEmployees({ skillNames: [jobwork?.jobworkType ?? ""] })
        .then((res: any) => {
          setEmployees(res.content);
          console.log(res.content)
        })
        .catch((err) => console.log("Error fetching Employee"));
    }
  }, [jobwork]);
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Re-Assign Jobwork</DialogTitle>

      <DialogContent sx={{ my: 1 }}>
        <Autocomplete
          sx={{ my: 1 }}
          openOnFocus
          disablePortal
          autoHighlight
          options={filteredEmployees}
          getOptionLabel={(o) => o.name}
          value={selectedEmployee ?? null}
          isOptionEqualToValue={(option, value) => option.id === value.id} // ✅ FIX
          ListboxProps={{
            style: {
              maxHeight: 240,
              overflow: "auto",
            },
          }}
          onChange={(_, employee) => setSelectedEmployee(employee)}
          renderInput={(params) => <TextField {...params} label="Employee" />}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={() => onSubmit()}
          disabled={!selectedEmployee}
          // loading={loading}
          loadingPosition="end"
        >
          Assign
        </Button>
      </DialogActions>
    </Dialog>
  );
}
