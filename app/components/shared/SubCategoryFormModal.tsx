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

  const handleSubmit = () => {
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
