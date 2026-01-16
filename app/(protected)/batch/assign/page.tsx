"use client";

import {
  fetchAvailableQuantity,
  fetchBatches,
  getAllowedJobworkTypes,
  getUnfinishedBatches,
  getUnfinishedUrgentBatches,
} from "@/app/api/batchApi";
import { Divider, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import BatchList from "./BatchList";
import AssignmentForm from "./AssignmentForm";
import { fetchEmployees, fetchEmployeeStats } from "@/app/api/employeeApi";
import { Employee } from "@/app/_types/Employee";
import EmployeeStats from "./EmployeeStats";
import { INITIAL_JOBWORK, JobworkForm } from "./_types/jobwork.types";
import CuttingForm from "./CuttingForm";
import { fetchNextJobworkNumber } from "@/app/api/jobworkApi";
import BatchStats from "./BatchStats";

export default function Page() {
  const [urgentBatches, setUrgentBatches] = useState([]);
  const [pendingBatches, setPendingBatches] = useState<string[]>([]);
  const [jobworkTypes, setJobworkTypes] = useState([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeeStats, setEmployeeStats] = useState({});
  const [jobwork, setJobwork] = useState<JobworkForm>(INITIAL_JOBWORK);
  const [availableQty, setAvailableQty] = useState<number>();
  const [refresh, setRefresh] = useState<boolean>(false);

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
  }, [refresh]);

  useEffect(() => {
    console.log("changed", jobwork.batchSerialCode);
    if (jobwork.batchSerialCode && jobwork.batchSerialCode.trim() !== "") {
      getAllowedJobworkTypes(jobwork.batchSerialCode).then((res) => {
        setJobworkTypes(res);
      });
    } else {
      setJobworkTypes([]);
      setJobwork((prev) => ({
        ...prev,
        jobworkType: "",
        assignedTo: "",
      }));
    }

    if (jobwork.batchSerialCode) {
      fetchAvailableQuantity(jobwork.batchSerialCode, "cutting").then((res) => {
        setAvailableQty(res);
      });
    }
  }, [jobwork.batchSerialCode]);

  useEffect(() => {
    if (jobwork.jobworkType && jobwork.batchSerialCode.trim() !== "") {
      fetchEmployees({ skillNames: [jobwork.jobworkType] })
        .then((res: any) => {
          setEmployees(res.content);
        })
        .catch((err) => console.log("error fetching emp"));
    } else {
      setJobwork((prev) => ({
        ...prev,
        jobworkType: "",
      }));
    }
    setJobwork((prev) => ({
      ...prev,
      assignedTo: "",
    }));
  }, [jobwork.jobworkType]);

  return (
    <Grid
      container
      sx={{ height: "calc(100vh - 130px)", overflow: "auto" }}
      spacing={2}
    >
      <Grid
        container
        direction="column"
        size={7.5}
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
            availableQty={availableQty ?? 0}
            refreshState={refresh}
            refresh={setRefresh}
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
      <Grid size={1}>
        <Divider orientation="vertical" sx={{ mx: 1 }} />
      </Grid>
      <Grid size={3.5}>
        <BatchList batchList={urgentBatches} />
      </Grid>
    </Grid>
  );
}
