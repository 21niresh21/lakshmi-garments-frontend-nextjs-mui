"use client";

import { fetchInvoiceDetail } from "@/app/api/invoiceApi";
import { updateLorryReeipt } from "@/app/api/lorryReceiptApi";
import { useNotification } from "@/app/components/shared/NotificationProvider";
import BaleTable from "./BaleTable";

import {
  Box,
  Typography,
  TextField,
  Paper,
  Stack,
  Button,
  Breadcrumbs,
} from "@mui/material";
import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useGlobalLoading } from "@/app/components/layout/LoadingProvider";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

type Invoice = any;

type LorryReceipt = {
  id: number;
  lrnumber: string;
  originalLRNumber?: string;
  baleDTOs: any[];
};

export default function InvoiceDetailsPage() {
  const { loading, showLoading, hideLoading } = useGlobalLoading();
  const { notify } = useNotification();
  const params = useParams();
  const id = params.id as string;

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [lorryReceipts, setLorryReceipts] = useState<LorryReceipt[]>([]);
  const [savingLR, setSavingLR] = useState<number | null>(null);
  const [canEdit, setCanEdit] = useState(false);

  /* ---------------- Fetch Invoice ---------------- */

  useEffect(() => {
    if (!id) return;

    showLoading();

    fetchInvoiceDetail(id)
      .then((res) => {
        const lrs: LorryReceipt[] =
          res.lorryReceiptDTOs?.map((lr: any) => ({
            ...lr,
            originalLRNumber: lr.lrnumber,
          })) ?? [];

        setInvoice(res);
        setLorryReceipts(lrs);
        setCanEdit(res.canEdit);
      })
      .catch(() => {
        notify("Failed to load invoice", "error");
      })
      .finally(() => hideLoading());
  }, [id, notify]);

  /* ---------------- Derived Helpers ---------------- */

  const isSelfLR = (lr: LorryReceipt) => lr.lrnumber?.startsWith("SELF");

  const isLRChanged = (lr: LorryReceipt) =>
    lr.lrnumber?.trim() && lr.lrnumber.trim() !== lr.originalLRNumber;

  /* ---------------- Handlers ---------------- */

  const handleLRChange = useCallback((lrId: number, value: string) => {
    setLorryReceipts((prev) =>
      prev.map((lr) => (lr.id === lrId ? { ...lr, lrnumber: value } : lr))
    );
  }, []);

  const handleLRBlur = useCallback((lrId: number, value: string) => {
    const trimmed = value.trim();

    if (trimmed !== value) {
      setLorryReceipts((prev) =>
        prev.map((lr) => (lr.id === lrId ? { ...lr, lrnumber: trimmed } : lr))
      );
    }
  }, []);

  const handleUpdateLR = useCallback(
    async (lr: LorryReceipt) => {
      if (!isLRChanged(lr)) return;

      try {
        setSavingLR(lr.id);
        await updateLorryReeipt(lr.id, { lrNumber: lr.lrnumber.trim() });

        notify("LR number updated successfully", "success");

        setLorryReceipts((prev) =>
          prev.map((r) =>
            r.id === lr.id ? { ...r, originalLRNumber: lr.lrnumber.trim() } : r
          )
        );
      } catch {
        notify("Error updating LR number", "error");
      } finally {
        setSavingLR(null);
      }
    },
    [notify]
  );

  /* ---------------- Render ---------------- */

  if (loading) return <div>Loading invoice...</div>;
  if (!invoice) return <div>Invoice not found</div>;

  return (
    <Box>

      <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, ml: 2.5 }}>
        Invoice # {invoice.invoiceNumber}
      </Typography>

      <Stack spacing={3}>
        {lorryReceipts.map((lr) => (
          <Box key={lr.id} sx={{ p: 2 }}>
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
                size="small"
                sx={{ width: 250 }}
                disabled={isSelfLR(lr) || !canEdit}
                onChange={(e) => handleLRChange(lr.id, e.target.value)}
                onBlur={(e) => handleLRBlur(lr.id, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleUpdateLR(lr);
                  }
                }}
              />

              {!isSelfLR(lr) && canEdit && (
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleUpdateLR(lr)}
                  disabled={savingLR === lr.id || !isLRChanged(lr)}
                >
                  {savingLR === lr.id ? "Updating..." : "Update"}
                </Button>
              )}
            </Stack>

            {/* 🔹 Bale Table */}
            <BaleTable canEdit={canEdit} bales={lr.baleDTOs ?? []} />
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
