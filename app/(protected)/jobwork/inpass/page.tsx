"use client";

import { Autocomplete, Grid, Stack, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import JobworkSummary from "./JobworkSummary";
import {
  fetchJobworks,
  fetchUnfinishedJobworks,
} from "@/app/api/jobworkApi";
import { useNotification } from "@/app/components/shared/NotificationProvider";
import { fetchEmployees } from "@/app/api/employeeApi";

export default function Page() {
  const { notify } = useNotification();

  const [jobworks, setJobworks] = useState<any[]>([]);
  const [employees, setEmployees] = useState<string[]>([]);

  const [selectedJobwork, setSelectedJobwork] = useState<any | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");

  // -----------------------------
  // Initial data load
  // -----------------------------
  useEffect(() => {
    fetchEmployees()
      .then((res) => setEmployees(res.map((emp: any) => emp.name)))
      .catch(() => notify("Error when fetching employees", "error"));

    fetchJobworks()
      .then((res) => setJobworks(res.content))
      .catch(() => notify("Error when fetching jobworks", "error"));
  }, [notify]);

  // -----------------------------
  // Fetch unfinished jobworks when filters change
  // -----------------------------
  useEffect(() => {
    const jobworkNumber = selectedJobwork?.jobworkNumber ?? "";
    const employeeName = selectedEmployee;

    // Do nothing if no filters are selected
    if (!jobworkNumber || !employeeName) return;

    console.log(Boolean(employeeName), Boolean(jobworkNumber))
    fetchUnfinishedJobworks(employeeName, jobworkNumber).catch(() =>
      notify("Error when fetching unfinished jobworks", "error")
    );
  }, [selectedJobwork, selectedEmployee]);

  return (
    <>
      {/* Filters */}
      <Grid container size={12} mb={2}>
        <Stack columnGap={2} flexDirection="row">
          {/* Jobwork Autocomplete */}
          <Autocomplete
            id="jobwork-autocomplete"
            openOnFocus
            autoSelect
            disablePortal
            autoHighlight
            options={jobworks}
            getOptionLabel={(jw) => jw?.jobworkNumber ?? ""}
            value={selectedJobwork}
            onChange={(_, selected) => setSelectedJobwork(selected)}
            isOptionEqualToValue={(option, value) =>
              option.jobworkNumber === value.jobworkNumber
            }
            renderInput={(params) => (
              <TextField {...params} label="Jobwork Number" />
            )}
            sx={{ width: 400 }}
          />

          {/* Employee Autocomplete */}
          <Autocomplete
            id="employee-autocomplete"
            openOnFocus
            autoSelect
            disablePortal
            autoHighlight
            options={employees}
            value={selectedEmployee}
            onChange={(_, selected) => {
              setSelectedEmployee(selected ?? "");
            }}
            renderInput={(params) => (
              <TextField {...params} label="Employee Name" />
            )}
            sx={{ width: 400 }}
          />
        </Stack>
      </Grid>

      {/* Content */}
      <Grid container size={12}>
        {/* {selectedJobwork.jobwork} */}
        {/* <Grid size={5}>
          <JobworkSummary jobwork={selectedJobwork} />
        </Grid>
        <Grid size={2}>wefe</Grid>
        <Grid size={5}>efefe</Grid> */}
      </Grid>
    </>
  );
}
