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
import { CategoryErrors } from "@/app/(protected)/category/page";

export type CategoryFormData = {
  name: string;
  code: string;
};

type CategoryFormModalProps = {
  open: boolean;
  mode: "create" | "edit";
  initialData?: CategoryFormData;
  errors: CategoryErrors;
  setErrors: React.Dispatch<React.SetStateAction<CategoryErrors>>;
  onClose: () => void;
  onSubmit: (data: CategoryFormData) => void;
};

export default function CategoryFormModal({
  open,
  mode,
  initialData,
  errors,
  setErrors,
  onClose,
  onSubmit,
}: CategoryFormModalProps) {
  const { loading } = useGlobalLoading();

  const [form, setForm] = useState<CategoryFormData>({
    name: "",
    code: "",
  });

  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setForm(
        initialData ?? {
          name: "",
          code: "",
        }
      );
      setErrors((prev) => (Object.keys(prev).length === 0 ? prev : {}));
    }
  }, [open, initialData, setErrors]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof CategoryErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const trimmedValue = value.trim();
    setForm((prev) => ({ ...prev, [name]: trimmedValue }));
    if (errors[name as keyof CategoryErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const isSubmitDisabled = loading;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitDisabled) return;
    onSubmit({
      name: form.name.trim(),
      code: form.code.trim(),
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
        {mode === "create" ? "Add Category" : "Edit Category"}
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Stack spacing={2} mt={1}>
            <TextField
              inputRef={nameRef}
              label="Category Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.name}
              helperText={errors.name}
              fullWidth
            />

            <TextField
              label="Code"
              name="code"
              value={form.code}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.code}
              helperText={errors.code}
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
