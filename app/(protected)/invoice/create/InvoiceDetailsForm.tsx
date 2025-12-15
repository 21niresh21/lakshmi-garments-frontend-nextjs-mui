"use client";

import {
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  MenuItem,
  FormControl,
  Box,
  Typography,
  Autocomplete,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { InvoiceDetails } from "../_types/invoiceDetails";
import { InvoiceErrors } from "./page";
import dayjs from "dayjs";
import { Supplier } from "../_types/supplier";
import { Transport } from "../_types/transport";

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
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Invoice Details
      </Typography>

      <Grid container spacing={2}>
        <Grid size={4}>
          <TextField
            fullWidth
            value={value.invoiceNumber}
            onChange={(e) => onChange({ invoiceNumber: e.target.value })}
            error={!!errors?.invoiceNumber}
            helperText={errors?.invoiceNumber}
            label="Invoice Number"
          />
        </Grid>
        <Grid size={4}>
          <FormControl fullWidth>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Invoice Date"
                format="DD/MM/YYYY"
                value={value.invoiceDate ? dayjs(value.invoiceDate) : null}
                onChange={(date) =>
                  onChange({
                    invoiceDate: date ? date.format("DD-MM-YYYY") : "",
                  })
                }
                slotProps={{
                  textField: {
                    helperText: errors.invoiceDate,
                    error: Boolean(errors.invoiceDate),
                    fullWidth: true,
                  },
                }}
                maxDate={dayjs()}
              />
            </LocalizationProvider>
          </FormControl>
        </Grid>
        <Grid size={4}>
          <FormControl fullWidth>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Recieved Date"
                format="DD/MM/YYYY"
                value={value.receivedDate ? dayjs(value.receivedDate) : null}
                onChange={(date) =>
                  onChange({
                    receivedDate: date ? date.format("DD-MM-YYYY") : "",
                  })
                }
                slotProps={{
                  textField: {
                    helperText: errors.receivedDate,
                    error: Boolean(errors.receivedDate),
                    fullWidth: true,
                  },
                }}
                maxDate={dayjs()}
              />
            </LocalizationProvider>
          </FormControl>
        </Grid>
        <Grid size={4}>
          <Autocomplete
            disablePortal
            autoHighlight
            options={suppliers}
            getOptionLabel={(option) => option.name}
            value={suppliers.find((s) => s.id === value.supplierID) || null}
            onChange={(_, selected) => {
              onChange({
                supplierID: selected ? Number(selected.id) : undefined,
              });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Supplier"
                error={!!errors?.supplierID}
                helperText={errors?.supplierID}
              />
            )}
          />
        </Grid>
        <Grid size={4}>
          <Autocomplete
            disablePortal
            autoHighlight
            options={transports}
            getOptionLabel={(option) => option.name}
            value={transports.find((s) => s.id === value.transportID) || null}
            onChange={(_, selected) => {
              onChange({
                transportID: selected ? Number(selected.id) : undefined,
              });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Transport"
                error={!!errors?.transportID}
                helperText={errors?.transportID}
              />
            )}
          />
        </Grid>
        <Grid size={4}>
            <TextField
              type="number"
              label="Transport Cost"
              onChange={(e) =>
                onChange({ transportCost: Number(e.target.value) })
              }
              error={!!errors?.transportCost}
              helperText={errors?.transportCost}
              fullWidth
            />
        </Grid>
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
  );
}
