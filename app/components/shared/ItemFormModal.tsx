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
import { ItemErrors } from "@/app/(protected)/item/page";

export type ItemFormData = {
  name: string;
};

type ItemFormModalProps = {
  open: boolean;
  mode: "create" | "edit";
  initialData?: ItemFormData;
  errors: ItemErrors;
  setErrors: React.Dispatch<React.SetStateAction<ItemErrors>>;
  onClose: () => void;
  onSubmit: (data: ItemFormData) => void;
};

export default function ItemFormModal({
  open,
  mode,
  initialData,
  errors,
  setErrors,
  onClose,
  onSubmit,
}: ItemFormModalProps) {
  const { loading } = useGlobalLoading();

  const [form, setForm] = useState<ItemFormData>({ name: "" });
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setForm(initialData ?? { name: "" });
      setErrors((prev) => (Object.keys(prev).length === 0 ? prev : {}));
    }
  }, [open, initialData, setErrors]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ItemErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const trimmedValue = value.trim();
    setForm((prev) => ({ ...prev, [name]: trimmedValue }));
    if (errors[name as keyof ItemErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const isSubmitDisabled = loading;

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
              error={!!errors.name}
              helperText={errors.name}
              fullWidth
              autoComplete="off"
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
