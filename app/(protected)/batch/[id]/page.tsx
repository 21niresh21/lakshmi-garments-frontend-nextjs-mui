"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Container,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BatchTimeline from "./BatchTimeline";
import { fetchTimeline } from "@/app/api/batchApi";
import { BatchTimelineResponse } from "@/app/api/_types/BatchTimeline";
import { useNotification } from "@/app/components/shared/NotificationProvider";

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const { notify } = useNotification();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<BatchTimelineResponse | null>(null);

  const batchId = params.id as string;

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const res = await fetchTimeline(Number(batchId));
        setData(res);
      } catch (err: any) {
        notify("Error fetching batch timeline", "error");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [batchId, notify]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!data) {
    return (
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Typography variant="h6" color="text.secondary">
          Batch not found
        </Typography>
      </Container>
    );
  }

  return (
    <Box>
      <BatchTimeline batchTimeline={data} />
    </Box>
  );
}
