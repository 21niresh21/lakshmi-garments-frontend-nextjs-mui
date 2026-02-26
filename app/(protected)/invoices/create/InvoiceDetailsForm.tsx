"use client";

import React, { memo, useCallback, useEffect, useMemo, useState, useRef } from "react";
import {
  Box,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

import { InvoiceDetails } from "../_types/invoiceDetails";
import { Supplier } from "../_types/supplier";
import { Transport } from "../_types/transport";
import { InvoiceErrors } from "./invoice.types";

import { GenericAutocomplete } from "@/app/components/shared/GenericAutocomplete";
import SupplierFormModal, {
  SupplierFormData,
} from "@/app/components/shared/SupplierFormModal";
import { SupplierErrors } from "../../supplier/page";
import TransportFormModal, {
  TransportFormData,
} from "@/app/components/shared/TransportFormModal";
import { TransportErrors } from "../../transport/page";

import { addSupplier } from "@/app/api/supplier";
import { addTransport } from "@/app/api/transport";
import { sanitizeNumberInput } from "@/app/utils/number";
import { useNotification } from "@/app/components/shared/NotificationProvider";
import {
  parseDate,
  formatDate,
  today,
  DATE_DISPLAY_FORMAT,
} from "@/app/utils/date";

/* ---------------- Types ---------------- */

interface Props {
  value: InvoiceDetails;
  errors: InvoiceErrors;
  onChange: (patch: Partial<InvoiceDetails>) => void;
  suppliers: Supplier[];
  transports: Transport[];
  setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>;
  setTransports: React.Dispatch<React.SetStateAction<Transport[]>>;
  isTransportCostDisabled?: boolean; // New prop to control disabled state
}

type CreateEntityType = "supplier" | "transport" | null;

/* ---------------- Component ---------------- */

function InvoiceDetailsForm({
  value,
  errors,
  onChange,
  suppliers,
  transports,
  setSuppliers,
  setTransports,
  isTransportCostDisabled = false,
}: Props) {
  const theme = useTheme();
  const { notify } = useNotification();

  const [createDialog, setCreateDialog] = useState<{
    type: CreateEntityType;
    prefillName: string;
  }>({ type: null, prefillName: "" });
  const [supplierErrors, setSupplierErrors] = useState<SupplierErrors>({});
  const [transportErrors, setTransportErrors] = useState<TransportErrors>({});

  /* ---------- Memoized lookups ---------- */

  const selectedSupplier = useMemo(
    () => suppliers.find((s) => s.id === value.supplierID) ?? null,
    [suppliers, value.supplierID]
  );

  const selectedTransport = useMemo(
    () => transports.find((t) => t.id === value.transportID) ?? null,
    [transports, value.transportID]
  );

  /* ---------- Transport cost side effects ---------- */

  const isTransportCostZero = !value.transportCost || value.transportCost <= 0;

  //✅ Auto-toggle paid when cost is zero (but not when transport type is transport with undefined cost)
  useEffect(() => {
    // Only auto-toggle if cost is explicitly zero or negative, not when it's undefined
    // This prevents overriding the explicit "false" state when switching to transport
    if (isTransportCostZero && value.transportCost !== undefined && !value.isTransportPaid) {
      onChange({ isTransportPaid: true });
    }
  }, [isTransportCostZero, onChange, value.isTransportPaid, value.transportCost]);

  /* ---------- Create handlers ---------- */

  const supplierAutocompleteRef = useRef<any>(null);
  const transportAutocompleteRef = useRef<any>(null);

  /* ---------- Create handlers ---------- */

  const closeDialog = useCallback(
    () => setCreateDialog({ type: null, prefillName: "" }),
    []
  );

  const createSupplier = useCallback(
    async (data: SupplierFormData) => {
      try {
        const supplier = await addSupplier(data);
        setSuppliers((p) => [...p, supplier]);
        onChange({ supplierID: supplier.id });
        notify("Supplier created successfully", "success");
        setCreateDialog({ type: null, prefillName: "" });
        setSupplierErrors({});
        // Restore focus to allow tabbing
        setTimeout(() => supplierAutocompleteRef.current?.focus(), 100);
      } catch (err: any) {
        if (err.validationErrors) {
          setSupplierErrors(err.validationErrors);
        } else if (err.message && err.message !== "Validation failed") {
          notify(err?.message || "Failed to create supplier", "error");
        }
      }
    },
    [notify, onChange, setSuppliers]
  );

  const createTransport = useCallback(
    async (data: TransportFormData) => {
      try {
        const transport = await addTransport(data);
        setTransports((p) => [...p, transport]);
        onChange({ transportID: transport.id });
        notify("Transport created successfully", "success");
        setCreateDialog({ type: null, prefillName: "" });
        setTransportErrors({});
        // Restore focus to allow tabbing
        setTimeout(() => transportAutocompleteRef.current?.focus(), 100);
      } catch (err: any) {
        if (err.validationErrors) {
          setTransportErrors(err.validationErrors);
        } else if (err.message && err.message !== "Validation failed") {
          notify(err?.message || "Failed to create transport", "error");
        }
      }
    },
    [notify, onChange, setTransports]
  );

  /* ---------- Render ---------- */

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card
        elevation={0}
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            py: 2,
            px: 3,
            bgcolor: alpha(theme.palette.primary.main, 0.04),
            borderBottom: `1px solid ${theme.palette.divider}`,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <ReceiptLongIcon color="primary" />
          <Typography variant="h6" fontWeight={700}>
            Invoice Information
          </Typography>
        </Box>

        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Invoice Number */}
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                required
                label="Invoice Number"
                placeholder="Enter Invoice Number"
                value={value.invoiceNumber}
                onChange={(e) => onChange({ invoiceNumber: e.target.value })}
                onBlur={(e) => onChange({ invoiceNumber: e.target.value.trim() })}
                error={!!errors.invoiceNumber}
                helperText={errors.invoiceNumber}
              />
            </Grid>

            {/* Invoice Date */}
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth>
                <DatePicker
                  label="Invoice Date"
                  format={DATE_DISPLAY_FORMAT}
                  value={parseDate(value.invoiceDate)}
                  maxDate={today()}
                  onAccept={(d) => onChange({ invoiceDate: formatDate(d) })}
                  slotProps={{
                    textField: {
                      required: true,
                      error: !!errors.invoiceDate,
                      helperText: errors.invoiceDate,
                    },
                  }}
                />
              </FormControl>
            </Grid>

            {/* Received Date */}
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth>
                <DatePicker
                  label="Received Date"
                  format={DATE_DISPLAY_FORMAT}
                  value={parseDate(value.receivedDate)}
                  minDate={parseDate(value.invoiceDate) ?? undefined}
                  maxDate={today()}
                  onAccept={(d) => onChange({ receivedDate: formatDate(d) })}
                  slotProps={{
                    textField: {
                      required: true,
                      error: !!errors.receivedDate,
                      helperText: errors.receivedDate,
                    },
                  }}
                />
              </FormControl>
            </Grid>

            {/* Supplier */}
            <Grid size={{ xs: 12, md: 4 }}>
              <GenericAutocomplete<Supplier>
                ref={supplierAutocompleteRef}
                label="Supplier"
                placeholder="Select Supplier"
                options={suppliers}
                value={selectedSupplier}
                onChange={(s) => onChange({ supplierID: s?.id })}
                allowCreate
                getOptionLabel={(s) => s.name}
                isOptionEqualToValue={(a, b) => a.id === b.id}
                onCreateClick={(name) =>
                  setCreateDialog({ type: "supplier", prefillName: name })
                }
                error={errors.supplierID}
              />
              <SupplierFormModal
                open={createDialog.type === "supplier"}
                mode="create"
                onSubmit={createSupplier}
                onClose={() => {
                  setCreateDialog({ type: null, prefillName: "" });
                  setSupplierErrors({});
                  setTimeout(() => supplierAutocompleteRef.current?.focus(), 100);
                }}
                initialData={{ name: createDialog.prefillName, location: "" }}
                errors={supplierErrors}
                setErrors={setSupplierErrors}
              />
            </Grid>

            {/* Transport */}
            <Grid size={{ xs: 12, md: 4 }}>
              <GenericAutocomplete<Transport>
                ref={transportAutocompleteRef}
                label="Transport"
                placeholder="Select Transport"
                options={transports}
                value={selectedTransport}
                onChange={(t) => onChange({ transportID: t?.id })}
                allowCreate
                getOptionLabel={(t) => t.name}
                isOptionEqualToValue={(a, b) => a.id === b.id}
                onCreateClick={(name) =>
                  setCreateDialog({ type: "transport", prefillName: name })
                }
                error={errors.transportID}
              />
              <TransportFormModal
                open={createDialog.type === "transport"}
                mode="create"
                onSubmit={createTransport}
                onClose={() => {
                  setCreateDialog({ type: null, prefillName: "" });
                  setTransportErrors({});
                  setTimeout(() => transportAutocompleteRef.current?.focus(), 100);
                }}
                initialData={{ name: createDialog.prefillName }}
                errors={transportErrors}
                setErrors={setTransportErrors}
              />
            </Grid>

            {/* Transport Cost */}
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Transport Cost"
                placeholder="Enter Transport Cost"
                fullWidth
                disabled={isTransportCostDisabled}
                value={value.transportCost ?? ""}
                onChange={(e) => {
                  let val = e.target.value;
                  const regex = /^[0-9]*\.?[0-9]*$/;
                  if (regex.test(val) || val === "") {
                    // Prevent leading zeros unless followed by a decimal
                    if (val.length > 1 && val.startsWith("0") && val[1] !== ".") {
                      val = val.replace(/^0+/, "");
                      if (val === "") val = "0";
                    }
                    onChange({
                      transportCost: val === "" ? undefined : (val as any),
                    });
                  }
                }}
                inputProps={{ inputMode: "decimal" }}
                error={!!errors.transportCost}
                helperText={errors.transportCost}
              />
            </Grid>

            {/* Transport Paid */}
            <Grid size={12}>
              <Box
                sx={{
                  // p: 2,
                  // borderRadius: 2,
                  // bgcolor: (theme) => alpha(theme.palette.action.hover, 0.4),
                  display: "inline-flex",
                }}
              >
                <FormControlLabel
                  sx={{ mr: 0 }}
                  control={
                    <Switch
                      checked={value.isTransportPaid}
                      disabled={isTransportCostZero || isTransportCostDisabled}
                      onChange={(e) =>
                        onChange({ isTransportPaid: e.target.checked })
                      }
                    />
                  }
                  label={
                    <Typography variant="body2" fontWeight={600}>
                      Transport Charges Paid
                    </Typography>
                  }
                />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}

export default memo(InvoiceDetailsForm);
