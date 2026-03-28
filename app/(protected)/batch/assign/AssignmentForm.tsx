"use client";

import {
  Autocomplete,
  Box,
  Button,
  Divider,
  Drawer,
  Grid,
  IconButton,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { Employee } from "@/app/_types/Employee";
import { INITIAL_JOBWORK, JobworkForm } from "./_types/jobwork.types";
import CuttingForm from "./CuttingForm";
import { useUser } from "@/app/context/UserContext";
import { useNotification } from "@/app/components/shared/NotificationProvider";
import { createJobwork } from "@/app/api/jobworkApi";
import { fetchJobworkPdf } from "@/app/api/pdfApi";
import ItemJobForm from "./ItemJobForm";
import { fetchBatchItems } from "@/app/api/BatchItemApi";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import AddIcon from "@mui/icons-material/Add";
import EmployeeFormModal, {
  EmployeeFormData,
} from "@/app/components/shared/EmployeeFormModal";
import SkillFormModal, {
  SkillFormData,
} from "@/app/components/shared/SkillFormModal";
import { createEmployee } from "@/app/api/employeeApi";
import { addSkill } from "@/app/api/skillApi";

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
  refreshEmployees: () => void;
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
  refreshEmployees,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const [batchItems, setBatchItems] = useState();

  // Modal states for quick add
  const [openEmployeeModal, setOpenEmployeeModal] = useState(false);
  const [openSkillModal, setOpenSkillModal] = useState(false);
  const [employeeErrors, setEmployeeErrors] = useState<{ name?: string; skills?: string }>({});
  const [skillErrors, setSkillErrors] = useState<{ name?: string }>({});
  const [skillRefreshKey, setSkillRefreshKey] = useState(0);

  const { user } = useUser();
  const { notify } = useNotification();

  /* ================= QUICK ADD HANDLERS ================= */

  const handleEmployeeSubmit = useCallback(
    async (data: EmployeeFormData) => {
      try {
        await createEmployee(data);
        notify("Employee created successfully", "success");
        setOpenEmployeeModal(false);
        setEmployeeErrors({});
        refreshEmployees(); // Refresh employee list immediately
      } catch (err: any) {
        if (err.validationErrors) {
          setEmployeeErrors(err.validationErrors);
        } else {
          notify(err.message || "Failed to create employee", "error");
        }
      }
    },
    [notify, refreshEmployees]
  );

  const handleSkillSubmit = useCallback(
    async (data: SkillFormData) => {
      try {
        await addSkill(data);
        notify("Skill created successfully", "success");
        setOpenSkillModal(false);
        setSkillErrors({});
        setSkillRefreshKey((prev) => prev + 1); // Increment to trigger skill refresh in EmployeeFormModal
      } catch (err: any) {
        if (err.validationErrors) {
          setSkillErrors(err.validationErrors);
        } else {
          notify(err.message || "Failed to create skill", "error");
        }
      }
    },
    [notify]
  );

  console.log(user);

  /* ================= VALIDATION ================= */

  const isFormValid = (): boolean => {
    // Basic required fields
    if (!jobwork.assignedTo || !jobwork.batchSerialCode || !jobwork.jobworkType) {
      return false;
    }

    // CUTTING validation
    if (jobwork.jobworkType === "CUTTING") {
      return (
        jobwork.quantity !== undefined &&
        jobwork.quantity !== null &&
        jobwork.quantity > 0 &&
        !isNaN(jobwork.quantity)
      );
    }

    // Item-based jobwork validation
    if (jobwork.items.length === 0) {
      return false; // Must have at least one item row
    }

    // Check all rows are completely filled with valid data
    return jobwork.items.every((row) => {
      // Each row must have an item selected
      if (!row.item || !row.item.id) {
        return false;
      }

      // Each row must have a valid positive quantity
      if (
        row.quantity === undefined ||
        row.quantity === null ||
        row.quantity <= 0 ||
        isNaN(row.quantity)
      ) {
        return false;
      }

      return true;
    });
  };

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
    <Box sx={{ p: { xs: 2, md: 0 } }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography fontWeight={600} variant="h6">
          Assign Batch
        </Typography>
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Add Employee">
            <IconButton
              size="small"
              onClick={() => setOpenEmployeeModal(true)}
              color="primary"
            >
              <PersonAddAlt1Icon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Add Skill">
            <IconButton
              size="small"
              onClick={() => setOpenSkillModal(true)}
              color="primary"
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
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
            rows={3}
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
            disabled={loading || !isFormValid()}
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
            disabled={loading || !isFormValid()}
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

      {/* Employee Quick Add Modal */}
      <EmployeeFormModal
        open={openEmployeeModal}
        mode="create"
        errors={employeeErrors}
        setErrors={setEmployeeErrors}
        onClose={() => {
          setOpenEmployeeModal(false);
          setEmployeeErrors({});
        }}
        onSubmit={handleEmployeeSubmit}
        skillRefreshKey={skillRefreshKey}
      />

      {/* Skill Quick Add Modal */}
      <SkillFormModal
        open={openSkillModal}
        mode="create"
        errors={skillErrors}
        setErrors={setSkillErrors}
        onClose={() => {
          setOpenSkillModal(false);
          setSkillErrors({});
        }}
        onSubmit={handleSkillSubmit}
      />
    </Box>
  );
}
