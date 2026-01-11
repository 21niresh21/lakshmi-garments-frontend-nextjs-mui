"use client";

import { WorkflowRequestDetails } from "@/app/_types/WorkflowRequest";
import { fetchJobworkDetail } from "@/app/api/jobworkApi";
import { fetchWorkflowRequest } from "@/app/api/workflowRequestApi";
import { useNotification } from "@/app/components/shared/NotificationProvider";
import {
  Typography,
  Box,
  Divider,
  Grid,
  Paper,
  Stack,
  Chip,
} from "@mui/material";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Page() {
  const { notify } = useNotification();
  const params = useParams();
  const id = Number(params.id);

  const [workflowRequest, setWorkflowRequest] =
    useState<WorkflowRequestDetails | null>(null);

  useEffect(() => {
    fetchWorkflowRequest(id)
      .then(setWorkflowRequest)
      .catch(() => notify("Error loading workflow request", "error"));
  }, [id]);

  // useEffect(()=> {
  //   fetchJobworkDetail()
  // })

  if (!workflowRequest) {
    return <Typography>Loading...</Typography>;
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
    <Box>
      <Typography variant="h5" gutterBottom>
        Request Details
      </Typography>

      {/* 🔹 Header Info */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack spacing={1}>
          <Typography>
            <b>Request Type:</b> {requestType}
          </Typography>
          <Typography>
            <b>Status:</b>{" "}
            <Chip
              size="small"
              label={requestStatus}
              color={requestStatus === "PENDING" ? "warning" : "success"}
            />
          </Typography>
          <Typography>
            <b>Requested By:</b> {requestedBy}
          </Typography>
          <Typography>
            <b>Requested At:</b> {new Date(requestedAt).toLocaleString()}
          </Typography>
          {systemComments && (
            <Typography>
              <b>Comments:</b> {systemComments}
            </Typography>
          )}
        </Stack>
      </Paper>

      {/* 🔹 Payload Items */}
      <Typography variant="h6" gutterBottom>
        Items
      </Typography>

      <Stack spacing={2}>
        {payload ? payload[0].map((item, index) => (
          <Paper key={item.id} sx={{ p: 2 }}>
            <Typography variant="subtitle1" fontWeight={600}>
              {index + 1}. {item.itemName}
            </Typography>

            <Divider sx={{ my: 1 }} />

            <Grid container spacing={2}>
              <Grid size={6}>
                <Typography>Wage: ₹{item.wage}</Typography>
                <Typography>Purchased Qty: {item.purchasedQuantity}</Typography>
                <Typography>Purchase Cost: ₹{item.purchaseCost}</Typography>
              </Grid>

              <Grid size={6}>
                <Typography>Returned Qty: {item.returnedQuantity}</Typography>
              </Grid>
            </Grid>

            {/* 🔹 Damages */}
            <Divider sx={{ my: 1 }} />
            <Typography fontWeight={500}>Damages</Typography>

            <Stack direction="row" spacing={1} mt={1}>
              {item.damages.map((dmg, i) => (
                <Chip
                  key={i}
                  label={`${dmg.type}: ${dmg.quantity}`}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Stack>
          </Paper>
        )) : []}
      </Stack>
    </Box>
  );
}
