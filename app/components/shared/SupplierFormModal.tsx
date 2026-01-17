"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  TextField,
  DialogProps,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useEffect, useMemo, useRef, useState } from "react";
import { useGlobalLoading } from "../layout/LoadingProvider";

export type SupplierFormData = {
  name: string;
  location: string;
};

type SupplierFormModalProps = {
  open: boolean;
  mode: "create" | "edit";
  initialData?: SupplierFormData;
  onClose: () => void;
  onSubmit: (data: SupplierFormData) => void;
};

export default function SupplierFormModal({
  open,
  mode,
  initialData,
  onClose,
  onSubmit,
}: SupplierFormModalProps) {
  const { loading } = useGlobalLoading();

  const [form, setForm] = useState<SupplierFormData>({
    name: "",
    location: "",
  });

  const [touched, setTouched] = useState({
    name: false,
    location: false,
  });

  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setForm(
        initialData ?? {
          name: "",
          location: "",
        }
      );
      setTouched({ name: false, location: false });
    }
  }, [open, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value.trim() }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const errors = useMemo(() => {
    return {
      name: touched.name && !form.name ? "Supplier name is required" : "",
      location:
        touched.location && !form.location ? "Location is required" : "",
    };
  }, [form, touched]);

  const isSubmitDisabled =
    loading || !form.name.trim() || !form.location.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitDisabled) return;
    onSubmit({
      name: form.name.trim(),
      location: form.location.trim(),
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      TransitionProps={{
        onEntered: () => {
          nameRef.current?.focus();
        },
      }}
    >
      <DialogTitle>
        {mode === "create" ? "Add Supplier" : "Edit Supplier"}
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Stack spacing={2} mt={1}>
            <TextField
              inputRef={nameRef}
              label="Supplier Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="organization"
              error={!!errors.name}
              helperText={errors.name}
              fullWidth
              required
            />

            <TextField
              label="Location"
              name="location"
              value={form.location}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="address-level2"
              error={!!errors.location}
              helperText={errors.location}
              fullWidth
              required
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <LoadingButton onClick={onClose} loading={loading} color="inherit">
            Cancel
          </LoadingButton>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={loading}
            disabled={isSubmitDisabled}
          >
            {mode === "create" ? "Create" : "Save"}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}
