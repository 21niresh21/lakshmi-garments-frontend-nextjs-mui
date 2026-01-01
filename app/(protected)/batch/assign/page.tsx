"use client";

import {
  fetchBatches,
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
import { INITIAL_JOBWORK, JobworkForm } from "./_types/jobwork.types";
import CuttingForm from "./CuttingForm";
import { fetchNextJobworkNumber } from "@/app/api/jobworkApi";

export default function Page() {
  const [urgentBatches, setUrgentBatches] = useState([]);
  const [pendingBatches, setPendingBatches] = useState([]);
  const [jobworkTypes, setJobworkTypes] = useState([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeeStats, setEmployeeStats] = useState({});
  const [jobwork, setJobwork] = useState<JobworkForm>(INITIAL_JOBWORK);
  const [availableQty, setAvailableQty] = useState<number>();

  useEffect(() => {
    getUnfinishedUrgentBatches().then((res) => {
      setUrgentBatches(res.content);
    });

    getUnfinishedBatches().then((res) => {
      setPendingBatches(res);
    });

    fetchNextJobworkNumber().then((res) =>
      setJobwork((prev) => ({ ...prev, jobworkNumber: res }))
    );

    // fetchEmployeeStats(1).then((res) => {
    //   setEmployeeStats(res);
    //   console.log(res);
    // });
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

    fetchBatches({ search: jobwork.serialCode }).then((res) => {
      setAvailableQty(res.content[0].availableQuantity);
    });
  }, [jobwork.serialCode]);

  useEffect(() => {
    console.log(jobwork.jobworkType);
    if (jobwork.jobworkType && jobwork.serialCode.trim() !== "") {
      fetchEmployees()
        .then((res) => {
          setEmployees(res);
        })
        .catch((err) => console.log("error fetching emp"));
    }
  }, [jobwork.jobworkType]);

  return (
    <Grid
      container
      sx={{ height: "calc(100vh - 130px)", overflow: "hidden" }}
      spacing={2}
    >
      <Grid
        container
        direction="column"
        size={8}
        spacing={2}
        sx={{ minHeight: 0 }}
      >
        <Grid size={12}>
          <AssignmentForm
            pendingBatches={pendingBatches}
            jobworkTypes={jobworkTypes}
            employees={employees}
            setJobwork={setJobwork}
            jobwork={jobwork}
            availableQty={availableQty?? 0}
          />
        </Grid>
        {/* <Grid container spacing={2} sx={{ flex: 1, minHeight: 0 }}>
          <Grid size={6} sx={{ minHeight: 0 }}>
            <BatchList batchList={urgentBatches} />
          </Grid>

          <Grid size={6} sx={{ minHeight: 0 }}>
            <EmployeeStats />
          </Grid>
        </Grid> */}
      </Grid>
      <Grid size={4}>gg</Grid>
    </Grid>
  );
}
