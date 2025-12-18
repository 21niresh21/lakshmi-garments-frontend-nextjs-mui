"use client";

import {
  getJobworkTypes,
  getUnfinishedBatches,
  getUnfinishedUrgentBatches,
} from "@/app/api/batchApi";
import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import BatchList from "./BatchList";
import AssignmentForm from "./AssignmentForm";
import { fetchEmployees, fetchEmployeeStats } from "@/app/api/employeeApi";
import { Employee } from "@/app/_types/Employee";
import EmployeeStats from "./EmployeeStats";

export const INITIAL_JOBWORK: JobworkForm = {
  serialCode: "",
  jobworkType: "",
  assignedBy: undefined,
  employee: null,
};

export type JobworkForm = {
  serialCode: string;
  jobworkType: string;
  assignedBy?: number;
  employee: Employee | null;
};

export default function Page() {
  const [urgentBatches, setUrgentBatches] = useState([]);
  const [pendingBatches, setPendingBatches] = useState([]);
  const [jobworkTypes, setJobworkTypes] = useState([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeeStats, setEmployeeStats] = useState({});
  const [jobwork, setJobwork] = useState<JobworkForm>(INITIAL_JOBWORK);

  useEffect(() => {
    getUnfinishedUrgentBatches().then((res) => {
      setUrgentBatches(res.content);
    });

    getUnfinishedBatches().then((res) => {
      setPendingBatches(res);
    });

    fetchEmployeeStats(1).then((res) => {
      setEmployeeStats(res);
      console.log(res);
    });
  }, []);

  useEffect(() => {
    console.log("changed", jobwork.serialCode);
    if (jobwork.serialCode && jobwork.serialCode.trim() !== "") {
      getJobworkTypes(jobwork.serialCode).then((res) => {
        setJobworkTypes(res);
      });
    } else {
      setJobworkTypes([]);
      setJobwork((prev) => ({
        ...prev,
        jobworkType: "",
      }));
    }
  }, [jobwork.serialCode]);

  useEffect(() => {
    if (jobwork.jobworkType && jobwork.serialCode.trim() !== "") {
      fetchEmployees()
        .then((res) => {
          setEmployees(res);
        })
        .catch((err) => console.log("error fetching emp"));
    }
  }, [jobwork.jobworkType]);

  return (
    <Grid container sx={{ height: "calc(100vh - 130px)",overflow: "hidden" }} spacing={2}>
      <Grid
        container
        direction="column"
        size={8}
        spacing={2}
        sx={{ minHeight: 0 }}
      >
        <Grid height="70%" size={12}>
          <AssignmentForm
            pendingBatches={pendingBatches}
            jobworkTypes={jobworkTypes}
            employees={employees}
            setForm={setJobwork}
            jobwork={jobwork}
          />
        </Grid>
        <Grid container spacing={2} sx={{ flex: 1, minHeight: 0 }}>
          <Grid size={6} sx={{ minHeight: 0 }}>
            <BatchList batchList={urgentBatches} />
          </Grid>

          <Grid size={6} sx={{ minHeight: 0 }}>
            <EmployeeStats />
          </Grid>
        </Grid>
      </Grid>
      <Grid size={4}>gg</Grid>
    </Grid>
  );
}
