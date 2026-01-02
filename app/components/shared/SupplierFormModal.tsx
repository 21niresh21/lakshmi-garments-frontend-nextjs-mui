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

export type SupplierFormData = {
  name: string;
  location: string;
};

type SupplierFormModalProps = {
  open: boolean;
  mode: "create" | "edit";
  initialData?: SupplierFormData;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (data: SupplierFormData) => void;
};

export default function SupplierFormModal({
  open,
  mode,
  initialData,
  loading = false,
  onClose,
  onSubmit,
}: SupplierFormModalProps) {
  const [form, setForm] = useState<SupplierFormData>({
    name: "",
    location: "",
  });

  const nameInputRef = useRef<HTMLInputElement>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);

  // Populate data when editing
  useEffect(() => {
    if (open) {
      setForm(
        initialData ?? {
          name: "",
          location: "",
        }
      );
    }
  }, [open, initialData]);

  const handleChange =
    (field: keyof SupplierFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = () => {
    if (!form.name || !form.location || loading) return;
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
        {mode === "create" ? "Add Supplier" : "Edit Supplier"}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            inputRef={nameInputRef}
            label="Supplier Name"
            value={form.name}
            onChange={handleChange("name")}
            fullWidth
            required
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                locationInputRef.current?.focus();
              }
            }}
          />

          <TextField
            inputRef={locationInputRef}
            label="Location"
            value={form.location}
            onChange={handleChange("location")}
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
          disabled={loading || !form.name || !form.location}
        >
          {mode === "create" ? "Create" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
