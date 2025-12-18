"use client";

import {
  Box,
  Button,
  Chip,
  Grid,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import React from "react";
import { BatchStatus } from "@/app/_types/BatchStatus";
import { BatchFilters } from "./_types/BatchFilter";

interface Props {
  filters: BatchFilters;
  onChange: (filters: BatchFilters) => void;
  onReset: () => void;

  categories: string[];
  createdByOptions: string[];
}

export default function BatchFiltersPanel({
  filters,
  onChange,
  onReset,
  categories,
  createdByOptions,
}: Props) {
  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        Filters
      </Typography>

      <Grid container spacing={2}>
        {/* Category */}
        <Grid size={12}>
          <Select
            fullWidth
            multiple
            displayEmpty
            value={filters.categoryNames}
            onChange={(e) =>
              onChange({
                ...filters,
                categoryNames: e.target.value as string[],
              })
            }
            renderValue={(selected) =>
              selected.length === 0 ? (
                <Typography color="text.secondary">Category</Typography>
              ) : (
                <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                  {(selected as string[]).map((v) => (
                    <Chip key={v} label={v} size="small" />
                  ))}
                </Box>
              )
            }
          >
            {categories.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </Select>
        </Grid>

        {/* Status */}
        <Grid size={12}>
          <Select
            fullWidth
            multiple
            displayEmpty
            value={filters.batchStatusNames}
            onChange={(e) =>
              onChange({
                ...filters,
                batchStatusNames: e.target.value as string[],
              })
            }
            renderValue={(selected) =>
              selected.length === 0 ? (
                <Typography color="text.secondary">Status</Typography>
              ) : (
                <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                  {(selected as string[]).map((v) => (
                    <Chip key={v} label={v} size="small" />
                  ))}
                </Box>
              )
            }
          >
            {Object.values(BatchStatus).map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </Grid>

        {/* Priority */}
        <Grid size={12}>
          <Select
            fullWidth
            displayEmpty
            value={
              filters.isUrgent.length === 0
                ? ""
                : filters.isUrgent[0]
                ? "HIGH"
                : "NORMAL"
            }
            // onChange={(e) =>
            //   onChange({
            //     ...filters,
            //     isUrgent:
            //       e.target.value === ""
            //         ? []
            //         : e.target.value === "HIGH"
            //         ? [true]
            //         : [false],
            //   })
            // }
          >
            <MenuItem value="">Priority</MenuItem>
            <MenuItem value="HIGH">High</MenuItem>
            <MenuItem value="NORMAL">Normal</MenuItem>
          </Select>
        </Grid>

        {/* Created By */}
        <Grid size={12}>
          <Select
            fullWidth
            displayEmpty
            value={filters.createdBy ?? ""}
            onChange={(e) =>
              onChange({ ...filters, createdBy: e.target.value || undefined })
            }
          >
            <MenuItem value="">Created By</MenuItem>
            {createdByOptions.map((u) => (
              <MenuItem key={u} value={u}>
                {u}
              </MenuItem>
            ))}
          </Select>
        </Grid>

        {/* Date Range */}
        <Grid size={12}>
          <DatePicker
            label="From"
            // value={filters.startDate ? new Date(filters.startDate) : null}
            onChange={(date) =>
              onChange({
                ...filters,
                startDate: date ? date.toISOString().split("T")[0] : undefined,
              })
            }
            slotProps={{ textField: { size: "small", fullWidth: true } }}
          />
        </Grid>

        <Grid size={12}>
          <DatePicker
            label="To"
            // value={filters.endDate ? new Date(filters.endDate) : null}
            onChange={(date) =>
              onChange({
                ...filters,
                endDate: date ? date.toISOString().split("T")[0] : undefined,
              })
            }
            slotProps={{ textField: { size: "small", fullWidth: true } }}
          />
        </Grid>

        {/* Actions */}
        <Grid size={12}>
          <Box display="flex" justifyContent="flex-end" gap={1}>
            <Button variant="outlined" onClick={onReset}>
              Reset
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
