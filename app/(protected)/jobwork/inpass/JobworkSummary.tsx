import { formatToShortDateTime } from "@/app/utils/date";
import { Box, Chip, Grid, Stack, Typography } from "@mui/material";
import React from "react";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { JobworkTypeEnum } from "@/app/_types/JobworkTypeEnum";

interface Props {
  jobwork: any | null;
}

export default function JobworkSummary({ jobwork }: Props) {
  if (!jobwork) return null;

  const totalQuantity = jobwork.jobworkItems.reduce(
    (sum: number, item: any) => sum + item.quantity,
    0
  );

  const column1 = [
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

    ...(jobwork.jobworkType !== JobworkTypeEnum.CUTTING
      ? [
        {
          label: "Items",
          value: (
            <Stack
              direction="row"
              flexWrap="wrap"
              alignItems="flex-start"
            >
              {jobwork.jobworkItems.map((item: any) => (
                <Chip
                  key={item.id}
                  label={`${item.itemName} - ${item.quantity}`}
                  size="small"
                  sx={{m:'3px'}}
                />
              ))}
            </Stack>

          ),
        },
      ]
      : []),

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
    {
      label: "Remarks",
      value: jobwork.remarks || "-",
    },
  ];

  return (
    <>
      <Typography variant="h5" mb={3} fontWeight={600}>
        {jobwork.jobworkNumber}
      </Typography>

      <Grid container spacing={4}>
        {[column1, column2].map((col, idx) => (
          <Grid key={idx}>
            {col.map((row, i) => (
              <Box
                key={i}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "140px 10px 1fr",
                  alignItems: "start",
                  mb: 1.5,
                }}
              >
                <Typography fontWeight={600}>{row.label}</Typography>
                <Typography>:</Typography>
                <Box>{row.value}</Box>
              </Box>
            ))}
          </Grid>
        ))}
      </Grid>
    </>
  );
}
