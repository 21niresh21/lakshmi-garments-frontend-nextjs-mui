"use client";

import { Skill } from "@/app/_types/Skill";
import { fetchSkills } from "@/app/api/skillApi";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Autocomplete,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useEffect, useMemo, useRef, useState } from "react";
import { useGlobalLoading } from "../layout/LoadingProvider";
import { EmployeeErrors } from "@/app/(protected)/employee/page";

export type EmployeeFormData = {
  name: string;
  skills?: number[];
};

type EmployeeFormModalProps = {
  open: boolean;
  mode: "create" | "edit";
  initialData?: EmployeeFormData;
  errors: EmployeeErrors;
  setErrors: React.Dispatch<React.SetStateAction<EmployeeErrors>>;
  onClose: () => void;
  onSubmit: (data: EmployeeFormData) => void;
};

export default function EmployeeFormModal({
  open,
  mode,
  initialData,
  errors,
  setErrors,
  onClose,
  onSubmit,
}: EmployeeFormModalProps) {
  const { loading } = useGlobalLoading();

  const [skills, setSkills] = useState<Skill[]>([]);
  const [form, setForm] = useState<EmployeeFormData>({
    name: "",
    skills: [],
  });

  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setForm(
        initialData ?? {
          name: "",
          skills: [],
        }
      );
      setErrors((prev) => (Object.keys(prev).length === 0 ? prev : {}));
    }
  }, [open, initialData, setErrors]);

  useEffect(() => {
    fetchSkills("").then(setSkills);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, name: value }));
    if (errors[name as keyof EmployeeErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const trimmedValue = value.trim();
    setForm((prev) => ({ ...prev, name: trimmedValue }));
    if (errors[name as keyof EmployeeErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const isSubmitDisabled = loading;

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
              error={!!errors.name}
              helperText={errors.name}
              fullWidth
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
                if (errors.skills) {
                  setErrors((prev) => ({ ...prev, skills: undefined }));
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Skills"
                  error={!!errors.skills}
                  helperText={errors.skills}
                />
              )}
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
