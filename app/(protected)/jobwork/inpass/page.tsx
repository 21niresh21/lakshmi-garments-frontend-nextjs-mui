"use client";

import { Button, Divider, Grid, Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { fetchJobworkDetail } from "@/app/api/jobworkApi";
import CuttingForm from "../../batch/assign/CuttingForm";
// import CuttingInpass from "./CuttingInpass";
import JobworkSummary from "./JobworkSummary";
import { useNotification } from "@/app/components/shared/NotificationProvider";
import { fetchItems } from "@/app/api/itemApi";
import JobworkItemsTable from "./JobworkItemsTable";
import { Item } from "@/app/_types/Item";

export default function Page() {
  const { notify } = useNotification();
  const [jobworkNumber, setJobworkNumber] = useState<string>("");
  const [jobwork, setJobwork] = useState<any | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [items, setItems] = useState<Item[]>([]);

  const handleFind = async () => {
    const trimmed = jobworkNumber.trim().toUpperCase();

    if (!trimmed) return;

    const jobworkNumberRegex = /^JW-\d{8}-\d{3}$/;
    if (!jobworkNumberRegex.test(trimmed)) {
      setError("Jobwork Number format must be JW-YYYYMMDD-XXX");
      return;
    }
    setLoading(true);
    try {
      const res = await fetchJobworkDetail(trimmed);
      setJobwork(res);
    } catch (error) {
      notify("No jobwork found", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems().then((res) => setItems(res));
  }, []);

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
              disabled={!jobworkNumber}
              loading={loading}
              loadingPosition="start"
            >
              Find
            </Button>
          </Stack>
          {jobwork && (
            <JobworkItemsTable
              setJobwork={setJobwork}
              jobwork={jobwork}
              allItems={items}
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
