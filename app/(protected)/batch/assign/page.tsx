"use client";

import {
  fetchAvailableQuantity,
  fetchBatches,
  getAllowedJobworkTypes,
  getUnfinishedBatches,
  getUnfinishedUrgentBatches,
} from "@/app/api/batchApi";
import { Box, Divider, Grid } from "@mui/material";
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
      setJobwork((prev) => ({ ...prev, jobworkNumber: res })),
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
    <Box sx={{ p: { xs: 1, md: 1 } }}>
      <Grid container spacing={3}>
        {/* Left Section: Assignment Form */}
        <Grid size={{ xs: 12, md: 8 }}>
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

        {/* Right Section: Priority List */}
        <Grid
          size={{ xs: 12, md: 4 }}
          sx={{
            borderLeft: { md: "1px solid #e0e0e0" },
            pl: { md: 3 },
          }}
        >
          <BatchList batchList={urgentBatches} />
        </Grid>
      </Grid>
    </Box>
  );
}
