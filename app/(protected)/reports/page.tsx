"use client";

import { generateMaterialLedgerExcel } from "@/app/api/exportExcel";
import { useNotification } from "@/app/components/shared/NotificationProvider";
import { Box, Button, Typography } from "@mui/material";
import { saveAs } from "file-saver";
import React from "react";

export default function page() {
  const { notify } = useNotification();
  const handleMaterialLedgerDownload = () => {
    const epoch = Date.now(); // current epoch in milliseconds

    generateMaterialLedgerExcel()
      .then((blob) => {
        saveAs(blob, `Material_Ledger_${epoch}.xlsx`);
      })
      .catch(() => {
        notify("Error generating file", "error");
      });
  };

  return (
    <Box>
      <Typography variant="h5">Materials Ledger</Typography>
      <Button variant="contained" onClick={handleMaterialLedgerDownload}>
        Download
      </Button>
    </Box>
  );
}
