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

export type ItemFormData = {
  name: string;
};

type ItemFormModalProps = {
  open: boolean;
  mode: "create" | "edit";
  initialData?: ItemFormData;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (data: ItemFormData) => void;
};

export default function ItemFormModal({
  open,
  mode,
  initialData,
  loading = false,
  onClose,
  onSubmit,
}: ItemFormModalProps) {
  const [form, setForm] = useState<ItemFormData>({
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
    (field: keyof ItemFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
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
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <DialogTitle>
          {mode === "create" ? "Add Item" : "Edit Item"}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              inputRef={nameInputRef}
              label="Item Name"
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
            type="submit" // ✅ important
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
