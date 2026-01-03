"use client";

import {
  Popper,
  Paper,
  Typography,
  Divider,
  Stack,
  Button,
  TextField,
  ClickAwayListener,
  Autocomplete,
  FormControl,
} from "@mui/material";
import { Supplier } from "../_types/supplier";
import { Transport } from "../_types/transport";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export interface InvoiceFilterType {
  supplierNames: string[];
  transportNames: string[];
  isPaid: boolean[];
  invoiceStartDate: string;
  invoiceEndDate: string;
}

interface Props {
  anchorEl: HTMLElement | null;
  open: boolean;
  filters: InvoiceFilterType;
  suppliers: Supplier[];
  transports: Transport[];
  onChange: (filters: InvoiceFilterType) => void;
  onApply: () => void;
  onReset: () => void;
  onClose: () => void;
}

export default function InvoiceFilter({
  anchorEl,
  open,
  filters,
  suppliers,
  transports,
  onChange,
  onApply,
  onReset,
  onClose,
}: Props) {
  const handleChange = <K extends keyof InvoiceFilterType>(
    key: K,
    value: InvoiceFilterType[K]
  ) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Popper
        open={open}
        anchorEl={anchorEl}
        placement="bottom-end"
        sx={{ zIndex: 1300 }}
      >
        <ClickAwayListener onClickAway={onClose}>
          <Paper sx={{ p: 2, width: 280 }}>
            <Typography fontWeight={600}>Filters</Typography>
            <Divider sx={{ my: 1 }} />

            <Stack spacing={2}>
              {/* Supplier */}
              <Autocomplete
                multiple
                size="small"
                fullWidth
                options={suppliers.map((s) => s.name)}
                value={filters.supplierNames}
                onChange={(_, value) => handleChange("supplierNames", value)}
                renderInput={(params) => (
                  <TextField {...params} label="Suppliers" />
                )}
              />

              {/* Transport */}
              <Autocomplete
                multiple
                size="small"
                fullWidth
                options={transports.map((t) => t.name)}
                value={filters.transportNames}
                onChange={(_, value) => handleChange("transportNames", value)}
                renderInput={(params) => (
                  <TextField {...params} label="Transports" />
                )}
              />

              {/* Payment Status */}
              <Autocomplete
                multiple
                size="small"
                fullWidth
                options={[true, false]}
                value={Array.isArray(filters.isPaid) ? filters.isPaid : []}
                onChange={(_, value) => handleChange("isPaid", value)}
                getOptionLabel={(option) => (option ? "Paid" : "Unpaid")}
                renderInput={(params) => (
                  <TextField {...params} label="Transport Payment Status" />
                )}
              />

              {/* From Date */}
              <FormControl fullWidth>
                <DatePicker
                  label="From Date"
                  format="DD/MM/YYYY"
                  value={
                    filters.invoiceStartDate
                      ? dayjs(filters.invoiceStartDate, "DD-MM-YYYY", true)
                      : null
                  }
                  onAccept={(date) =>
                    handleChange(
                      "invoiceStartDate",
                      date ? date.format("DD-MM-YYYY") : ""
                    )
                  }
                  maxDate={dayjs()}
                  slotProps={{
                    textField: {
                      size: "small",
                      fullWidth: true,
                    },
                  }}
                />
              </FormControl>

              {/* To Date */}
              <FormControl fullWidth>
                <DatePicker
                  label="To Date"
                  format="DD/MM/YYYY"
                  value={
                    filters.invoiceEndDate
                      ? dayjs(filters.invoiceEndDate, "DD-MM-YYYY", true)
                      : null
                  }
                  onAccept={(date) =>
                    handleChange(
                      "invoiceEndDate",
                      date ? date.format("DD-MM-YYYY") : ""
                    )
                  }
                  maxDate={dayjs()}
                  slotProps={{
                    textField: {
                      size: "small",
                      fullWidth: true,
                    },
                  }}
                />
              </FormControl>

              {/* Actions */}
              <Stack direction="row" spacing={1} justifyContent="flex-end">
                <Button size="small" onClick={onReset}>
                  Reset
                </Button>
                <Button size="small" variant="contained" onClick={onApply}>
                  Apply
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </LocalizationProvider>
  );
}
