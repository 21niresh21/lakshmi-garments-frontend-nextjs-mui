"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";

export type TransportFormData = {
  name: string;
};

type TransportFormModalProps = {
  open: boolean;
  mode: "create" | "edit";
  initialData?: TransportFormData;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (data: TransportFormData) => void;
};

export default function TransportFormModal({
  open,
  mode,
  initialData,
  loading = false,
  onClose,
  onSubmit,
}: TransportFormModalProps) {
  const [form, setForm] = useState<TransportFormData>({
    name: "",
  });

  const nameInputRef = useRef<HTMLInputElement>(null);

  // Populate data when editing
  useEffect(() => {
    if (open) {
      setForm(
        initialData ?? {
          name: "",
        }
      );
    }
  }, [open, initialData]);

  const handleChange =
    (field: keyof TransportFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = () => {
    if (!form.name || loading) return;
    onSubmit(form);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          handleSubmit();
        }
      }}
      TransitionProps={{
        onEntered: () => {
          nameInputRef.current?.focus();
        },
      }}
    >
      <DialogTitle>
        {mode === "create" ? "Add Transport" : "Edit Transport"}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            inputRef={nameInputRef}
            label="Transport Name"
            value={form.name}
            onChange={handleChange("name")}
            fullWidth
            required
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !form.name}
        >
          {mode === "create" ? "Create" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
