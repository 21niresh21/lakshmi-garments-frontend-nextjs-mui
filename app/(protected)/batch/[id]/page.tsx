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

export default function Page() {
  const params = useParams();
  const { notify } = useNotification();
  const id = params.id as string;

  const [batchTimeline, setBatchTimeline] = useState();

  useEffect(() => {
    if (id) {
      fetchTimeline(Number(id))
        .then((res) => {
          setBatchTimeline(res)
          console.log(res)
        })
        .catch((err) => {
          notify("An error occured", "error");
        });
    }
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link
          href="/batch/list"
          style={{
            textDecoration: "none",
            color: "inherit",
          }}
        >
          Batches
        </Link>

        <Typography color="text.primary">{id}</Typography>
      </Breadcrumbs>

      {/* Page Content */}
      <Typography variant="h6">Page ID: {id}</Typography>
      <BatchTimeline batchTimeline={batchTimeline} />
    </Box>
  );
}
