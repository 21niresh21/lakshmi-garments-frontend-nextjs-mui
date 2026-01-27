"use client";

import { WorkflowRequestDetails } from "@/app/_types/WorkflowRequest";
import {
  fetchWorkflowRequest,
  updateWorkflowRequests,
} from "@/app/api/workflowRequestApi";
import { useGlobalLoading } from "@/app/components/layout/LoadingProvider";
import { useNotification } from "@/app/components/shared/NotificationProvider";
import {
  Typography,
  Box,
  Divider,
  Grid,
  Paper,
  Stack,
  Chip,
  Container,
  Button,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { createJobworkReceipt } from "@/app/api/jobworkReceipt";
import { WorkflowRequestStatus } from "@/app/_types/WorkflowRequestStatus";

export default function Page() {
  const { loading, showLoading, hideLoading } = useGlobalLoading();
  const { notify } = useNotification();
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [workflowRequest, setWorkflowRequest] =
    useState<WorkflowRequestDetails | null>(null);

  useEffect(() => {
    showLoading();
    fetchWorkflowRequest(id)
      .then(setWorkflowRequest)
      .catch(() => notify("Error loading workflow request", "error"))
      .finally(() => hideLoading());
  }, [id, notify]);

  const handleSubmitRequest = async () => {
    if (!workflowRequest || !workflowRequest.payload) return;

    const { payload } = workflowRequest;

    // Re-structuring the payload to match your required format
    const approvalPayload = {
      jobworkNumber: payload.jobworkNumber,
      jobworkReceiptItems: payload.items, // mapping 'items' to 'jobworkReceiptItems'
    };

    showLoading();
    try {
      // 1. First, create the actual receipt records in the database
      await createJobworkReceipt(approvalPayload);

      await updateWorkflowRequests(id, {
        requestStatus: WorkflowRequestStatus.APPROVED,
      });

      notify("Jobwork accepted and approved!", "success");

      // Redirect to the list after success
      router.push("/workflow/requests");
    } catch (err) {
      notify("An error occurred during processing", "error");
      console.error(err);
    } finally {
      hideLoading();
    }
  };

  if (!workflowRequest) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <Typography>Loading request details...</Typography>
      </Box>
    );
  }

  const {
    requestType,
    requestStatus,
    requestedBy,
    requestedAt,
    systemComments,
    payload,
  } = workflowRequest;

  return (
    <Container maxWidth="md" sx={{ py: 3, pb: 12 }}>
      {/* pb: 12 ensures content isn't hidden by the fixed button */}
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Request Details
      </Typography>
      {/* 🔹 Header Info */}
      <Paper
        elevation={3}
        sx={{ p: 3, mb: 4, border: "1px solid", borderColor: "divider" }}
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              REQUEST TYPE
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {requestType?.replace(/_/g, " ")}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              STATUS
            </Typography>
            <Typography component="div" sx={{ mt: 0.5 }}>
              <Chip
                size="small"
                label={requestStatus}
                color={requestStatus === "PENDING" ? "warning" : "success"}
                sx={{ fontWeight: 600 }}
              />
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              JOBWORK NUMBER
            </Typography>
            <Typography variant="body1" fontWeight={700} color="primary">
              {payload?.jobworkNumber || "N/A"}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              REQUESTED BY
            </Typography>
            <Typography variant="body1">{requestedBy}</Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              DATE & TIME
            </Typography>
            <Typography variant="body1">
              {new Date(requestedAt).toLocaleString()}
            </Typography>
          </Grid>

          {systemComments && (
            <Grid size={12}>
              <Divider sx={{ my: 1 }} />
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                SYSTEM COMMENTS
              </Typography>
              <Typography variant="body2">{systemComments}</Typography>
            </Grid>
          )}
        </Grid>
      </Paper>
      {/* 🔹 Payload Items */}
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Items Received
      </Typography>
      <Stack spacing={2} component={Paper} elevation={3}>
        {payload?.items && Array.isArray(payload.items) ? (
          payload.items.map((item: any, index: number) => (
            <Paper
              key={item.id || index}
              variant="outlined"
              sx={{ p: 2, bgcolor: "background.paper" }}
            >
              <Typography variant="subtitle1" fontWeight={700} color="primary">
                {index + 1}. {item.itemName}
              </Typography>

              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    ACCEPTED QTY
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {item.acceptedQuantity}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    WAGE / ITEM
                  </Typography>
                  <Typography variant="body1">₹{item.wagePerItem}</Typography>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    SALES QTY
                  </Typography>
                  <Typography variant="body1">{item.salesQuantity}</Typography>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    SALES PRICE
                  </Typography>
                  <Typography variant="body1">₹{item.salesPrice}</Typography>
                </Grid>
              </Grid>

              {/* Damages Sub-section */}
              {item.damages &&
                item.damages.some((d: any) => d.quantity > 0) && (
                  <Box
                    sx={{
                      mt: 2,
                      pt: 2,
                      borderTop: "1px dashed",
                      borderColor: "divider",
                    }}
                  >
                    <Typography
                      variant="caption"
                      fontWeight={700}
                      color="error"
                      sx={{ mb: 1, display: "block" }}
                    >
                      DAMAGES REPORTED
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={1}
                      flexWrap="wrap"
                      useFlexGap
                    >
                      {item.damages.map(
                        (dmg: any, i: number) =>
                          dmg.quantity > 0 && (
                            <Chip
                              key={i}
                              label={`${dmg.type.replace(/_/g, " ")}: ${
                                dmg.quantity
                              }`}
                              size="small"
                              variant="outlined"
                              color="error"
                            />
                          ),
                      )}
                    </Stack>
                  </Box>
                )}
            </Paper>
          ))
        ) : (
          <Paper sx={{ p: 4, textAlign: "center", bgcolor: "grey.50" }}>
            <Typography color="text.secondary">
              No items found in this request.
            </Typography>
          </Paper>
        )}
      </Stack>
      {/* 🔹 Fixed Bottom Right Approve Button */}
      {requestStatus === "PENDING" && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
          <Button
            variant="contained"
            color="success"
            onClick={handleSubmitRequest}
          >
            Approve Request
          </Button>
        </Box>
      )}
    </Container>
  );
}
