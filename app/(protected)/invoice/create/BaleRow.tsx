"use client";

import { Autocomplete, IconButton, Stack, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Bale } from "../_types/Bale";
import { Category } from "@/app/_types/Category";
import { SubCategory } from "@/app/_types/SubCategory";
import { BaleErrors } from "./invoice.types";
import { GenericAutocomplete } from "@/app/components/shared/GenericAutocomplete";
import { useNotification } from "@/app/components/shared/NotificationProvider";
import { useState } from "react";
import CategoryFormModal, {
  CategoryFormData,
} from "@/app/components/shared/CategoryFormModal";
import { addCategory } from "@/app/api/category";
import SubCategoryFormModal, {
  SubCategoryFormData,
} from "@/app/components/shared/SubCategoryFormModal";
import { addSubCategory } from "@/app/api/subCategory";

interface Props {
  bale: Bale;
  onChange: (patch: Partial<Bale>) => void;
  onDelete: () => void;
  categories: Category[];
  subCategories: SubCategory[];
  errors?: BaleErrors;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  setSubCategories: React.Dispatch<React.SetStateAction<SubCategory[]>>;
}

export default function BaleRow({
  bale,
  onChange,
  onDelete,
  categories,
  subCategories,
  errors,
  setCategories,
  setSubCategories,
}: Props) {
  const { notify } = useNotification();
  type CreateEntityType = "category" | "subCategory" | null;

  const [createDialog, setCreateDialog] = useState<{
    type: CreateEntityType;
    prefillName: string;
  }>({
    type: null,
    prefillName: "",
  });

  const createCategory = async (data: CategoryFormData) => {
    try {
      const createdCategory = await addCategory(data);
      setCreateDialog({ type: null, prefillName: "" });
      setCategories((prev) => [...prev, createdCategory]);
      onChange({ categoryID: createdCategory.id });
      notify("Category created successfully", "success");
    } catch (err: any) {
      notify(err?.response?.data ?? "Error saving category", "error");
    }
  };

  const createSubCategory = async (data: SubCategoryFormData) => {
    try {
      const createdSubCategory = await addSubCategory(data);
      setCreateDialog({ type: null, prefillName: "" });
      setSubCategories((prev) => [...prev, createdSubCategory]);
      onChange({ subCategoryID: createdSubCategory.id });
      notify("Sub Category created successfully", "success");
    } catch (err: any) {
      notify(err?.response?.data ?? "Error saving sub category", "error");
    }
  };

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
        onChange={(e) => {
          const raw = e.target.value;
          onChange({
            price: raw === "" ? undefined : Number(raw),
          });
        }}
        // onChange={(e) => onChange({ price: Number(e.target.value) })}
        error={!!errors?.price}
        helperText={errors?.price}
        sx={{ flex: 2 }}
      />

      <TextField
        label="Quantity"
        size="small"
        type="number"
        value={bale.quantity ?? ""}
        onChange={(e) => {
          const raw = e.target.value;
          onChange({
            quantity: raw === "" ? undefined : Number(raw),
          });
        }}
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
        onChange={(e) => {
          const raw = e.target.value;
          onChange({
            length: raw === "" ? undefined : Number(raw),
          });
        }}
        // onChange={(e) => onChange({ length: Number(e.target.value) })}
        error={!!errors?.length}
        helperText={errors?.length}
        sx={{ flex: 2 }}
      />

      <GenericAutocomplete<Category>
        size="small"
        label="Category"
        options={categories}
        value={categories.find((c) => c.id === bale.categoryID) || null}
        onChange={(category) => onChange({ categoryID: category?.id })}
        allowCreate
        getOptionLabel={(c) => c.name}
        isOptionEqualToValue={(a, b) => a.id === b.id}
        onCreateClick={(name) => {
          setCreateDialog({
            type: "category",
            prefillName: name,
          });
        }}
        error={errors?.categoryID}
        sx={{ flex: 3 }}
      />
      <CategoryFormModal
        open={createDialog.type === "category"}
        mode="create"
        onSubmit={createCategory}
        onClose={() => setCreateDialog({ type: null, prefillName: "" })}
        initialData={{ name: createDialog.prefillName, code: "" }}
      />

      <GenericAutocomplete<SubCategory>
        size="small"
        label="Sub Category"
        options={subCategories}
        value={subCategories.find((sc) => sc.id === bale.subCategoryID) || null}
        onChange={(subCategory) => onChange({ subCategoryID: subCategory?.id })}
        allowCreate
        getOptionLabel={(sc) => sc.name}
        isOptionEqualToValue={(a, b) => a.id === b.id}
        onCreateClick={(name) => {
          setCreateDialog({
            type: "subCategory",
            prefillName: name,
          });
        }}
        error={errors?.subCategoryID}
        sx={{ flex: 3 }}
      />
      <SubCategoryFormModal
        open={createDialog.type === "subCategory"}
        mode="create"
        onSubmit={createSubCategory}
        onClose={() => setCreateDialog({ type: null, prefillName: "" })}
        initialData={{ name: createDialog.prefillName }}
      />

      <IconButton color="error" onClick={onDelete}>
        <DeleteIcon />
      </IconButton>
    </Stack>
  );
}
