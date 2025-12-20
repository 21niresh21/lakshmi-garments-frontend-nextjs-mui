import { Box, Typography } from "@mui/material";
import React from "react";

interface Props {
  jobwork: any | null;
}

export default function JobworkSummary({ jobwork }: Props) {
  return (
    <>
      <Typography variant="h6" mb={1}>
        {jobwork?.jobworkNumber}
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Choose items returned by employee
      </Typography>
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          pr: 1,
        }}
      ></Box>
    </>
  );
}
