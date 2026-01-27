"use client";

import React from "react";
import {
  Box,
  Stack,
  Typography,
  TextField,
  MenuItem,
  Button,
  Divider,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import DownloadIcon from "@mui/icons-material/Download";

interface AnalyticsHeaderProps {
  title: string;
  subtitle: string;
  onFilterChange?: (filters: any) => void;
}

export default function AnalyticsHeader({
  title,
  subtitle,
  onFilterChange,
}: AnalyticsHeaderProps) {
  return (
    <Box sx={{ mb: 4,position: "sticky",
        top: 0,
        zIndex: 10, // Ensure it stays above charts but below AppBar
        bgcolor: "#fff", // Match your AppShell background
        pt: 0, // Reduced top padding
        pb: 0.5, // Reduced bottom padding
        mt : -4
         }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ md: "center" }}
        spacing={2}
      >
        {/* Title Section */}
        <Box>
          <Typography
            variant="h4"
            fontWeight="700"
            sx={{ color: "primary.main" }}
          >
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        </Box>

        {/* Action Controls */}
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            select
            label="Period"
            defaultValue="this_month"
            size="small"
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="today">Today</MenuItem>
            <MenuItem value="this_week">This Week</MenuItem>
            <MenuItem value="this_month">This Month</MenuItem>
            <MenuItem value="last_quarter">Last Quarter</MenuItem>
          </TextField>

          <TextField
            type="date"
            label="From"
            size="small"
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            type="date"
            label="To"
            size="small"
            InputLabelProps={{ shrink: true }}
          />

          <Button
            variant="contained"
            startIcon={<FilterListIcon />}
            onClick={() => {
              /* Trigger Filter Logic */
            }}
          >
            Apply
          </Button>

          <Button variant="outlined" startIcon={<DownloadIcon />}>
            Export
          </Button>
        </Stack>
      </Stack>
      <Divider sx={{ mt: 1.5 }} />
    </Box>
  );
}
