"use client";

import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  FormControl,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { InvoiceDetails } from "../_types/invoiceDetails";
import { Supplier } from "../_types/supplier";
import { Transport } from "../_types/transport";
import { InvoiceErrors } from "./invoice.types";

import { GenericAutocomplete } from "@/app/components/shared/GenericAutocomplete";
import SupplierFormModal, {
  SupplierFormData,
} from "@/app/components/shared/SupplierFormModal";
import TransportFormModal, {
  TransportFormData,
} from "@/app/components/shared/TransportFormModal";

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
}: Props) {
  const { notify } = useNotification();

  const [createDialog, setCreateDialog] = useState<{
    type: CreateEntityType;
    prefillName: string;
  }>({ type: null, prefillName: "" });

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

  // ✅ Auto-toggle paid when cost is zero
  useEffect(() => {
    if (isTransportCostZero && !value.isTransportPaid) {
      onChange({ isTransportPaid: true });
    }
  }, [isTransportCostZero, onChange, value.isTransportPaid]);

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
        closeDialog();
      } catch (err: any) {
        notify(err?.response?.data ?? "Failed to create supplier", "error");
      }
    },
    [closeDialog, notify, onChange, setSuppliers]
  );

  const createTransport = useCallback(
    async (data: TransportFormData) => {
      try {
        const transport = await addTransport(data);
        setTransports((p) => [...p, transport]);
        onChange({ transportID: transport.id });
        notify("Transport created successfully", "success");
        closeDialog();
      } catch (err: any) {
        notify(err?.response?.data ?? "Failed to create transport", "error");
      }
    },
    [closeDialog, notify, onChange, setTransports]
  );

  /* ---------- Render ---------- */

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <Typography variant="h5" mb={2} fontWeight={600}>
          Invoice Details
        </Typography>

        <Grid container spacing={2}>
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
              onClose={closeDialog}
              initialData={{ name: createDialog.prefillName, location: "" }}
            />
          </Grid>

          {/* Transport */}
          <Grid size={{ xs: 12, md: 4 }}>
            <GenericAutocomplete<Transport>
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
              onClose={closeDialog}
              initialData={{ name: createDialog.prefillName }}
            />
          </Grid>

          {/* Transport Cost */}
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              type="number"
              label="Transport Cost"
              placeholder="Enter Transport Cost"
              fullWidth
              value={value.transportCost ?? ""}
              onChange={(e) => {
                const raw = e.target.value;
                onChange({
                  transportCost:
                    raw === "" ? undefined : Number(sanitizeNumberInput(raw)),
                });
              }}
              error={!!errors.transportCost}
              helperText={errors.transportCost}
            />
          </Grid>

          {/* Transport Paid */}
          <Grid size={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={value.isTransportPaid}
                  disabled={isTransportCostZero}
                  onChange={(e) =>
                    onChange({ isTransportPaid: e.target.checked })
                  }
                />
              }
              label="Transport Paid"
            />
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
}

export default memo(InvoiceDetailsForm);
