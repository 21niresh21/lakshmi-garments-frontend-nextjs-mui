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

export type BatchSerialCode = {
  id: number;
  serialCode: string;
};

interface Props {
  pendingBatches: BatchSerialCode[];
  jobworkTypes: string[];
  employees: Employee[];
  setJobwork: Dispatch<SetStateAction<JobworkForm>>;
  jobwork: JobworkForm;
  availableQty: number;
}

export default function AssignmentForm({
  pendingBatches,
  jobworkTypes,
  setJobwork,
  jobwork,
  employees,
  availableQty,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const { user } = useUser();
  const { notify } = useNotification();

  /* ================= PREVIEW ================= */

  const openPreview = async () => {
    try {
      // cleanup old blob
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
        setPdfUrl(null);
      }

      const payload = {
        employeeName: jobwork.employee?.name,
        employeeId: jobwork.employee?.id,
        batchSerialCode: jobwork.serialCode,
        assignedBy: user?.id,
        jobworkType: "CUTTING",
        quantities: [jobwork.quantity],
        jobworkNumber: jobwork.jobworkNumber,
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

  const printJobwork = async () => {
    try {
      // cleanup old blob
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
        setPdfUrl(null);
      }

      const payload = {
        employeeName: jobwork.employee?.name,
        employeeId: jobwork.employee?.id,
        batchSerialCode: jobwork.serialCode,
        assignedBy: user?.id,
        jobworkType: "CUTTING",
        quantities: [jobwork.quantity],
        jobworkNumber: jobwork.jobworkNumber,
        remarks: jobwork.remarks,
      };

      const res = await fetchJobworkPdf(payload);
      const url = URL.createObjectURL(res);

      setPdfUrl(url);
    } catch (e) {
      notify("Failed to load PDF preview", "error");
    }
  };

  /* ================= SUBMIT ================= */

  const submitJobworkForCutting = () => {
    const payload = {
      employeeName: jobwork.employee?.name,
      employeeId: jobwork.employee?.id,
      batchSerialCode: jobwork.serialCode,
      assignedBy: user?.id,
      jobworkType: "CUTTING",
      quantities: [jobwork.quantity],
      jobworkNumber: jobwork.jobworkNumber,
      remarks: jobwork.remarks,
    };

    setLoading(true);
    createJobwork(payload)
      .then(() => {
        setJobwork(INITIAL_JOBWORK);
        notify("Jobwork created", "success");
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

  /* ================= UI ================= */

  return (
    <Paper sx={{ p: 2, height: "100%" }} elevation={2}>
      <Typography fontWeight={600}>Assign Batch</Typography>
      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2}>
        <Grid size={12}>
          <Typography>Jobwork Number : {jobwork.jobworkNumber}</Typography>
        </Grid>

        <Grid size={4}>
          <Autocomplete
            fullWidth
            options={pendingBatches.map((b) => b.serialCode)}
            value={jobwork.serialCode}
            onChange={(_, value) =>
              setJobwork((p) => ({ ...p, serialCode: value || "" }))
            }
            renderInput={(params) => (
              <TextField {...params} label="Batch Serial Code" />
            )}
          />
        </Grid>

        <Grid size={4}>
          <Autocomplete
            fullWidth
            options={jobworkTypes}
            value={jobwork.jobworkType}
            onChange={(_, value) =>
              setJobwork((p) => ({ ...p, jobworkType: value || "" }))
            }
            renderInput={(params) => (
              <TextField {...params} label="Jobwork Type" />
            )}
          />
        </Grid>

        <Grid size={4}>
          <Autocomplete
            fullWidth
            options={employees}
            getOptionLabel={(e) => e.name}
            value={jobwork.employee}
            onChange={(_, value) =>
              setJobwork((p) => ({ ...p, employee: value }))
            }
            renderInput={(params) => <TextField {...params} label="Employee" />}
          />
        </Grid>

        {jobwork.jobworkType === "CUTTING" ? (
          <>
            <Grid size={12}>
              <CuttingForm
                maxQty={availableQty}
                jobwork={jobwork}
                setJobwork={setJobwork}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                label="Remarks"
                fullWidth
                multiline
                rows={3}
                value={jobwork.remarks}
                onChange={(e) =>
                  setJobwork((p) => ({ ...p, remarks: e.target.value }))
                }
              />
            </Grid>
          </>
        ) : jobwork.jobworkType && (
          <Grid size={12}>
            <ItemJobForm
              items={[{ id: 1, name: "apple" }]}
              jobwork={jobwork}
              setJobwork={setJobwork}
            />
          </Grid>
        )}

        <Grid size={12} display="flex" justifyContent="flex-end" gap={2}>
          <Button
            variant="contained"
            onClick={submitJobworkForCutting}
            disabled={
              loading ||
              !jobwork.quantity ||
              !jobwork.employee ||
              !jobwork.jobworkType ||
              !jobwork.serialCode
            }
          >
            Assign
          </Button>

          <Button
            variant="outlined"
            disabled={
              loading ||
              !jobwork.quantity ||
              !jobwork.employee ||
              !jobwork.jobworkType ||
              !jobwork.serialCode
            }
            onClick={openPreview}
          >
            Preview
          </Button>
        </Grid>
      </Grid>

      {/* ================= PDF PREVIEW ================= */}

      <Drawer
        anchor="right"
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        sx={{ top: 0, zIndex: (theme) => theme.zIndex.drawer + 1 }}
        PaperProps={{ sx: { width: 500 } }}
      >
        <Box sx={{ p: 1 }}>
          {pdfUrl && (
            <iframe
              src={pdfUrl}
              width="100%"
              height="100%"
              style={{ border: "none", minHeight: "90vh" }}
            />
            
          )}
      
        </Box>
      </Drawer>
    </Paper>
  );
}
