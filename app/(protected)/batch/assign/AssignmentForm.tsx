"use client";

import {
  Autocomplete,
  Box,
  Button,
  Divider,
  Drawer,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Employee } from "@/app/_types/Employee";
import { INITIAL_JOBWORK, JobworkForm } from "./_types/jobwork.types";
import CuttingForm from "./CuttingForm";
import { useUser } from "@/app/context/UserContext";
import { useNotification } from "@/app/components/shared/NotificationProvider";
import { createJobwork } from "@/app/api/jobworkApi";
import { fetchJobworkPdf } from "@/app/api/pdfApi";
import ItemJobForm from "./ItemJobForm";
import { fetchBatchItems } from "@/app/api/BatchItemApi";

export type BatchSerialCode = {
  id: number;
  batchSerialCode: string;
};

interface Props {
  pendingBatches: string[];
  jobworkTypes: string[];
  employees: Employee[];
  setJobwork: Dispatch<SetStateAction<JobworkForm>>;
  jobwork: JobworkForm;
  availableQty: number;
  refresh: Dispatch<SetStateAction<boolean>>;
  refreshState: boolean;
}

export default function AssignmentForm({
  pendingBatches,
  jobworkTypes,
  setJobwork,
  jobwork,
  employees,
  availableQty,
  refresh,
  refreshState,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const [batchItems, setBatchItems] = useState();

  const { user } = useUser();
  const { notify } = useNotification();

  console.log(user);

  /* ================= PREVIEW ================= */

  const openPreview = async () => {
    try {
      // cleanup old blob
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
        setPdfUrl(null);
      }

      const payload = {
        ...jobwork, // ✅ move this up
        employeeName: jobwork.assignedTo,
        // employeeId: jobwork.employee?.id,
        batchSerialCode: jobwork.batchSerialCode,
        assignedBy: user?.id, // ✅ now cannot be overridden
        quantities:
          jobwork.jobworkType === "CUTTING"
            ? [jobwork.quantity]
            : jobwork.items.map((i) => i.quantity ?? 0),
        itemNames: jobwork.items.map((i) => i.item?.name ?? ""),
        remarks: jobwork.remarks,
      };

      const res = await fetchJobworkPdf(payload);
      const url = URL.createObjectURL(res);

      setPdfUrl(url);
      setPreviewOpen(true);
    } catch (e) {
      notify("Failed to load PDF preview", "error");
    }
  };

  // const printJobwork = async () => {
  //   try {
  //     // cleanup old blob
  //     if (pdfUrl) {
  //       URL.revokeObjectURL(pdfUrl);
  //       setPdfUrl(null);
  //     }

  //     const payload = {
  //       ...jobwork, // ✅ move this up
  //       employeeName: jobwork.employee?.name,
  //       employeeId: jobwork.employee?.id,
  //       batchSerialCode: jobwork.batchSerialCode,
  //       assignedBy: user?.id, // ✅ now cannot be overridden
  //       quantities:
  //         jobwork.jobworkType === "CUTTING"
  //           ? [jobwork.quantity]
  //           : jobwork.items.map((i) => i.quantity ?? 0),
  //       itemNames: jobwork.items.map((i) => i.?.name ?? ""),
  //       remarks: jobwork.remarks,
  //     };

  //     const res = await fetchJobworkPdf(payload);
  //     const url = URL.createObjectURL(res);

  //     setPdfUrl(url);
  //   } catch (e) {
  //     notify("Failed to load PDF preview", "error");
  //   }
  // };

  /* ================= SUBMIT ================= */

  const submitCuttingJobwork = () => {
    const { quantities, itemNames, items, ...cuttingPayload } = jobwork;
    const payload = {
      ...cuttingPayload,

      quantity:
        jobwork.jobworkType === "CUTTING"
          ? jobwork.quantity
          : jobwork.items.map((i) => i.quantity ?? 0),
    };
    console.log(payload);

    setLoading(true);
    createJobwork(payload)
      .then(() => {
        setJobwork(INITIAL_JOBWORK);
        notify("Jobwork created", "success");
        refresh(!refreshState);
      })
      .catch(() => notify("Error creating jobwork", "error"))
      .finally(() => setLoading(false));
  };

  const submitItemBasedJobwork = () => {
    const { quantities, itemNames, items, quantity, ...itemBasedPayload } =
      jobwork;
    const payload = {
      ...itemBasedPayload,
      itemNames: jobwork.items.map((i) => i.item?.name ?? ""),
      quantities: jobwork.items.map((i) => i.quantity ?? 0),
    };
    console.log(payload);
    setLoading(true);
    createJobwork(payload)
      .then(() => {
        setJobwork(INITIAL_JOBWORK);
        notify("Jobwork created", "success");
        refresh(!refreshState);
      })
      .catch(() => notify("Error creating jobwork", "error"))
      .finally(() => setLoading(false));
  };
  /* ================= CLEANUP ================= */

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  useEffect(() => {
    if (
      jobwork.batchSerialCode &&
      jobwork.jobworkType &&
      jobwork.jobworkType !== "CUTTING"
    ) {
      fetchBatchItems(jobwork.batchSerialCode, jobwork.jobworkType)
        .then((res) => setBatchItems(res))
        .catch((err) => {
          notify("Error fetching batch items", "error");
        });
    }
  }, [jobwork.batchSerialCode, jobwork.jobworkType]);

  /* ================= UI ================= */

  return (
    <Paper sx={{ p: { xs: 2, md: 1 } }} elevation={0}>
      <Typography fontWeight={600} variant="h6">
        Assign Batch
      </Typography>
      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Typography variant="body1" mb={2}>
            Jobwork Number: {jobwork.jobworkNumber}
          </Typography>
        </Grid>

        {/* Responsive inputs: stack on xs, side-by-side on sm+ */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <Autocomplete
            fullWidth
            openOnFocus
            autoHighlight
            options={pendingBatches}
            value={jobwork.batchSerialCode}
            onChange={(_, value) =>
              setJobwork((p) => ({ ...p, batchSerialCode: value || "" }))
            }
            renderInput={(params) => (
              <TextField {...params} label="Batch Serial Code" size="medium" />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Autocomplete
            fullWidth
            openOnFocus
            autoHighlight
            options={jobworkTypes}
            value={jobwork.jobworkType}
            onChange={(_, value) =>
              setJobwork((p) => ({ ...p, jobworkType: value || "" }))
            }
            renderInput={(params) => (
              <TextField {...params} label="Jobwork Type" size="medium" />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Autocomplete
            fullWidth
            openOnFocus
            autoHighlight
            options={employees.map((e) => e.name)}
            value={jobwork.assignedTo}
            onChange={(_, value) =>
              setJobwork((p) => ({ ...p, assignedTo: value ?? "" }))
            }
            renderInput={(params) => (
              <TextField {...params} label="Employee" size="medium" />
            )}
            disabled={!jobwork.batchSerialCode || !jobwork.jobworkType}
          />
        </Grid>

        {/* Dynamic Forms */}
        <Grid size={{ xs: 12 }}>
          {jobwork.jobworkType === "CUTTING" ? (
            <CuttingForm
              maxQty={availableQty}
              jobwork={jobwork}
              setJobwork={setJobwork}
            />
          ) : (
            jobwork.jobworkType && (
              <ItemJobForm
                batchItems={batchItems ?? []}
                jobwork={jobwork}
                setJobwork={setJobwork}
              />
            )
          )}
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            label="Remarks"
            fullWidth
            multiline
            rows={2}
            value={jobwork.remarks}
            onChange={(e) =>
              setJobwork((p) => ({ ...p, remarks: e.target.value }))
            }
          />
        </Grid>

        {/* Actions */}
        <Grid
          size={{ xs: 12 }}
          sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 1 }}
        >
          <Button
            variant="outlined"
            onClick={openPreview}
            disabled={
              loading ||
              !jobwork.assignedTo ||
              !jobwork.batchSerialCode ||
              (jobwork.jobworkType === "CUTTING" && !jobwork.quantity)
            }
          >
            Preview
          </Button>
          <Button
            variant="contained"
            onClick={
              jobwork.jobworkType === "CUTTING"
                ? submitCuttingJobwork
                : submitItemBasedJobwork
            }
            disabled={
              loading ||
              !jobwork.assignedTo ||
              !jobwork.batchSerialCode ||
              (jobwork.jobworkType === "CUTTING" && !jobwork.quantity)
            }
          >
            Assign
          </Button>
        </Grid>
      </Grid>

      {/* Responsive Drawer width */}
      <Drawer
        anchor="right"
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        PaperProps={{ sx: { width: { xs: "100%", sm: 500 } } }}
      >
        <Box sx={{ p: 1, height: "100%" }}>
          {pdfUrl && (
            <iframe
              src={pdfUrl}
              width="100%"
              height="100%"
              style={{ border: "none" }}
            />
          )}
        </Box>
      </Drawer>
    </Paper>
  );
}
