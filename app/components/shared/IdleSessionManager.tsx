"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Backdrop, Box, Button, Typography, Stack, Paper } from "@mui/material";
import { deleteAuthCookie } from "@/app/utils/cookie";
import { useAuth } from "@/app/context/AuthProvider";

const IDLE_TIME = 50 * 60 * 1000; // 1 min
const WARNING_TIME = 40 * 60 * 1000; // 30 sec
const EVENTS = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"];

export default function IdleSessionManager() {
  const { hasToken, setHasToken } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const idleTimer = useRef<NodeJS.Timeout | null>(null);
  const warningTimer = useRef<NodeJS.Timeout | null>(null);

  const [open, setOpen] = useState(false);

  // Check token on client
  useEffect(() => {
    if (typeof document !== "undefined") {
      setHasToken(
        document.cookie.split("; ").some((c) => c.startsWith("token="))
      );
    }
  }, []);

  const clearAllTimers = () => {
    if (idleTimer.current) {
      clearTimeout(idleTimer.current);
      idleTimer.current = null;
    }
    if (warningTimer.current) {
      clearTimeout(warningTimer.current);
      warningTimer.current = null;
    }
  };

  const logout = () => {
    clearAllTimers();
    deleteAuthCookie();
    localStorage.removeItem("user");
    setHasToken(false); // <-- important: update state
    setOpen(false);
    router.replace("/login");
  };

  const resetTimers = () => {
    if (!hasToken || pathname === "/login") return;

    clearAllTimers();

    warningTimer.current = setTimeout(() => setOpen(true), WARNING_TIME);
    idleTimer.current = setTimeout(() => logout(), IDLE_TIME);
  };

  useEffect(() => {
    if (!hasToken || pathname === "/login") return;

    const activityHandler = () => {
      if (!open) resetTimers();
    };

    EVENTS.forEach((event) => window.addEventListener(event, activityHandler));

    resetTimers();

    return () => {
      EVENTS.forEach((event) =>
        window.removeEventListener(event, activityHandler)
      );
      clearAllTimers();
    };
  }, [hasToken, pathname, open]);

  // Do not render if no token or on login page
  if (!hasToken || pathname === "/login") return null;

  return (
    <Backdrop open={open} sx={{ zIndex: 1300 }}>
      <Paper elevation={4} sx={{ p: 3, width: 360 }}>
        <Stack spacing={2}>
          <Typography variant="h6">Session Expiring</Typography>

          <Typography variant="body2" color="text.secondary">
            You have been inactive for a while. You will be logged out
            automatically.
          </Typography>

          <Box display="flex" justifyContent="flex-end" gap={1}>
            <Button color="error" variant="outlined" onClick={logout}>
              Logout
            </Button>

            <Button
              variant="contained"
              onClick={() => {
                setOpen(false);
                resetTimers();
              }}
            >
              Stay Logged In
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Backdrop>
  );
}
