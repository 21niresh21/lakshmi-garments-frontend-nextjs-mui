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
import { TransportErrors } from "@/app/(protected)/transport/page";

export type TransportFormData = {
  name: string;
};

type TransportFormModalProps = {
  open: boolean;
  mode: "create" | "edit";
  initialData?: TransportFormData;
  errors: TransportErrors;
  setErrors: React.Dispatch<React.SetStateAction<TransportErrors>>;
  onClose: () => void;
  onSubmit: (data: TransportFormData) => void;
};

export default function TransportFormModal({
  open,
  mode,
  initialData,
  errors,
  setErrors,
  onClose,
  onSubmit,
}: TransportFormModalProps) {
  const { loading } = useGlobalLoading();

  const [form, setForm] = useState<TransportFormData>({
    name: "",
  });

  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setForm(
        initialData ?? {
          name: "",
        }
      );
      setErrors((prev) => (Object.keys(prev).length === 0 ? prev : {}));
    }
  }, [open, initialData, setErrors]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof TransportErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const trimmedValue = value.trim();
    setForm((prev) => ({ ...prev, [name]: trimmedValue }));
    if (errors[name as keyof TransportErrors]) {
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
      <DialogTitle>
        {mode === "create" ? "Add Transport" : "Edit Transport"}
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Stack spacing={2} mt={1}>
            <TextField
              inputRef={nameRef}
              label="Transport Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors?.name}
              helperText={errors?.name}
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
