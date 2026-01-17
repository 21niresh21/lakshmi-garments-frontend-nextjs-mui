"use client";

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
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useCallback, useMemo } from "react";

import {
  BaleDetails,
  BaleErrors,
} from "@/app/(protected)/invoice/[id]/bale.types";
import { Category } from "@/app/_types/Category";
import { SubCategory } from "@/app/_types/SubCategory";
import { sanitizeNumberInput } from "@/app/utils/number";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  initialData: BaleDetails;
  loading?: boolean;
  onChange: (patch: Partial<BaleDetails>) => void;
  onClose: () => void;
  onSubmit: (data: BaleDetails) => void;
  categories: Category[];
  subCategories: SubCategory[];
  errors: BaleErrors;
};

export default function BaleFormModal({
  open,
  mode,
  initialData,
  loading = false,
  onClose,
  onSubmit,
  categories,
  subCategories,
  errors,
  onChange,
}: Props) {
  /* ---------------- Memoized Options ---------------- */

  const categoryOptions = useMemo(
    () => categories.map((c) => c.name),
    [categories]
  );

  const subCategoryOptions = useMemo(
    () => subCategories.map((s) => s.name),
    [subCategories]
  );

  /* ---------------- Handlers ---------------- */

  const handleTextChange = useCallback(
    (field: keyof Pick<BaleDetails, "baleNumber" | "quality">) =>
      (e: React.ChangeEvent<HTMLInputElement>) =>
        onChange({ [field]: e.target.value }),
    [onChange]
  );

  const handleTrimOnBlur = useCallback(
    (field: keyof BaleDetails) => (e: React.FocusEvent<HTMLInputElement>) => {
      const trimmed = e.target.value.trim();
      if (trimmed !== e.target.value) {
        onChange({ [field]: trimmed });
      }
    },
    [onChange]
  );

  const handleNumberChange = useCallback(
    (field: keyof Pick<BaleDetails, "quantity" | "length" | "price">) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        onChange({
          [field]: raw === "" ? "" : Number(sanitizeNumberInput(raw)),
        });
      },
    [onChange]
  );

  const handleCategoryChange = useCallback(
    (_: unknown, value: string | null) => onChange({ category: value ?? "" }),
    [onChange]
  );

  const handleSubCategoryChange = useCallback(
    (_: unknown, value: string | null) =>
      onChange({ subCategory: value ?? "" }),
    [onChange]
  );

  const handleSubmit = useCallback(() => {
    onSubmit(initialData);
  }, [initialData, onSubmit]);

  /* ---------------- Render ---------------- */

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {mode === "create" ? "Add Bale" : "Edit Bale"}
        </DialogTitle>

        <DialogContent dividers>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Bale Number"
              value={initialData.baleNumber}
              onChange={handleTextChange("baleNumber")}
              onBlur={handleTrimOnBlur("baleNumber")}
              required
              fullWidth
              error={!!errors.baleNumber}
              helperText={errors.baleNumber}
            />

            <TextField
              label="Quantity"
              type="number"
              value={initialData.quantity}
              onChange={handleNumberChange("quantity")}
              fullWidth
              error={!!errors.quantity}
              helperText={errors.quantity}
            />

            <TextField
              label="Length"
              type="number"
              value={initialData.length}
              onChange={handleNumberChange("length")}
              fullWidth
              error={!!errors.length}
              helperText={errors.length}
            />

            <TextField
              label="Price"
              type="number"
              value={initialData.price}
              onChange={handleNumberChange("price")}
              fullWidth
              error={!!errors.price}
              helperText={errors.price}
            />

            <TextField
              label="Quality"
              value={initialData.quality}
              onChange={handleTextChange("quality")}
              onBlur={handleTrimOnBlur("quality")}
              required
              fullWidth
              error={!!errors.quality}
              helperText={errors.quality}
            />

            <Autocomplete
              options={categoryOptions}
              value={initialData.category || null}
              onChange={handleCategoryChange}
              isOptionEqualToValue={(a, b) => a === b}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Category"
                  onBlur={handleTrimOnBlur("category")}
                  error={!!errors.category}
                  helperText={errors.category}
                />
              )}
            />

            <Autocomplete
              options={subCategoryOptions}
              value={initialData.subCategory || null}
              onChange={handleSubCategoryChange}
              isOptionEqualToValue={(a, b) => a === b}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Sub Category"
                  onBlur={handleTrimOnBlur("subCategory")}
                  error={!!errors.subCategory}
                  helperText={errors.subCategory}
                />
              )}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>

          <Button variant="contained" onClick={handleSubmit} disabled={loading}>
            {mode === "create" ? "Create" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
