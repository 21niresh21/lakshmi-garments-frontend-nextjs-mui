"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useEffect, useRef, useState } from "react";
import { useGlobalLoading } from "../layout/LoadingProvider";
import { SupplierErrors } from "@/app/(protected)/supplier/page";

export type SupplierFormData = {
  name: string;
  location: string;
};

type SupplierFormModalProps = {
  open: boolean;
  mode: "create" | "edit";
  initialData?: SupplierFormData;
  errors: SupplierErrors;
  setErrors: React.Dispatch<React.SetStateAction<SupplierErrors>>;
  onClose: () => void;
  onSubmit: (data: SupplierFormData) => void;
};

export default function SupplierFormModal({
  open,
  mode,
  initialData,
  errors,
  setErrors,
  onClose,
  onSubmit,
}: SupplierFormModalProps) {
  const { loading } = useGlobalLoading();

  const [form, setForm] = useState<SupplierFormData>({
    name: "",
    location: "",
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
      setErrors((prev) => (Object.keys(prev).length === 0 ? prev : {}));
    }
  }, [open, initialData, setErrors]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof SupplierErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const trimmedValue = value.trim();
    setForm((prev) => ({ ...prev, [name]: trimmedValue }));
    if (errors[name as keyof SupplierErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const isSubmitDisabled = loading;

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
              error={!!errors?.name}
              helperText={errors?.name}
              fullWidth
            />

            <TextField
              label="Location"
              name="location"
              value={form.location}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="address-level2"
              error={!!errors?.location}
              helperText={errors?.location}
              fullWidth
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
