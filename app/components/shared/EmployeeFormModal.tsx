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
} from "@mui/material";
import { useEffect, useRef, useState } from "react";

export type EmployeeFormData = {
  name: string;
  skills?: number[];
};

type EmployeeFormModalProps = {
  open: boolean;
  mode: "create" | "edit";
  initialData?: EmployeeFormData;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (data: EmployeeFormData) => void;
};

export default function EmployeeFormModal({
  open,
  mode,
  initialData,
  loading = false,
  onClose,
  onSubmit,
}: EmployeeFormModalProps) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [form, setForm] = useState<EmployeeFormData>({
    name: "",
    skills: [],
  });
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Populate data when editing
  useEffect(() => {
    if (open) {
      setForm(
        initialData ?? {
          name: "",
          skills: [],
        }
      );
    }
  }, [open, initialData]);

  const handleChange =
    (field: keyof EmployeeFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = () => {
    onSubmit(form);
  };

  useEffect(() => {
    fetchSkills("").then((res) => setSkills(res));
  }, []);

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
        {mode === "create" ? "Add Employee" : "Edit Employee"}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            inputRef={nameInputRef}
            label="Employee Name"
            value={form.name}
            onChange={handleChange("name")}
            fullWidth
            required
          />

          <Autocomplete
            multiple
            openOnFocus
            id="skills-autocomplete"
            disablePortal
            autoHighlight
            options={skills}
            getOptionLabel={(option) => option.name}
            value={skills.filter((skill) => form.skills?.includes(skill.id))}
            onChange={(_, selectedOptions) => {
              const ids = selectedOptions.map((opt) => opt.id);
              setForm((prev) => ({ ...prev, skills: ids }));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                id="skill-input"
                label="Skills"
                // error={!!errors.supplierName}
                // helperText={errors.supplierName}
              />
            )}
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
