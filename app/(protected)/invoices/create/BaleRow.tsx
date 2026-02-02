"use client";

import {
  IconButton,
  Stack,
  TextField,
  Tooltip,
  useMediaQuery,
  useTheme,
  alpha,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useCallback, useMemo, useState } from "react";
import { Bale } from "../_types/Bale";
import { Category } from "@/app/_types/Category";
import { SubCategory } from "@/app/_types/SubCategory";
import { BaleErrors } from "./invoice.types";
import { GenericAutocomplete } from "@/app/components/shared/GenericAutocomplete";
import { useNotification } from "@/app/components/shared/NotificationProvider";
import CategoryFormModal, {
  CategoryFormData,
} from "@/app/components/shared/CategoryFormModal";
import { CategoryErrors } from "../../category/page";
import SubCategoryFormModal, {
  SubCategoryFormData,
} from "@/app/components/shared/SubCategoryFormModal";
import { SubCategoryErrors } from "../../subcategory/page";
import { addCategory } from "@/app/api/category";
import { addSubCategory } from "@/app/api/subCategory";
import { sanitizeNumberInput } from "@/app/utils/number";

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

type CreateEntityType = "category" | "subCategory" | null;

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { notify } = useNotification();

  const [createDialog, setCreateDialog] = useState<{
    type: CreateEntityType;
    prefillName: string;
  }>({ type: null, prefillName: "" });
  const [categoryErrors, setCategoryErrors] = useState<CategoryErrors>({});
  const [subCategoryErrors, setSubCategoryErrors] = useState<SubCategoryErrors>({});

  /* ---------------- Memoized Values ---------------- */

  const selectedCategory = useMemo(
    () => categories.find((c) => c.id === bale.categoryID) ?? null,
    [categories, bale.categoryID]
  );

  const selectedSubCategory = useMemo(
    () => subCategories.find((sc) => sc.id === bale.subCategoryID) ?? null,
    [subCategories, bale.subCategoryID]
  );

  /* ---------------- Helpers ---------------- */

  const handleNumberChange = useCallback(
    (field: keyof Bale) => (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      // Allow only digits and a single dot
      const regex = /^[0-9]*\.?[0-9]*$/;
      if (regex.test(value) || value === "") {
        // Prevent leading zeros unless followed by a decimal
        if (value.length > 1 && value.startsWith("0") && value[1] !== ".") {
          value = value.replace(/^0+/, "");
          if (value === "") value = "0"; // handle case where all zeros were trimmed
        }
        onChange({
          [field]: value === "" ? undefined : value,
        });
      }
    },
    [onChange]
  );

  const handleTextChange = useCallback(
    (field: keyof Bale) => (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ [field]: e.target.value });
    },
    [onChange]
  );

  const handleTextBlur = useCallback(
    (field: keyof Bale) => (e: React.FocusEvent<HTMLInputElement>) => {
      onChange({ [field]: e.target.value.trim() });
    },
    [onChange]
  );

  /* ---------------- Create Handlers ---------------- */

  const createCategory = useCallback(
    async (data: CategoryFormData) => {
      try {
        const created = await addCategory(data);
        setCategories((prev) => [...prev, created]);
        onChange({ categoryID: created.id });
        notify("Category created successfully", "success");
        setCreateDialog({ type: null, prefillName: "" });
        setCategoryErrors({});
      } catch (err: any) {
        if (err.validationErrors) {
          setCategoryErrors(err.validationErrors);
        } else if (err.message && err.message !== "Validation failed") {
          notify(err?.message || "Error saving category", "error");
        }
      }
    },
    [notify, onChange, setCategories]
  );

  const createSubCategory = useCallback(
    async (data: SubCategoryFormData) => {
      try {
        const created = await addSubCategory(data);
        setSubCategories((prev) => [...prev, created]);
        onChange({ subCategoryID: created.id });
        notify("Sub Category created successfully", "success");
        setCreateDialog({ type: null, prefillName: "" });
        setSubCategoryErrors({});
      } catch (err: any) {
        if (err.validationErrors) {
          setSubCategoryErrors(err.validationErrors);
        } else if (err.message && err.message !== "Validation failed") {
          notify(err?.message || "Error saving sub category", "error");
        }
      }
    },
    [notify, onChange, setSubCategories]
  );

  /* ---------------- Render ---------------- */

  return (
    <Stack
      direction={isMobile ? "column" : "row"}
      spacing={2}
      alignItems="center"
      flexWrap="wrap"
    >
      <TextField
        label="Bale No"
        size="small"
        value={bale.baleNumber}
        onChange={handleTextChange("baleNumber")}
        onBlur={handleTextBlur("baleNumber")}
        error={!!errors?.baleNumber}
        helperText={errors?.baleNumber}
        sx={isMobile ? { width: "100%" } : { flex: 1.2, minWidth: 90 }}
      />

      <TextField
        label="Price"
        size="small"
        value={bale.price ?? ""}
        onChange={handleNumberChange("price")}
        error={!!errors?.price}
        helperText={errors?.price}
        inputProps={{ inputMode: "decimal" }}
        sx={isMobile ? { width: "100%" } : { flex: 1, minWidth: 80 }}
      />

      <TextField
        label="Qty"
        size="small"
        value={bale.quantity ?? ""}
        onChange={handleNumberChange("quantity")}
        error={!!errors?.quantity}
        helperText={errors?.quantity}
        inputProps={{ inputMode: "decimal" }}
        sx={isMobile ? { width: "100%" } : { flex: 0.8, minWidth: 70 }}
      />

      <TextField
        label="Quality"
        size="small"
        value={bale.quality ?? ""}
        onChange={handleTextChange("quality")}
        onBlur={handleTextBlur("quality")}
        error={!!errors?.quality}
        helperText={errors?.quality}
        sx={isMobile ? { width: "100%" } : { flex: 1.5, minWidth: 100 }}
      />

      <TextField
        label="Length"
        size="small"
        value={bale.length ?? ""}
        onChange={handleNumberChange("length")}
        error={!!errors?.length}
        helperText={errors?.length}
        inputProps={{ inputMode: "decimal" }}
        sx={isMobile ? { width: "100%" } : { flex: 0.7, minWidth: 70 }}
      />

      <GenericAutocomplete<Category>
        size="small"
        label="Category"
        options={categories}
        value={selectedCategory}
        onChange={(c) => onChange({ categoryID: c?.id })}
        allowCreate
        getOptionLabel={(c) => c.name}
        isOptionEqualToValue={(a, b) => a.id === b.id}
        onCreateClick={(name) =>
          setCreateDialog({ type: "category", prefillName: name })
        }
        error={errors?.categoryID}
        sx={isMobile ? { width: "100%" } : { flex: 2, minWidth: 140 }}
      />

      <GenericAutocomplete<SubCategory>
        size="small"
        label="Sub Category"
        options={subCategories}
        value={selectedSubCategory}
        onChange={(sc) => onChange({ subCategoryID: sc?.id })}
        allowCreate
        getOptionLabel={(sc) => sc.name}
        isOptionEqualToValue={(a, b) => a.id === b.id}
        onCreateClick={(name) =>
          setCreateDialog({ type: "subCategory", prefillName: name })
        }
        error={errors?.subCategoryID}
        sx={isMobile ? { width: "100%" } : { flex: 2, minWidth: 140 }}
      />

      <Tooltip title="Delete bale">
        <IconButton 
          color="error" 
          onClick={onDelete}
          sx={{ 
            bgcolor: alpha(theme.palette.error.main, 0.05),
            "&:hover": { bgcolor: alpha(theme.palette.error.main, 0.1) }
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      {/* Modals */}
      <CategoryFormModal
        open={createDialog.type === "category"}
        mode="create"
        onSubmit={createCategory}
        onClose={() => {
          setCreateDialog({ type: null, prefillName: "" });
          setCategoryErrors({});
        }}
        initialData={{ name: createDialog.prefillName, code: "" }}
        errors={categoryErrors}
        setErrors={setCategoryErrors}
      />

      <SubCategoryFormModal
        open={createDialog.type === "subCategory"}
        mode="create"
        onSubmit={createSubCategory}
        onClose={() => {
          setCreateDialog({ type: null, prefillName: "" });
          setSubCategoryErrors({});
        }}
        initialData={{ name: createDialog.prefillName }}
        errors={subCategoryErrors}
        setErrors={setSubCategoryErrors}
      />
    </Stack>
  );
}
