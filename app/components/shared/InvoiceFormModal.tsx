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
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LoadingButton } from "@mui/lab";
import dayjs, { Dayjs } from "dayjs";
import { useCallback, useMemo, useRef } from "react";

import { InvoiceDetails } from "@/app/(protected)/invoices/_types/invoiceDetails";
import { Supplier } from "@/app/(protected)/invoices/_types/supplier";
import { Transport } from "@/app/(protected)/invoices/_types/transport";
import { InvoiceErrors } from "@/app/(protected)/invoices/create/invoice.types";
import { sanitizeNumberInput } from "@/app/utils/number";

type Props = {
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
}: Props) {
  const nameRef = useRef<HTMLInputElement>(null);
  /* ---------------- Memoized Data ---------------- */

  const supplierOptions = useMemo(
    () => suppliers.map((s) => s.name),
    [suppliers]
  );

  const transportOptions = useMemo(
    () => transports.map((t) => t.name),
    [transports]
  );

  const invoiceDate = useMemo<Dayjs | null>(
    () =>
      initialData.invoiceDate
        ? dayjs(initialData.invoiceDate, "DD-MM-YYYY")
        : null,
    [initialData.invoiceDate]
  );

  const receivedDate = useMemo<Dayjs | null>(
    () =>
      initialData.receivedDate
        ? dayjs(initialData.receivedDate, "DD-MM-YYYY")
        : null,
    [initialData.receivedDate]
  );

  /* ---------------- Handlers ---------------- */

  const handleTextChange = useCallback(
    (field: "invoiceNumber") => (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange({ [field]: e.target.value }),
    [onChange]
  );

  const handleNumberChange = useCallback(
    (field: "transportCost") => (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      const regex = /^[0-9]*\.?[0-9]*$/;
      
      if (regex.test(value) || value === "") {
        // Prevent leading zeros unless followed by a decimal
        if (value.length > 1 && value.startsWith("0") && value[1] !== ".") {
          value = value.replace(/^0+/, "");
          if (value === "") value = "0";
        }
        onChange({
          [field]: value === "" ? undefined : (value as any),
        });
      }
    },
    [onChange]
  );

  const handleDateChange = useCallback(
    (field: "invoiceDate" | "receivedDate") => (date: Dayjs | null) =>
      onChange({
        [field]: date ? date.format("DD-MM-YYYY") : "",
      }),
    [onChange]
  );

  const handleSupplierChange = useCallback(
    (_: unknown, value: string | null) =>
      onChange({ supplierName: value ?? "" }),
    [onChange]
  );

  const handleTransportChange = useCallback(
    (_: unknown, value: string | null) =>
      onChange({ transportName: value ?? "" }),
    [onChange]
  );

  const handleTransportPaidChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange({ isTransportPaid: e.target.checked }),
    [onChange]
  );

  const handleSubmit = useCallback(() => {
    onSubmit(initialData);
  }, [initialData, onSubmit]);

  const handleTrimOnBlur = useCallback(
    (field: keyof InvoiceDetails) =>
      (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const trimmed = e.target.value.trim();

        if (trimmed !== e.target.value) {
          onChange({ [field]: trimmed });
        }
      },
    [onChange]
  );

  /* ---------------- Derived State ---------------- */

  const isTransportPaidDisabled = (initialData.transportCost ?? 0) <= 0;

  /* ---------------- Render ---------------- */

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="sm"
        aria-labelledby="invoice-form-title"
        TransitionProps={{
          onEntered: () => {
            nameRef.current?.focus();
          },
        }}
      >
        <DialogTitle id="invoice-form-title">
          {mode === "create" ? "Add Invoice" : "Edit Invoice"}
        </DialogTitle>

        <DialogContent dividers>
          <Stack spacing={2} mt={1}>
            <TextField
              inputRef={nameRef}
              label="Invoice Number"
              value={initialData.invoiceNumber}
              onChange={handleTextChange("invoiceNumber")}
              onBlur={handleTrimOnBlur("invoiceNumber")}
              required
              error={!!errors.invoiceNumber}
              helperText={errors.invoiceNumber}
              fullWidth
            />

            <DatePicker
              label="Invoice Date"
              value={invoiceDate}
              onChange={handleDateChange("invoiceDate")}
              maxDate={dayjs()}
              format="DD/MM/YYYY"
              slotProps={{
                textField: {
                  required: true,
                  error: !!errors.invoiceDate,
                  helperText: errors.invoiceDate,
                },
              }}
            />

            <DatePicker
              label="Received Date"
              value={receivedDate}
              onChange={handleDateChange("receivedDate")}
              maxDate={dayjs()}
              format="DD/MM/YYYY"
              slotProps={{
                textField: {
                  error: !!errors.receivedDate,
                  helperText: errors.receivedDate,
                },
              }}
            />

            <Autocomplete
              options={supplierOptions}
              value={initialData.supplierName || null}
              onChange={handleSupplierChange}
              isOptionEqualToValue={(a, b) => a === b}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Supplier"
                  required
                  error={!!errors.supplierName}
                  helperText={errors.supplierName}
                />
              )}
            />

            <Autocomplete
              options={transportOptions}
              value={initialData.transportName || null}
              onChange={handleTransportChange}
              isOptionEqualToValue={(a, b) => a === b}
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
              value={initialData.transportCost ?? ""}
              onChange={handleNumberChange("transportCost")}
              error={!!errors.transportCost}
              helperText={errors.transportCost}
              inputProps={{ inputMode: "decimal" }}
              fullWidth
            />

            <FormControlLabel
              label="Transport Paid"
              control={
                <Switch
                  checked={initialData.isTransportPaid}
                  onChange={handleTransportPaidChange}
                  disabled={isTransportPaidDisabled}
                />
              }
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
            disabled={loading}
          >
            {mode === "create" ? "Create" : "Save"}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
