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
import { WorkflowRequestStatus } from "@/app/_types/WorkflowRequestStatus";
import { WorkflowRequestType } from "@/app/_types/WorkflowRequestType";

export interface WorkflowFilterType {
  requestedByNames: string[];
  requestTypes: string[];
  statuses: string[];
  startDate: string;
  endDate: string;
}

interface Props {
  anchorEl: HTMLElement | null;
  open: boolean;
  filters: WorkflowFilterType;
  usernames: string[];
  onChange: (filters: WorkflowFilterType) => void;
  onApply: () => void;
  onReset: () => void;
  onClose: () => void;
  showRequestedByFilter: boolean;
}

export default function WorkflowFilter({
  anchorEl,
  open,
  filters,
  usernames,
  onChange,
  onApply,
  onReset,
  onClose,
  showRequestedByFilter,
}: Props) {
  const handleChange = <K extends keyof WorkflowFilterType>(
    key: K,
    value: WorkflowFilterType[K]
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
          <Paper sx={{ p: 2, width: 300 }}>
            <Typography fontWeight={600}>Filters</Typography>
            <Divider sx={{ my: 1 }} />

            <Stack spacing={2}>
              {/* Requested By */}
              {showRequestedByFilter && (
                <Autocomplete
                  multiple
                  size="small"
                  fullWidth
                  options={usernames}
                  value={filters.requestedByNames}
                  onChange={(_, value) => handleChange("requestedByNames", value)}
                  renderInput={(params) => (
                    <TextField {...params} label="Requested By" />
                  )}
                />
              )}

              {/* Request Type */}
              <Autocomplete
                multiple
                size="small"
                fullWidth
                options={Object.values(WorkflowRequestType)}
                value={filters.requestTypes}
                onChange={(_, value) => handleChange("requestTypes", value)}
                renderInput={(params) => (
                  <TextField {...params} label="Request Types" />
                )}
              />

              {/* Status */}
              <Autocomplete
                multiple
                size="small"
                fullWidth
                options={Object.values(WorkflowRequestStatus)}
                value={filters.statuses}
                onChange={(_, value) => handleChange("statuses", value)}
                renderInput={(params) => <TextField {...params} label="Statuses" />}
              />

              {/* Start Date */}
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

              {/* End Date */}
              <FormControl fullWidth>
                <DatePicker
                  label="To Date"
                  format="DD/MM/YYYY"
                  minDate={filters.startDate ? dayjs(filters.startDate, "DD-MM-YYYY") : undefined}
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
