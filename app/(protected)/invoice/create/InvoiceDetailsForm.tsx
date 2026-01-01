"use client";

import {
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  FormControl,
  Box,
  Typography,
  Autocomplete,
  createFilterOptions,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import { InvoiceDetails } from "../_types/invoiceDetails";
import { Supplier } from "../_types/supplier";
import { Transport } from "../_types/transport";
import { InvoiceErrors } from "./invoice.types";
import { GenericAutocomplete } from "@/app/components/shared/GenericAutocomplete";
import { useState } from "react";
import SupplierFormModal, {
  SupplierFormData,
} from "@/app/components/shared/SupplierFormModal";
import { addSupplier } from "@/app/api/supplier";
import { useNotification } from "@/app/components/shared/NotificationProvider";
import TransportFormModal, {
  TransportFormData,
} from "@/app/components/shared/TransportFormModal";
import { addTransport } from "@/app/api/transport";

interface Props {
  value: InvoiceDetails;
  errors: InvoiceErrors;
  onChange: (patch: Partial<InvoiceDetails>) => void;
  suppliers: Supplier[];
  transports: Transport[];
  setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>;
  setTransports: React.Dispatch<React.SetStateAction<Transport[]>>;
}

export default function InvoiceDetailsForm({
  value,
  errors,
  onChange,
  suppliers,
  setSuppliers,
  transports,
  setTransports,
}: Props) {
  const { notify } = useNotification();
  type CreateEntityType = "supplier" | "transport" | null;

  const [createDialog, setCreateDialog] = useState<{
    type: CreateEntityType;
    prefillName: string;
  }>({
    type: null,
    prefillName: "",
  });

  const createSupplier = async (data: SupplierFormData) => {
    try {
      const createdSupplier = await addSupplier(data);
      setCreateDialog({ type: null, prefillName: "" });
      setSuppliers((prev) => [...prev, createdSupplier]);
      onChange({ supplierID: createdSupplier.id });
      notify("Supplier created successfully", "success");
    } catch (err: any) {
      notify(err?.response?.data ?? "Error saving supplier", "error");
    }
  };

  const createTransport = async (data: TransportFormData) => {
    try {
      const createdTransport = await addTransport(data);
      console.log("created t", createdTransport);

      setCreateDialog({ type: null, prefillName: "" });
      setTransports((prev) => [...prev, createdTransport]);
      onChange({ transportID: createdTransport.id });
      notify("Transport created successfully", "success");
    } catch (err: any) {
      console.log(err);

      notify(err?.response?.data ?? "Error saving transport", "error");
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Invoice Details
        </Typography>

        <Grid container spacing={2}>
          {/* Invoice Number */}
          <Grid size={4}>
            <TextField
              id="invoice-number"
              fullWidth
              label="Invoice Number"
              value={value.invoiceNumber}
              onChange={(e) => onChange({ invoiceNumber: e.target.value })}
              error={!!errors.invoiceNumber}
              helperText={errors.invoiceNumber}
            />
          </Grid>

          {/* Invoice Date */}
          <Grid size={4}>
            <FormControl fullWidth>
              <DatePicker
                label="Invoice Date"
                format="DD/MM/YYYY"
                value={
                  value.invoiceDate
                    ? dayjs(value.invoiceDate, "DD-MM-YYYY", true)
                    : null
                }
                onAccept={(date) =>
                  onChange({
                    invoiceDate: date ? date.format("DD-MM-YYYY") : "",
                  })
                }
                maxDate={dayjs()}
                slotProps={{
                  textField: {
                    id: "invoice-date",
                    fullWidth: true,
                    error: Boolean(errors.invoiceDate),
                    helperText: errors.invoiceDate,
                  },
                }}
              />
            </FormControl>
          </Grid>

          {/* Received Date */}
          <Grid size={4}>
            <FormControl fullWidth>
              <DatePicker
                label="Received Date"
                format="DD/MM/YYYY"
                value={
                  value.receivedDate
                    ? dayjs(value.receivedDate, "DD-MM-YYYY", true)
                    : null
                }
                onAccept={(date) =>
                  onChange({
                    receivedDate: date ? date.format("DD-MM-YYYY") : "",
                  })
                }
                maxDate={dayjs()}
                slotProps={{
                  textField: {
                    id: "received-date",
                    fullWidth: true,
                    error: Boolean(errors.receivedDate),
                    helperText: errors.receivedDate,
                  },
                }}
              />
            </FormControl>
          </Grid>

          {/* Supplier */}
          <Grid size={4}>
            <GenericAutocomplete<Supplier>
              label="Supplier"
              options={suppliers}
              value={suppliers.find((s) => s.id === value.supplierID) || null}
              onChange={(supplier) => onChange({ supplierID: supplier?.id })}
              allowCreate
              getOptionLabel={(s) => s.name}
              isOptionEqualToValue={(a, b) => a.id === b.id}
              onCreateClick={(name) => {
                setCreateDialog({
                  type: "supplier",
                  prefillName: name,
                });
              }}
              error={errors.supplierID}
            />
            <SupplierFormModal
              open={createDialog.type === "supplier"}
              mode="create"
              onSubmit={createSupplier}
              onClose={() => setCreateDialog({ type: null, prefillName: "" })}
              initialData={{ name: createDialog.prefillName, location: "" }}
            />
          </Grid>

          {/* Transport */}
          <Grid size={4}>
            <GenericAutocomplete<Transport>
              label="Transport"
              options={transports}
              value={transports.find((t) => t.id === value.transportID) || null}
              onChange={(transport) => onChange({ transportID: transport?.id })}
              allowCreate
              getOptionLabel={(t) => t.name}
              isOptionEqualToValue={(a, b) => a.id === b.id}
              onCreateClick={(name) => {
                setCreateDialog({
                  type: "transport",
                  prefillName: name,
                });
              }}
              error={errors.transportID}
            />
            <TransportFormModal
              open={createDialog.type === "transport"}
              mode="create"
              onSubmit={createTransport}
              onClose={() => setCreateDialog({ type: null, prefillName: "" })}
              initialData={{ name: createDialog.prefillName }}
            />
          </Grid>

          {/* Transport Cost */}
          <Grid size={4}>
            <TextField
              id="transport-cost"
              type="number"
              label="Transport Cost"
              fullWidth
              value={value.transportCost ?? ""}
              onChange={(e) => {
                const raw = e.target.value;
                onChange({
                  transportCost: raw === "" ? undefined : Number(raw),
                });
              }}
              error={!!errors.transportCost}
              helperText={errors.transportCost}
            />
          </Grid>

          {/* Transport Paid */}
          <Grid>
            <FormControlLabel
              control={
                <Switch
                  checked={value.isTransportPaid}
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
