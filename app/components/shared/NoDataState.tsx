"use client";

import React from "react";
import { Box, Typography, Stack, alpha, useTheme } from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";

interface NoDataStateProps {
  message?: string;
  icon?: React.ReactNode;
  height?: number | string;
}

export default function NoDataState({ 
  message = "No data available for the selected period", 
  icon,
  height = "100%" 
}: NoDataStateProps) {
  const theme = useTheme();
  
  return (
    <Box 
      sx={{ 
        height, 
        width: "100%", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        flexDirection: "column",
        p: 3,
        pt : 13,
        textAlign: "center"
      }}
    >
      <Stack spacing={2} alignItems="center">
        <Box 
          sx={{ 
            p: 2, 
            borderRadius: "50%", 
            bgcolor: alpha(theme.palette.text.disabled, 0.1),
            color: theme.palette.text.disabled,
            display: "flex"
          }}
        >
          {icon || <InboxIcon sx={{ fontSize: 40 }} />}
        </Box>
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          {message}
        </Typography>
      </Stack>
    </Box>
  );
}
