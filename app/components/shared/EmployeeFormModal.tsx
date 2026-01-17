"use client";

import { Skill } from "@/app/_types/Skill";
import { fetchSkills } from "@/app/api/skillApi";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Autocomplete,
  DialogProps,
} from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { useGlobalLoading } from "../layout/LoadingProvider";

export type EmployeeFormData = {
  name: string;
  skills?: number[];
};

type EmployeeFormModalProps = {
  open: boolean;
  mode: "create" | "edit";
  initialData?: EmployeeFormData;
  onClose: () => void;
  onSubmit: (data: EmployeeFormData) => void;
};

export default function EmployeeFormModal({
  open,
  mode,
  initialData,
  onClose,
  onSubmit,
}: EmployeeFormModalProps) {
  const { loading } = useGlobalLoading();

  const [skills, setSkills] = useState<Skill[]>([]);
  const [form, setForm] = useState<EmployeeFormData>({
    name: "",
    skills: [],
  });
  const [touched, setTouched] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setForm(
        initialData ?? {
          name: "",
          skills: [],
        }
      );
      setTouched(false);
    }
  }, [open, initialData]);

  useEffect(() => {
    fetchSkills("").then(setSkills);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setForm((prev) => ({ ...prev, name: value }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setForm((prev) => ({ ...prev, name: value }));
    setTouched(true);
  };

  const nameError = touched && !form.name ? "Employee name is required" : "";

  const isSubmitDisabled = loading || !form.name.trim();

  const selectedSkills = useMemo(
    () => skills.filter((s) => form.skills?.includes(s.id)),
    [skills, form.skills]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitDisabled) return;

    onSubmit({
      name: form.name.trim(),
      skills: form.skills ?? [],
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
        {mode === "create" ? "Add Employee" : "Edit Employee"}
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Stack spacing={2} mt={1}>
            <TextField
              inputRef={nameRef}
              label="Employee Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!nameError}
              helperText={nameError}
              fullWidth
              required
              autoComplete="name"
            />

            <Autocomplete
              multiple
              openOnFocus
              autoHighlight
              options={skills}
              getOptionLabel={(option) => option.name}
              value={selectedSkills}
              onChange={(_, selectedOptions) => {
                setForm((prev) => ({
                  ...prev,
                  skills: selectedOptions.map((s) => s.id),
                }));
              }}
              renderInput={(params) => <TextField {...params} label="Skills" />}
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
