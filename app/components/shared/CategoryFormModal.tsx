"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  TextField,
  Button,
  DialogProps,
} from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { useGlobalLoading } from "../layout/LoadingProvider";

export type CategoryFormData = {
  name: string;
  code: string;
};

type CategoryFormModalProps = {
  open: boolean;
  mode: "create" | "edit";
  initialData?: CategoryFormData;
  onClose: () => void;
  onSubmit: (data: CategoryFormData) => void;
};

export default function CategoryFormModal({
  open,
  mode,
  initialData,
  onClose,
  onSubmit,
}: CategoryFormModalProps) {
  const { loading } = useGlobalLoading();

  const [form, setForm] = useState<CategoryFormData>({
    name: "",
    code: "",
  });
  const [touched, setTouched] = useState({
    name: false,
    code: false,
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
      setTouched({ name: false, code: false });
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

  const errors = useMemo(
    () => ({
      name: touched.name && !form.name ? "Category name is required" : "",
      code: touched.code && !form.code ? "Code is required" : "",
    }),
    [form, touched]
  );

  const isSubmitDisabled = loading || !form.name.trim() || !form.code.trim();

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
        <DialogContent>
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
              required
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
              required
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitDisabled}>
            {mode === "create" ? "Create" : "Save"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
