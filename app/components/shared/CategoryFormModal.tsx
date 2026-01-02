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

export type CategoryFormData = {
  name: string;
  code: string;
};

type CategoryFormModalProps = {
  open: boolean;
  mode: "create" | "edit";
  initialData?: CategoryFormData;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryFormData) => void;
};

export default function CategoryFormModal({
  open,
  mode,
  initialData,
  loading = false,
  onClose,
  onSubmit,
}: CategoryFormModalProps) {
  const [form, setForm] = useState<CategoryFormData>({
    name: "",
    code: "",
  });

  const nameInputRef = useRef<HTMLInputElement>(null);

  // Populate data when editing
  useEffect(() => {
    if (open) {
      setForm(
        initialData ?? {
          name: "",
          code: "",
        }
      );
    }
  }, [open, initialData]);

  const handleChange =
    (field: keyof CategoryFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!form.name || !form.code || loading) return;
    onSubmit(form);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      TransitionProps={{
        onEntered: () => {
          nameInputRef.current?.focus();
        },
      }}
    >
      <DialogTitle>
        {mode === "create" ? "Add Category" : "Edit Category"}
      </DialogTitle>

      {/* ✅ FORM WRAPPER */}
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              inputRef={nameInputRef}
              label="Category Name"
              value={form.name}
              onChange={handleChange("name")}
              fullWidth
              required
            />

            <TextField
              label="Code"
              value={form.code}
              onChange={handleChange("code")}
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
            type="submit"   // ✅ important
            variant="contained"
            disabled={loading || !form.name || !form.code}
          >
            {mode === "create" ? "Create" : "Save"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
