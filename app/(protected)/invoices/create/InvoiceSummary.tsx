"use client";

import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Divider,
  Button,
  Box,
  alpha,
  useTheme,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import DraftsIcon from "@mui/icons-material/Drafts";
import DeleteIcon from "@mui/icons-material/Delete";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { LRDetails } from "../_types/LRDetails";
import { InvoiceDetails } from "../_types/invoiceDetails";

interface Props {
  invoice: InvoiceDetails;
  lr: LRDetails;
  loading: boolean;
  onSubmit: () => void;
  onSaveDraft: () => void;
  onClear: () => void;
}

export default function InvoiceSummary({
  invoice,
  lr,
  loading,
  onSubmit,
  onSaveDraft,
  onClear,
}: Props) {
  const theme = useTheme();

  const stats = useMemo(() => {
    let totalBales = 0;
    let totalQty = 0;
    let totalLength = 0;
    let estimatedAmount = 0;

    lr.lorryReceipts.forEach((receipt) => {
      totalBales += receipt.bales.length;
      receipt.bales.forEach((bale) => {
        totalQty += Number(bale.quantity || 0);
        totalLength += Number(bale.length || 0);
        estimatedAmount += Number(bale.price || 0) * Number(bale.quantity || 0);
      });
    });

    return { totalBales, totalQty, totalLength, estimatedAmount };
  }, [lr]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Box sx={{ position: "sticky", top: 100 }}>
      <Card
        elevation={0}
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 3,
          overflow: "hidden",
          background: (theme) =>
            theme.palette.mode === "dark"
              ? alpha(theme.palette.background.paper, 0.6)
              : alpha(theme.palette.background.paper, 0.8),
          backdropFilter: "blur(10px)",
        }}
      >
        <Box
          sx={{
            py: 2,
            px: 3,
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <ReceiptIcon color="primary" />
          <Typography variant="h6" fontWeight={700} color="primary.main">
            Invoice Summary
          </Typography>
        </Box>

        <CardContent sx={{ p: 3 }}>
          <Stack spacing={2.5}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography color="text.secondary" variant="body2">
                Total LRs
              </Typography>
              <Typography fontWeight={700}>
                {lr.lorryReceipts.length}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography color="text.secondary" variant="body2">
                Total Bales
              </Typography>
              <Typography fontWeight={700}>{stats.totalBales}</Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography color="text.secondary" variant="body2">
                Total Quantity
              </Typography>
              <Typography fontWeight={700}>
                {stats.totalQty.toLocaleString()}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography color="text.secondary" variant="body2">
                Total Length
              </Typography>
              <Typography fontWeight={700}>
                {stats.totalLength.toLocaleString()}
              </Typography>
            </Box>

            <Divider sx={{ borderStyle: "dashed" }} />

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography fontWeight={700} color="text.primary">
                Est. Total Amount
              </Typography>
              <Typography variant="h6" fontWeight={800} color="primary.main">
                {formatCurrency(stats.estimatedAmount)}
              </Typography>
            </Box>

            <Stack spacing={1.5} mt={1}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<SaveIcon />}
                onClick={onSubmit}
                loading={loading}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.25)}`,
                }}
              >
                Submit Invoice
              </Button>

              <Stack direction="row" spacing={1.5}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<DraftsIcon />}
                  onClick={onSaveDraft}
                  disabled={loading}
                  sx={{ borderRadius: 2 }}
                >
                  Save Draft
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={onClear}
                  disabled={loading}
                  sx={{ borderRadius: 2 }}
                >
                  Clear
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
      
      <Typography 
        variant="caption" 
        sx={{ 
          display: "block", 
          textAlign: "center", 
          mt: 2, 
          color: "text.secondary",
          px: 2 
        }}
      >
        Save draft to continue later 
      </Typography>
    </Box>
  );
}
