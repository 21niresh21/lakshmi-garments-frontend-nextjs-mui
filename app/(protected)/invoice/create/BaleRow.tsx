"use client";

import { Autocomplete, IconButton, Stack, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Bale } from "../_types/Bale";
import { Category } from "@/app/_types/Category";
import { SubCategory } from "@/app/_types/SubCategory";
import { BaleErrors } from "./invoice.types";

interface Props {
  bale: Bale;
  onChange: (patch: Partial<Bale>) => void;
  onDelete: () => void;
  categories: Category[];
  subCategories: SubCategory[];
  errors?: BaleErrors;
}

export default function BaleRow({
  bale,
  onChange,
  onDelete,
  categories,
  subCategories,
  errors,
}: Props) {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <TextField
        label="Bale No"
        size="small"
        value={bale.baleNumber}
        onChange={(e) => onChange({ baleNumber: e.target.value })}
        error={!!errors?.baleNumber}
        helperText={errors?.baleNumber}
        sx={{ flex: 3 }}
      />

      <TextField
        label="Price"
        size="small"
        type="number"
        value={bale.price ?? ""}
        onChange={(e) => onChange({ price: Number(e.target.value) })}
        error={!!errors?.price}
        helperText={errors?.price}
        sx={{ flex: 2 }}
      />

      <TextField
        label="Quantity"
        size="small"
        type="number"
        value={bale.quantity ?? ""}
        onChange={(e) => onChange({ quantity: Number(e.target.value) })}
        error={!!errors?.quantity}
        helperText={errors?.quantity}
        sx={{ flex: 2 }}
      />

      <TextField
        label="Quality"
        size="small"
        value={bale.quality ?? ""}
        onChange={(e) => onChange({ quality: e.target.value })}
        error={!!errors?.quality}
        helperText={errors?.quality}
        sx={{ flex: 2 }}
      />

      <TextField
        label="Length"
        size="small"
        type="number"
        value={bale.length ?? ""}
        onChange={(e) => onChange({ length: Number(e.target.value) })}
        error={!!errors?.length}
        helperText={errors?.length}
        sx={{ flex: 2 }}
      />

      <Autocomplete
        disablePortal
        autoSelect
        openOnFocus
        autoHighlight
        size="small"
        options={categories}
        getOptionLabel={(option) => option.name}
        value={categories.find((c) => c.id === bale.categoryID) || null}
        onChange={(_, selected) => {
          onChange({
            categoryID: selected ? Number(selected.id) : undefined,
          });
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Category"
            error={!!errors?.categoryID}
            helperText={errors?.categoryID}
          />
        )}
        sx={{ flex: 3 }}
      />

      <Autocomplete
        disablePortal
        openOnFocus
        autoSelect
        autoHighlight
        size="small"
        options={subCategories}
        getOptionLabel={(option) => option.name}
        value={subCategories.find((sc) => sc.id === bale.subCategoryID) || null}
        onChange={(_, selected) => {
          onChange({
            subCategoryID: selected ? Number(selected.id) : undefined,
          });
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Sub Category"
            error={!!errors?.subCategoryID}
            helperText={errors?.subCategoryID}
          />
        )}
        sx={{ flex: 3 }}
      />

      <IconButton color="error" onClick={onDelete}>
        <DeleteIcon />
      </IconButton>
    </Stack>
  );
}
