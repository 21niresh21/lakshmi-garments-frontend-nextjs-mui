"use client";

import Link from "next/link";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import BatchTimeline from "./BatchTimeline";

export default function Page() {
  const id = 1;

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
      <BatchTimeline/>
    </Box>
  );
}
