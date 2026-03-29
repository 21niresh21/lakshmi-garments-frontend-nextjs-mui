"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Divider,
} from "@mui/material";
import { JobworkItemRowData } from "./_types/jobwork";
import { DamageType } from "@/app/_types/DamageType";
import { DamageSourceLabels } from "@/app/_types/DamageSource";

interface InpassConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  rows: JobworkItemRowData[];
  jobwork: any;
  mode: "submit" | "raise-request";
}

const toNumber = (v: number | "") => (v === "" ? 0 : v);

export default function InpassConfirmationDialog({
  open,
  onClose,
  onConfirm,
  rows,
  jobwork,
  mode,
}: InpassConfirmationDialogProps) {
  const isSubmit = mode === "submit";

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" scroll="paper">
      <DialogTitle sx={{ fontWeight: 600 }}>
        {isSubmit ? "Confirm Receipt Submission" : "Confirm Workflow Request"}
      </DialogTitle>

      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" mb={2}>
          {isSubmit
            ? "Please review the entered quantities before submitting the jobwork receipt."
            : "Please review the details before raising a workflow request for quantity mismatch."}
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Jobwork Details
          </Typography>
          <Box sx={{ display: "flex", gap: 3 }}>
            <Typography variant="body2">
              <b>Number:</b> {jobwork?.jobworkNumber}
            </Typography>
            <Typography variant="body2">
              <b>Type:</b> {jobwork?.jobworkType}
            </Typography>
            <Typography variant="body2">
              <b>Batch:</b> {jobwork?.batchSerialCode}
            </Typography>
          </Box>
        </Box>

        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead sx={{ bgcolor: "grey.100" }}>
              <TableRow>
                <TableCell><b>Item Name</b></TableCell>
                <TableCell align="right"><b>Accepted</b></TableCell>
                <TableCell align="right"><b>Sales Qty</b></TableCell>
                <TableCell align="right"><b>Supplier Damage</b></TableCell>
                <TableCell align="center" colSpan={2}><b>Repairable</b></TableCell>
                <TableCell align="right"><b>Unrepairable</b></TableCell>
                <TableCell align="right"><b>Total</b></TableCell>
              </TableRow>
              <TableRow>
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell align="right"><Typography variant="caption">Qty</Typography></TableCell>
                <TableCell align="right"><Typography variant="caption">Source</Typography></TableCell>
                <TableCell />
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => {
                const supplierDamage = row.damages.find(d => d.type === DamageType.SUPPLIER_DAMAGE);
                const repairable = row.damages.find(d => d.type === DamageType.REPAIRABLE);
                const unrepairable = row.damages.find(d => d.type === DamageType.UNREPAIRABLE);
                const damageTotal = toNumber(supplierDamage?.quantity || 0) + toNumber(repairable?.quantity || 0) + toNumber(unrepairable?.quantity || 0);
                const total = toNumber(row.acceptedQuantity) + toNumber(row.salesQuantity) + damageTotal;

                return (
                  <TableRow key={row.id}>
                    <TableCell>{row.itemName}</TableCell>
                    <TableCell align="right">{row.acceptedQuantity || 0}</TableCell>
                    <TableCell align="right">{row.salesQuantity || 0}</TableCell>
                    <TableCell align="right" sx={{ color: toNumber(supplierDamage?.quantity || 0) > 0 ? "error.main" : "inherit" }}>
                        {toNumber(supplierDamage?.quantity || 0)}
                    </TableCell>
                    <TableCell align="right" sx={{ color: toNumber(repairable?.quantity || 0) > 0 ? "warning.main" : "inherit" }}>
                        {toNumber(repairable?.quantity || 0)}
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="caption" color="text.secondary">
                        {repairable?.source ? DamageSourceLabels[repairable.source as keyof typeof DamageSourceLabels] : "-"}
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ color: toNumber(unrepairable?.quantity || 0) > 0 ? "error.dark" : "inherit" }}>
                        {toNumber(unrepairable?.quantity || 0)}
                    </TableCell>
                    <TableCell align="right"><b>{total}</b></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {!isSubmit && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="warning.main" fontWeight={500}>
              Note: This action will create a workflow request for administrative approval due to quantity mismatch.
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={isSubmit ? "success" : "primary"}
        >
          {isSubmit ? "Confirm & Submit" : "Raise Request"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
