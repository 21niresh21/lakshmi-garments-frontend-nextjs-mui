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

export type ItemFormData = {
  name: string;
};

type ItemFormModalProps = {
  open: boolean;
  mode: "create" | "edit";
  initialData?: ItemFormData;
  onClose: () => void;
  onSubmit: (data: ItemFormData) => void;
};

export default function ItemFormModal({
  open,
  mode,
  initialData,
  onClose,
  onSubmit,
}: ItemFormModalProps) {
  const { loading } = useGlobalLoading();

  const [form, setForm] = useState<ItemFormData>({ name: "" });
  const [touched, setTouched] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setForm(initialData ?? { name: "" });
      setTouched(false);
    }
  }, [open, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ name: e.target.value });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setForm({ name: e.target.value.trim() });
    setTouched(true);
  };

  const error = useMemo(
    () => (touched && !form.name ? "Item name is required" : ""),
    [touched, form.name]
  );

  const isSubmitDisabled = loading || !form.name.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitDisabled) return;
    onSubmit({ name: form.name.trim() });
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
      <DialogTitle>{mode === "create" ? "Add Item" : "Edit Item"}</DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Stack spacing={2} mt={1}>
            <TextField
              inputRef={nameRef}
              label="Item Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!error}
              helperText={error}
              fullWidth
              required
              autoComplete="off"
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
