"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import TimerIcon from "@mui/icons-material/Timer";
import { useAuthActions } from "@/app/hooks/useAuthActions";

const WARNING_THRESHOLD_MS = 60 * 1000; // 1 minute
const CHECK_INTERVAL_MS = 10 * 1000; // 10 seconds

export default function SessionExpiryTracker() {
  const [open, setOpen] = useState(false);
  const { logout } = useAuthActions();

  useEffect(() => {
    const checkExpiry = () => {
      const expiresAtStr = localStorage.getItem("session_expires_at");
      if (!expiresAtStr) return;

      const expiresAt = parseInt(expiresAtStr, 10);
      const now = Date.now();
      const timeLeft = expiresAt - now;

      if (timeLeft <= 0) {
        // Session already expired
        logout();
        return;
      }

      if (timeLeft <= WARNING_THRESHOLD_MS) {
        setOpen(true);
      } else {
        setOpen(false);
      }
    };

    // Check immediately on mount
    checkExpiry();

    const interval = setInterval(checkExpiry, CHECK_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [logout]);

  const handleLogout = () => {
    setOpen(false);
    logout();
  };

  const handleIgnore = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== "backdropClick") {
          handleIgnore();
        }
      }}
      aria-labelledby="session-expiry-dialog-title"
      aria-describedby="session-expiry-dialog-description"
    >
      <DialogTitle id="session-expiry-dialog-title" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <TimerIcon color="warning" />
        Session Expiring Soon
      </DialogTitle>
      <DialogContent sx={{mt : 3}}>
        <DialogContentText id="session-expiry-dialog-description">
          Your session is about to expire in less than a minute.
        </DialogContentText>
        <Box>
          <Typography variant="body2" color="text.secondary">
            Please logout and login again to maintain another session for 8 more hours.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleIgnore} color="inherit">
          Ignore
        </Button>
        <Button onClick={handleLogout} variant="contained" color="error" autoFocus>
          Logout
        </Button>
      </DialogActions>
    </Dialog>
  );
}
