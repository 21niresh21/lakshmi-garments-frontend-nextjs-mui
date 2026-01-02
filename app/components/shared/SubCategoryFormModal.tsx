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

export type SubCategoryFormData = {
  name: string;
};

type SubCategoryFormModalProps = {
  open: boolean;
  mode: "create" | "edit";
  initialData?: SubCategoryFormData;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (data: SubCategoryFormData) => void;
};

export default function SubCategoryFormModal({
  open,
  mode,
  initialData,
  loading = false,
  onClose,
  onSubmit,
}: SubCategoryFormModalProps) {
  const [form, setForm] = useState<SubCategoryFormData>({
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
    (field: keyof SubCategoryFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!form.name || loading) return;
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
        {mode === "create" ? "Add Sub Category" : "Edit Sub Category"}
      </DialogTitle>

      {/* ✅ FORM WRAPPER ENABLES ENTER KEY */}
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              inputRef={nameInputRef}
              label="Sub Category Name"
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
            type="submit"
            variant="contained"
            disabled={loading || !form.name}
          >
            {mode === "create" ? "Create" : "Save"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
