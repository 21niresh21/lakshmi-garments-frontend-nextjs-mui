"use client";

import { createContext, useContext, useState, ReactNode, useCallback, useMemo } from "react";
import { Snackbar, Alert } from "@mui/material";

type NotificationType = "success" | "error" | "info" | "warning";

interface NotificationContextType {
  notify: (message: string, type?: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notify: () => {},
});

export const useNotification = () => useContext(NotificationContext);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<NotificationType>("info");

  const notify = useCallback((msg: string, notifType: NotificationType = "info") => {
    setMessage(msg);
    setType(notifType);
    setOpen(true);
  }, []);

  const handleClose = (_?: any, reason?: string) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity={type} variant="filled">
          {message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
}
