"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Chip,
  Grid,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import {
  LocalizationProvider,
  DatePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

/* ------------------ TYPES ------------------ */

enum BatchStatus {
  CREATED = "CREATED",
  WIP = "WIP",
  PACKAGED = "PACKAGED",
  DISCARDED = "DISCARDED",
}

interface BatchFilters {
  categoryNames: string[];
  batchStatusNames: string[];
  isUrgent: boolean[];
  createdBy?: string;
  startDate?: string;
  endDate?: string;
}

/* ------------------ SAMPLE DATA ------------------ */

const SAMPLE_CATEGORIES = ["Cotton", "Silk", "Denim", "Linen"];
const SAMPLE_CREATED_BY = ["Admin", "Supervisor", "Manager"];

/* ------------------ COMPONENT ------------------ */

export default function BatchFiltersDemo() {
  const [filters, setFilters] = useState<BatchFilters>({
    categoryNames: [],
    batchStatusNames: [],
    isUrgent: [],
  });

  const handleReset = () => {
    setFilters({
      categoryNames: [],
      batchStatusNames: [],
      isUrgent: [],
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper sx={{ p: 2, maxWidth: 1100 }}>
        <Typography variant="h6" gutterBottom>
          Batch Filters (Demo)
        </Typography>

        <Grid container spacing={2}>
          {/* Category */}
          <Grid size={3}>
            <Select
              fullWidth
              multiple
              displayEmpty
              value={filters.categoryNames}
              onChange={(e) =>
                setFilters({
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
              {SAMPLE_CATEGORIES.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          {/* Status */}
          <Grid size={3}>
            <Select
              fullWidth
              multiple
              displayEmpty
              value={filters.batchStatusNames}
              onChange={(e) =>
                setFilters({
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
          <Grid size={2}>
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
            //   onChange={(e) =>
            //     setFilters({
            //       ...filters,
            //       isUrgent:
            //         e.target.value === ""
            //           ? []
            //           : e.target.value === "HIGH"
            //           ? [true]
            //           : [false],
            //     })
            //   }
            >
              <MenuItem value="">Priority</MenuItem>
              <MenuItem value="HIGH">High</MenuItem>
              <MenuItem value="NORMAL">Normal</MenuItem>
            </Select>
          </Grid>

          {/* Created By */}
          <Grid size={2}>
            <Select
              fullWidth
              displayEmpty
              value={filters.createdBy ?? ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  createdBy: e.target.value || undefined,
                })
              }
            >
              <MenuItem value="">Created By</MenuItem>
              {SAMPLE_CREATED_BY.map((u) => (
                <MenuItem key={u} value={u}>
                  {u}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          {/* Date From */}
          <Grid size={2}>
            <DatePicker
              label="From"
              value={filters.startDate ? dayjs(filters.startDate) : null}
              onChange={(date) =>
                setFilters({
                  ...filters,
                  startDate: date ? date.format("YYYY-MM-DD") : undefined,
                })
              }
              slotProps={{
                textField: { size: "small", fullWidth: true },
              }}
            />
          </Grid>

          {/* Date To */}
          <Grid size={2}>
            <DatePicker
              label="To"
              value={filters.endDate ? dayjs(filters.endDate) : null}
              onChange={(date) =>
                setFilters({
                  ...filters,
                  endDate: date ? date.format("YYYY-MM-DD") : undefined,
                })
              }
              slotProps={{
                textField: { size: "small", fullWidth: true },
              }}
            />
          </Grid>

          {/* Actions */}
          <Grid size={12}>
            <Box display="flex" justifyContent="flex-end" gap={1}>
              <Button variant="outlined" onClick={handleReset}>
                Reset
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* 🔍 LIVE PREVIEW */}
        <Box mt={3}>
          <Typography variant="subtitle2">Current Filter State</Typography>
          <Paper variant="outlined" sx={{ p: 2, mt: 1 }}>
            <pre style={{ margin: 0, fontSize: 13 }}>
              {JSON.stringify(filters, null, 2)}
            </pre>
          </Paper>
        </Box>
      </Paper>
    </LocalizationProvider>
  );
}
