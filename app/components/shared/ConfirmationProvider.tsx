"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

interface ConfirmationOptions {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
}

interface ConfirmationContextType {
  confirm: (options: ConfirmationOptions) => Promise<boolean>;
}

const ConfirmationContext = createContext<ConfirmationContextType>({
  confirm: async () => false,
});

export const useConfirmation = () => useContext(ConfirmationContext);

export function ConfirmationProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmationOptions>({});
  const [resolveCallback, setResolveCallback] = useState<
    ((value: boolean) => void) | null
  >(null);

  const confirm = (opts: ConfirmationOptions) => {
    setOptions(opts);
    setOpen(true);

    return new Promise<boolean>((resolve) => {
      setResolveCallback(() => resolve);
    });
  };

  const handleClose = (result: boolean) => {
    setOpen(false);
    resolveCallback?.(result);
  };

  return (
    <ConfirmationContext.Provider value={{ confirm }}>
      {children}
      <Dialog open={open} onClose={() => handleClose(false)}>
        <DialogTitle>{options.title || "Are you sure?"}</DialogTitle>
        {options.description && (
          <DialogContent dividers>
            <Typography>{options.description}</Typography>
          </DialogContent>
        )}
        <DialogActions>
          <Button onClick={() => handleClose(false)}>
            {options.cancelText || "Cancel"}
          </Button>
          <Button
            variant="contained"
            onClick={() => handleClose(true)}
            color="error"
          >
            {options.confirmText || "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>
    </ConfirmationContext.Provider>
  );
}
