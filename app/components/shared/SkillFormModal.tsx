"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  TextField,
  Button,
} from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { useGlobalLoading } from "../layout/LoadingProvider";

export type SkillFormData = {
  name: string;
};

type SkillFormModalProps = {
  open: boolean;
  mode: "create" | "edit";
  initialData?: SkillFormData;
  onClose: () => void;
  onSubmit: (data: SkillFormData) => void;
};

export default function SkillFormModal({
  open,
  mode,
  initialData,
  onClose,
  onSubmit,
}: SkillFormModalProps) {
  const { loading } = useGlobalLoading();

  const [form, setForm] = useState<SkillFormData>({ name: "" });
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
    () => (touched && !form.name ? "Skill name is required" : ""),
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
      <DialogTitle>
        {mode === "create" ? "Add Skill" : "Edit Skill"}
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              inputRef={nameRef}
              label="Skill Name"
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
