"use client";

import React from "react";
import { Box, Typography, Paper, useTheme, alpha } from "@mui/material";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import AnalyticsHeader from "../analytics/AnalyticsHeader";

export default function ProductionDashboard() {
  const theme = useTheme();

  return (
    <Box sx={{ p: 0, minHeight: "80vh", display: "flex", flexDirection: "column" }}>
      <AnalyticsHeader 
        title="Production Overview" 
        subtitle="Production efficiency and arrivals"
        hideFilters={true}
      />
      
      <Box sx={{ 
        flexGrow: 1, 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        pb: 10
      }}>
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: "center",
            maxWidth: 500,
            borderRadius: 8,
            bgcolor: alpha(theme.palette.background.paper, 0.4),
            backdropFilter: "blur(10px)",
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: "primary.main",
              mb: 1
            }}
          >
            <PrecisionManufacturingIcon sx={{ fontSize: 40 }} />
          </Box>
          
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Coming Soon
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 300, mx: "auto" }}>
              The Production Dashboard is currently under development. Soon you'll be able to track batches, efficiency, and real-time factory progress here.
            </Typography>
          </Box>
          
          <Box 
            sx={{ 
              mt: 2,
              px: 3, 
              py: 1, 
              borderRadius: "20px", 
              bgcolor: alpha(theme.palette.secondary.main, 0.1),
              color: "secondary.main",
              fontSize: "0.875rem",
              fontWeight: 600
            }}
          >
            Next Release
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
