"use client";

import Link from "next/link";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import BatchTimeline from "./BatchTimeline";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchTimeline } from "@/app/api/batchApi";
import { useNotification } from "@/app/components/shared/NotificationProvider";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useGlobalLoading } from "@/app/components/layout/LoadingProvider";

export default function Page() {
  const params = useParams();
  const { loading, showLoading, hideLoading } = useGlobalLoading();
  const { notify } = useNotification();
  const id = params.id as string;

  const [batchTimeline, setBatchTimeline] = useState<any>();

  useEffect(() => {
    if (id) {
      showLoading();
      fetchTimeline(Number(id))
        .then((res) => {
          setBatchTimeline(res);
          console.log(res);
        })
        .catch((err) => {
          notify("An error occured", "error");
        })
        .finally(() => {
          hideLoading();
        });
    }
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link
          href="/batch/list"
          style={{
            textDecoration: "none",
            color: "inherit",
            display: "flex",
            alignItems: "center",
            columnGap: 5,
          }}
        >
          <ArrowBackIcon fontSize="small" />
          Batches
        </Link>

        <Typography color="#0009" variant="body2">
          {batchTimeline?.batchDetails?.serialCode}
        </Typography>
      </Breadcrumbs>

      {/* Page Content */}
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, ml: 2.5 }}>
        Batch Timeline {batchTimeline?.batchDetails?.serialCode}
      </Typography>
      <BatchTimeline batchTimeline={batchTimeline} />
    </Box>
  );
}
