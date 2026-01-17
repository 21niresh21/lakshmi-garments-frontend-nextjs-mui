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

export type TransportFormData = {
  name: string;
};

type TransportFormModalProps = {
  open: boolean;
  mode: "create" | "edit";
  initialData?: TransportFormData;
  onClose: () => void;
  onSubmit: (data: TransportFormData) => void;
};

export default function TransportFormModal({
  open,
  mode,
  initialData,
  onClose,
  onSubmit,
}: TransportFormModalProps) {
  const { loading } = useGlobalLoading();

  const [form, setForm] = useState<TransportFormData>({
    name: "",
  });

  const [touched, setTouched] = useState({
    name: false,
  });

  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setForm(
        initialData ?? {
          name: "",
        }
      );
      setTouched({ name: false });
    }
  }, [open, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value.trim() }));
    setTouched({ name: true });
  };

  const error = useMemo(() => {
    return touched.name && !form.name ? "Transport name is required" : "";
  }, [form.name, touched.name]);

  const isSubmitDisabled = loading || !form.name.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitDisabled) return;
    onSubmit({ name: form.name.trim() });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {mode === "create" ? "Add Transport" : "Edit Transport"}
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              inputRef={nameRef}
              label="Transport Name"
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
