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

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Supplier } from "../../invoice/_types/supplier";
import { Transport } from "../../invoice/_types/transport";
import { BatchFilter } from "./_types/BatchFilter";
import { Category } from "@/app/_types/Category";
import { SubCategory } from "@/app/_types/SubCategory";
import { BATCH_STATUS_ARRAY } from "@/app/_types/BatchStatus";

interface Props {
  anchorEl: HTMLElement | null;
  open: boolean;
  filters: BatchFilter;
  categories: Category[];
  onChange: (filters: BatchFilter) => void;
  onApply: () => void;
  onReset: () => void;
  onClose: () => void;
}

export default function BatchFilterPanel({
  anchorEl,
  open,
  filters,
  categories,
  onChange,
  onApply,
  onReset,
  onClose,
}: Props) {
  const handleChange = <K extends keyof BatchFilter>(
    key: K,
    value: BatchFilter[K]
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
                options={categories.map((s) => s.name)}
                value={filters.categoryNames}
                onChange={(_, value) => handleChange("categoryNames", value)}
                renderInput={(params) => (
                  <TextField {...params} label="Categories" />
                )}
              />

              {/* Transport */}
              <Autocomplete
                multiple
                size="small"
                fullWidth
                options={BATCH_STATUS_ARRAY}
                value={filters.batchStatus}
                onChange={(_, value) => handleChange("batchStatus", value)}
                renderInput={(params) => (
                  <TextField {...params} label="Batch Status" />
                )}
              />

              {/* Payment Status */}
              {/* <Autocomplete
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
              /> */}

              {/* From Date */}
              <FormControl fullWidth>
                <DatePicker
                  label="From Date"
                  format="DD/MM/YYYY"
                  value={
                    filters.startDate
                      ? dayjs(filters.startDate, "DD-MM-YYYY", true)
                      : null
                  }
                  onAccept={(date) =>
                    handleChange(
                      "startDate",
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
                    filters.endDate
                      ? dayjs(filters.endDate, "DD-MM-YYYY", true)
                      : null
                  }
                  onAccept={(date) =>
                    handleChange(
                      "endDate",
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
