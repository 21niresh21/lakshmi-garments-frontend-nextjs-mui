import { formatToShortDateTime } from "@/app/utils/date";
import { Box, Chip, Grid, Typography } from "@mui/material";
import React from "react";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface Props {
  jobwork: any | null;
}

export default function JobworkSummary({ jobwork }: Props) {
  const totalQuantity = jobwork.jobworkItems.reduce(
    (sum: number, item: any) => sum + item.quantity,
    0
  );

  const column1 = [
    // { label: "Jobwork Number", value: jobwork.jobworkNumber },
    {
      label: "Jobwork Type",
      value: (
        <Chip
          icon={<ContentCutIcon />}
          label={jobwork.jobworkType}
          size="small"
        />
      ),
    },
    {
      label: "Jobwork Status",
      value: (
        <Chip
          icon={<CheckCircleIcon />}
          label={jobwork.jobworkStatus}
          size="small"
        />
      ),
    },
    { label: "Quantity", value: totalQuantity },
    {
      label: "Started At",
      value: formatToShortDateTime(jobwork.startedAt),
    },
  ];

  const column2 = [
    {
      label: "Origin",
      value: (
        <Chip
          icon={<BusinessIcon />}
          label={jobwork.jobworkOrigin}
          size="small"
        />
      ),
    },
    { label: "Batch", value: jobwork.batchSerialCode },
    {
      label: "Assigned To",
      value: (
        <Chip icon={<PersonIcon />} label={jobwork.assignedTo} size="small" />
      ),
    },
  ];

  return (
    <>
      <Typography variant="h5" mb={3} fontWeight={600}>
        {jobwork?.jobworkNumber}
      </Typography>
      <Grid container spacing={1}>
        {[column1, column2].map((col, idx) => (
          <Grid key={idx}>
            {col.map((row, i) => (
              <Box
                key={i}
                sx={{ display: "flex", alignItems: "center", mb: 1.5 }}
              >
                <Typography sx={{ minWidth: 140, fontWeight: 600 }}>
                  {row.label}
                </Typography>
                <Box sx={{ ml: 0.5 }}>: {row.value}</Box>
              </Box>
            ))}
          </Grid>
        ))}
      </Grid>
    </>
  );
}
