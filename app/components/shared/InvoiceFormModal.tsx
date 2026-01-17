"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  FormControlLabel,
  Switch,
  Autocomplete,
  FormControl,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useCallback, useMemo } from "react";
import { InvoiceDetails } from "@/app/(protected)/invoice/_types/invoiceDetails";
import { Supplier } from "@/app/(protected)/invoice/_types/supplier";
import { Transport } from "@/app/(protected)/invoice/_types/transport";
import { InvoiceErrors } from "@/app/(protected)/invoice/create/invoice.types";
import { LoadingButton } from "@mui/lab";

type InvoiceFormModalProps = {
  open: boolean;
  mode: "create" | "edit";
  initialData: InvoiceDetails;
  loading?: boolean;
  onChange: (patch: Partial<InvoiceDetails>) => void;
  onClose: () => void;
  onSubmit: (data: InvoiceDetails) => void;
  suppliers: Supplier[];
  transports: Transport[];
  errors: InvoiceErrors;
};

export default function InvoiceFormModal({
  open,
  mode,
  initialData,
  loading = false,
  onClose,
  onSubmit,
  suppliers,
  transports,
  errors,
  onChange,
}: InvoiceFormModalProps) {
  /* ---------------- Memoized Values ---------------- */

  const supplierOptions = useMemo(
    () => suppliers.map((s) => s.name),
    [suppliers]
  );

  const transportOptions = useMemo(
    () => transports.map((t) => t.name),
    [transports]
  );

  /* ---------------- Handlers ---------------- */

  const handleTextChange = useCallback(
    (field: keyof InvoiceDetails) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ [field]: e.target.value });
      },
    [onChange]
  );

  const handleNumberChange = useCallback(
    (field: keyof InvoiceDetails) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        onChange({
          [field]: raw === "" ? undefined : Number(raw),
        });
      },
    [onChange]
  );

  const handleDateChange = useCallback(
    (field: keyof InvoiceDetails) => (date: dayjs.Dayjs | null) => {
      onChange({
        [field]: date ? date.format("DD-MM-YYYY") : "",
      });
    },
    [onChange]
  );

  const handleSubmit = useCallback(() => {
    onSubmit(initialData);
  }, [onSubmit, initialData]);

  /* ---------------- Render ---------------- */

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle mb={2}>
          {mode === "create" ? "Add Invoice" : "Edit Invoice"}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Invoice Number"
              value={initialData.invoiceNumber}
              onChange={handleTextChange("invoiceNumber")}
              fullWidth
              required
              error={!!errors.invoiceNumber}
              helperText={errors.invoiceNumber}
              autoFocus
            />

            <FormControl fullWidth>
              <DatePicker
                label="Invoice Date"
                format="DD/MM/YYYY"
                value={
                  initialData.invoiceDate
                    ? dayjs(initialData.invoiceDate, "DD-MM-YYYY", true)
                    : null
                }
                onChange={handleDateChange("invoiceDate")}
                maxDate={dayjs()}
                slotProps={{
                  textField: {
                    id: "invoice-date",
                    error: !!errors.invoiceDate,
                    helperText: errors.invoiceDate,
                  },
                }}
              />
            </FormControl>

            <FormControl fullWidth>
              <DatePicker
                label="Received Date"
                format="DD/MM/YYYY"
                value={
                  initialData.receivedDate
                    ? dayjs(initialData.receivedDate, "DD-MM-YYYY", true)
                    : null
                }
                onChange={handleDateChange("receivedDate")}
                maxDate={dayjs()}
                slotProps={{
                  textField: {
                    id: "received-date",
                    error: !!errors.receivedDate,
                    helperText: errors.receivedDate,
                  },
                }}
              />
            </FormControl>

            <Autocomplete
              openOnFocus
              autoHighlight
              options={supplierOptions}
              value={initialData.supplierName || null}
              onChange={(_, value) => onChange({ supplierName: value ?? "" })}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Supplier"
                  error={!!errors.supplierName}
                  helperText={errors.supplierName}
                />
              )}
            />

            <Autocomplete
              openOnFocus
              autoHighlight
              options={transportOptions}
              value={initialData.transportName || null}
              onChange={(_, value) => onChange({ transportName: value ?? "" })}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Transport"
                  error={!!errors.transportName}
                  helperText={errors.transportName}
                />
              )}
            />

            <TextField
              label="Transport Cost"
              type="number"
              value={initialData.transportCost ?? ""}
              onChange={handleNumberChange("transportCost")}
              fullWidth
              error={!!errors.transportCost}
              helperText={errors.transportCost}
            />

            <FormControlLabel
              control={
                <Switch
                  disabled={(initialData.transportCost ?? 0) <= 0}
                  checked={initialData.isTransportPaid}
                  onChange={(e) =>
                    onChange({ isTransportPaid: e.target.checked })
                  }
                />
              }
              label="Transport Paid"
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>

          <LoadingButton
            variant="contained"
            onClick={handleSubmit}
            loading={loading}
          >
            {mode === "create" ? "Create" : "Save"}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
