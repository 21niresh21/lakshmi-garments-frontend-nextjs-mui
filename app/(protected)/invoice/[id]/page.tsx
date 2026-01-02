"use client";

import { fetchInvoiceDetail } from "@/app/api/invoiceApi";
import {
  Box,
  Typography,
  TextField,
  Paper,
  Stack,
  Button,
} from "@mui/material";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import BaleTable from "./BaleTable";
import { updateLorryReeipt } from "@/app/api/lorryReceiptApi";
import { useNotification } from "@/app/components/shared/NotificationProvider";

type Invoice = any;

type LorryReceipt = {
  id: number;
  lrnumber: string;
  originalLRNumber?: string; // store original value
  baleDTOs: any[];
};

export default function InvoiceDetailsPage() {
  const { notify } = useNotification();
  const params = useParams();
  const id = params.id as string;

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [lorryReceipts, setLorryReceipts] = useState<LorryReceipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingLR, setSavingLR] = useState<number | null>(null);

  // Fetch invoice details
  useEffect(() => {
    if (!id) return;

    fetchInvoiceDetail(id)
      .then((res) => {
        const lrs: LorryReceipt[] =
          res.lorryReceiptDTOs?.map((lr: any) => ({
            ...lr,
            originalLRNumber: lr.lrnumber, // save original
          })) ?? [];
        setLorryReceipts(lrs);
        setInvoice(res);
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Update LR number in local state
  const handleLRChange = (lrId: number, value: string) => {
    setLorryReceipts((prev) =>
      prev.map((lr) => (lr.id === lrId ? { ...lr, lrnumber: value } : lr))
    );
  };

  // Update LR number on server
  const handleUpdateLR = async (lr: LorryReceipt) => {
    try {
      setSavingLR(lr.id);
      await updateLorryReeipt(lr.id, { lrNumber: lr.lrnumber });
      notify("LR number updated successfully", "success");

      // ✅ Update originalLRNumber so button disables until next change
      setLorryReceipts((prev) =>
        prev.map((r) =>
          r.id === lr.id ? { ...r, originalLRNumber: lr.lrnumber } : r
        )
      );
    } catch {
      notify("Error updating LR number", "error");
    } finally {
      setSavingLR(null);
    }
  };

  if (loading) return <div>Loading invoice...</div>;
  if (!invoice) return <div>Invoice not found</div>;

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
        Invoice Details
      </Typography>

      <Stack spacing={3}>
        {lorryReceipts.map((lr) => (
          <Paper key={lr.id} sx={{ p: 2 }} elevation={0}>
            {/* 🔹 LR Number Row */}
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <TextField
                label="LR Number"
                value={lr.lrnumber}
                onChange={(e) => handleLRChange(lr.id, e.target.value)}
                size="small"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleUpdateLR(lr); // trigger the same function as the button
                  }
                }}
                sx={{ width: 250 }} // narrower input
              />
              <Button
                variant="contained"
                size="small"
                onClick={() => handleUpdateLR(lr)}
                disabled={
                  savingLR === lr.id ||
                  !lr.lrnumber ||
                  lr.lrnumber === lr.originalLRNumber
                }
              >
                {savingLR === lr.id ? "Updating..." : "Update"}
              </Button>
            </Stack>

            {/* 🔹 Bale Table */}
            <BaleTable bales={lr.baleDTOs ?? []} />
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}
