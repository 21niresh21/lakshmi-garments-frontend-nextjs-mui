"use client";

import { Alert, Button, Divider, Grid, IconButton, Link, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { fetchJobworkDetail, getItemsForJobwork } from "@/app/api/jobworkApi";
import CuttingForm from "../../batch/assign/CuttingForm";
// import CuttingInpass from "./CuttingInpass";
import JobworkSummary from "./JobworkSummary";
import { useNotification } from "@/app/components/shared/NotificationProvider";
import { fetchItems } from "@/app/api/itemApi";
import JobworkItemsTable from "./JobworkItemsTable";
import { Item } from "@/app/_types/Item";
import { useGlobalLoading } from "@/app/components/layout/LoadingProvider";
import { JobworkStatus } from "@/app/_types/JobworkStatus";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

export default function Page() {
  const { notify } = useNotification();
  const {loading, showLoading, hideLoading} = useGlobalLoading();
  const [jobworkNumber, setJobworkNumber] = useState<string>("");
  const [jobwork, setJobwork] = useState<any | null>(null);
  const [error, setError] = useState<string>("");

  const [items, setItems] = useState<Item[]>([]);
  const [itemsForJobwork, setItemsForJobWork] = useState([]);

  const handleCopyJobworkNumber = () => {
    if (jobwork?.jobworkNumber) {
      navigator.clipboard.writeText(jobwork.jobworkNumber);
      notify("Jobwork number copied to clipboard", "success");
    }
  };

  const handleFind = async () => {
    const trimmed = jobworkNumber.trim().toUpperCase();

    if (!trimmed) return;

    const jobworkNumberRegex = /^JW-\d{8}-\d{3}$/;
    if (!jobworkNumberRegex.test(trimmed)) {
      setError("Jobwork Number format must be JW-YYYYMMDD-XXX");
      return;
    }
    showLoading();
    setJobwork(null);
    try {
      const res = await fetchJobworkDetail(trimmed);
      setJobwork(res);
    } catch (error) {
      notify("No jobwork found", "error");
      setJobwork(null);
      
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    fetchItems().then((res) => setItems(res));
  }, []);

  useEffect(() => {
    if (jobwork && jobworkNumber && jobwork.jobworkType !== 'CUTTING') {
      getItemsForJobwork(jobworkNumber)
        .then((res) => setItemsForJobWork(res))
        .catch(() => {
          notify("Error fetching items given for jobwork", "error");
        });
    }
  }, [jobwork]);

  return (
    <>
      <Grid container spacing={2} height="100%">
        <Grid size={8}>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              label="Jobwork Number"
              value={jobworkNumber}
              onChange={(e) => {
                setJobworkNumber(e.target.value.toUpperCase());
                setError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleFind(); // trigger the same function as the button
                }
              }}
              sx={{ width: 360 }}
              error={Boolean(error)}
              helperText={error}
            />
            <Button
              sx={{ height: 40 }}
              variant="contained"
              onClick={handleFind}
              disabled={!jobworkNumber || loading}
              loading={loading}
              loadingPosition="start"
            >
              Find
            </Button>
            <Link
              href="/jobwork/employee-lookup"
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              sx={{ 
                fontSize: "0.875rem", 
                cursor: "pointer",
                whiteSpace: "nowrap" 
              }}
            >
              Find by Employee
            </Link>
          </Stack>
          {jobwork && (
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2, mb: 2 }}>
              <Typography variant="h6" fontWeight={700}>
                {jobwork.jobworkNumber}
              </Typography>
              <Tooltip title="Copy Jobwork Number">
                <IconButton onClick={handleCopyJobworkNumber} size="small" color="primary">
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          )}
          {jobwork?.jobworkStatus === JobworkStatus.AWAITING_APPROVAL && (
            <Alert severity="warning" sx={{ mt: 2, mb: 2 }}>
              This jobwork has a receipt raised already and is still pending approval. 
              No further actions can be taken until the receipt is approved or rejected.
            </Alert>
          )}
          {jobwork && (
            <JobworkItemsTable
              key={jobwork.jobworkNumber}
              setJobwork={setJobwork}
              jobwork={jobwork}
              allItems={jobwork?.jobworkType == 'CUTTING' ? items : itemsForJobwork}
              setJobworkNumber={setJobworkNumber}
            />
          )}
        </Grid>
        <Grid size={0.5}>{jobwork && <Divider orientation="vertical" />}</Grid>
        <Grid size={3.5}>
          {jobwork?.jobworkType && (
            <>
              <JobworkSummary jobwork={jobwork} />
            </>
          )}
        </Grid>
      </Grid>
    </>
  );
}
