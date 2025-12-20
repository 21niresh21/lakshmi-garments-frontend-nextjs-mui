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
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import { InvoiceDetails } from "../_types/invoiceDetails";
import { Supplier } from "../_types/supplier";
import { Transport } from "../_types/transport";
import { InvoiceErrors } from "./invoice.types";

interface Props {
  value: InvoiceDetails;
  errors: InvoiceErrors;
  onChange: (patch: Partial<InvoiceDetails>) => void;
  suppliers: Supplier[];
  transports: Transport[];
}

export default function InvoiceDetailsForm({
  value,
  errors,
  onChange,
  suppliers,
  transports,
}: Props) {
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
            <Autocomplete
              openOnFocus
              id="supplier-autocomplete"
              disablePortal
              autoHighlight
              options={suppliers}
              getOptionLabel={(option) => option.name}
              value={suppliers.find((s) => s.id === value.supplierID) || null}
              onChange={(_, selected) =>
                onChange({
                  supplierID: selected ? Number(selected.id) : undefined,
                })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  id="supplier-input"
                  label="Supplier"
                  error={!!errors.supplierID}
                  helperText={errors.supplierID}
                />
              )}
            />
          </Grid>

          {/* Transport */}
          <Grid size={4}>
            <Autocomplete
              id="transport-autocomplete"
              openOnFocus
              disablePortal
              autoHighlight
              options={transports}
              getOptionLabel={(option) => option.name}
              value={transports.find((t) => t.id === value.transportID) || null}
              onChange={(_, selected) =>
                onChange({
                  transportID: selected ? Number(selected.id) : undefined,
                })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  id="transport-input"
                  label="Transport"
                  error={!!errors.transportID}
                  helperText={errors.transportID}
                />
              )}
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
                  checked={value.istransportPaid}
                  onChange={(e) =>
                    onChange({ istransportPaid: e.target.checked })
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
