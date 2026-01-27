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

import {
  DatePicker,
  DateTimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Supplier } from "../../invoices/_types/supplier";
import { Transport } from "../../invoices/_types/transport";
import { Category } from "@/app/_types/Category";
import { SubCategory } from "@/app/_types/SubCategory";
import { BATCH_STATUS_ARRAY } from "@/app/_types/BatchStatus";
import { JobworkFilter } from "./_types/JobworkFilter";
import { JOBWORK_TYPE_ARRAY } from "@/app/_types/JobworkTypeEnum";
import { Employee } from "@/app/_types/Employee";
import { JOBWORK_STATUS_ARRAY } from "@/app/_types/JobworkStatus";

interface Props {
  anchorEl: HTMLElement | null;
  open: boolean;
  filters: JobworkFilter;
  employees: Employee[];
  batchSerialCodes: string[];
  onChange: (filters: JobworkFilter) => void;
  onApply: () => void;
  onReset: () => void;
  onClose: () => void;
}

export default function JobworkFilterPanel({
  anchorEl,
  open,
  filters,
  employees,
  batchSerialCodes,
  onChange,
  onApply,
  onReset,
  onClose,
}: Props) {
  const handleChange = <K extends keyof JobworkFilter>(
    key: K,
    value: JobworkFilter[K],
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
              {/* Transport */}

              <Autocomplete
                multiple
                size="small"
                fullWidth
                options={batchSerialCodes}
                value={filters.batchSerialCode}
                onChange={(_, value) => handleChange("batchSerialCode", value)}
                renderInput={(params) => (
                  <TextField {...params} label="Batch Serial code" />
                )}
              />

              <Autocomplete
                multiple
                size="small"
                fullWidth
                options={JOBWORK_TYPE_ARRAY}
                value={filters.jobworkType}
                onChange={(_, value) => handleChange("jobworkType", value)}
                renderInput={(params) => (
                  <TextField {...params} label="Jobwork Type" />
                )}
              />

              <Autocomplete
                multiple
                size="small"
                fullWidth
                options={JOBWORK_STATUS_ARRAY}
                value={filters.jobworkStatus}
                onChange={(_, value) => handleChange("jobworkStatus", value)}
                renderInput={(params) => (
                  <TextField {...params} label="Jobwork Status" />
                )}
              />

              <Autocomplete
                multiple
                size="small"
                fullWidth
                options={employees.map((s) => s.name)}
                value={filters.assignedToName || []}
                onChange={(_, value) => handleChange("assignedToName", value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Assigned To"
                    placeholder="Select Employees"
                  />
                )}
              />

              {/* <Autocomplete
                multiple
                size="small"
                fullWidth
                options={[true, false]}
                value={Array.isArray(filters.isUrgent) ? filters.isUrgent : []}
                onChange={(_, value) => handleChange("isUrgent", value)}
                getOptionLabel={(option) => (option ? "High" : "Normal")}
                renderInput={(params) => (
                  <TextField {...params} label="Batch Priority" />
                )}
              /> */}
              {/* From Date Time */}
              <FormControl fullWidth>
                <DateTimePicker
                  label="From Creation Time"
                  format="DD/MM/YYYY hh:mm A" // Display format for user
                  value={filters.startDate ? dayjs(filters.startDate) : null}
                  onChange={(date) =>
                    handleChange(
                      "startDate",
                      date && date.isValid()
                        ? date.format("YYYY-MM-DDTHH:mm:ss")
                        : "",
                    )
                  }
                  maxDateTime={dayjs()}
                  slotProps={{ textField: { size: "small", fullWidth: true } }}
                />
              </FormControl>

              {/* To Date Time */}
              <FormControl fullWidth>
                <DateTimePicker
                  label="To Creation Time"
                  format="DD/MM/YYYY hh:mm A"
                  value={filters.endDate ? dayjs(filters.endDate) : null}
                  onChange={(date) =>
                    handleChange(
                      "endDate",
                      date && date.isValid()
                        ? date.format("YYYY-MM-DDTHH:mm:ss")
                        : "",
                    )
                  }
                  maxDateTime={dayjs()}
                  slotProps={{ textField: { size: "small", fullWidth: true } }}
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
