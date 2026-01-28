"use client";

import GenericTable from "@/app/components/shared/GenericTable";
import { Chip, Grid, IconButton, Stack, Typography, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNotification } from "@/app/components/shared/NotificationProvider";
import CategoryFormModal, {
  CategoryFormData,
} from "@/app/components/shared/CategoryFormModal";
import {
  addCategory,
  fetchCategories,
  updateCategory,
} from "@/app/api/category";
import { Category } from "@/app/_types/Category";
import { useGlobalLoading } from "@/app/components/layout/LoadingProvider";

/* ---------------- Error Normalizer ---------------- */

function normalizeError(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as any).response?.data === "string"
  ) {
    return (error as any).response.data;
  }
  return "Something went wrong. Please try again.";
}

export type CategoryErrors = {
  name?: string;
  code?: string;
};

export default function Page() {
  const { notify } = useNotification();
  const { showLoading, hideLoading } = useGlobalLoading();

  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<Category[]>([]);

  const [openModal, setOpenModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [errors, setErrors] = useState<CategoryErrors>({});

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /* ---------------- Fetch Categories ---------------- */

  const loadCategories = useCallback(
    async (query: string) => {
      showLoading();
      try {
        const data = await fetchCategories(query);
        setRows(data ?? []);
      } catch (err) {
        notify(normalizeError(err), "error");
      } finally {
        hideLoading();
      }
    },
    [notify, showLoading, hideLoading]
  );

  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    searchTimeoutRef.current = setTimeout(() => loadCategories(search), 400);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [search, loadCategories]);

  /* ---------------- Add / Edit ---------------- */

  const handleAddCategory = useCallback(() => {
    setSelectedCategory(null);
    setOpenModal(true);
  }, []);

  const handleEditCategory = useCallback((category: Category) => {
    setSelectedCategory(category);
    setOpenModal(true);
  }, []);

  const handleCategorySubmit = useCallback(
    async (data: CategoryFormData) => {
      try {
        if (selectedCategory) {
          await updateCategory(selectedCategory.id, data);
          notify("Category updated successfully", "success");
        } else {
          await addCategory(data);
          notify("Category created successfully", "success");
        }

        setOpenModal(false);
        setErrors({});
        loadCategories(search);
      } catch (err: any) {
        if (err.validationErrors) {
          setErrors(err.validationErrors);
        } else if (err.message && err.message !== "Validation failed") {
          notify(err.message || normalizeError(err), "error");
        }
      }
    },
    [selectedCategory, notify, loadCategories, search]
  );

  /* ---------------- Memoized Table Config ---------------- */

  const columns = useMemo(
    () => [
      { id: "id", label: "ID", sortable: false },
      { id: "name", label: "Category Name", sortable: false },
      { id: "code", label: "Code", sortable: false },
    ],
    []
  );

  const rowActions = useMemo(
    () => [
      {
        label: "Edit",
        icon: () => (
          <IconButton size="small">
            <EditIcon sx={{ color: "gray" }} />
          </IconButton>
        ),
        onClick: (row: Category) => handleEditCategory(row),
      },
    ],
    [handleEditCategory]
  );

  const toolbarExtras = useMemo(
    () => [
      <Tooltip key="add-category" title="Add Category">
        <IconButton
          onClick={handleAddCategory}
        >
          <AddIcon />
        </IconButton>
      </Tooltip>,
    ],
    [handleAddCategory]
  );

  const categoryInitialData = useMemo(
    () =>
      selectedCategory
        ? {
            name: selectedCategory.name,
            code: selectedCategory.code,
          }
        : undefined,
    [selectedCategory]
  );

  /* ---------------- Render ---------------- */

  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 0.5, mx : 1 }}>
          <Typography variant="h4" fontWeight={600}>
            Categories
          </Typography>
          <Chip 
            label={`${rows.length}`} 
            size="small" 
            color="primary" 
            sx={{ fontWeight: 700 }}
          />
        </Stack>
      </Grid>
      <Grid size={12}>
        <GenericTable<Category>
          rows={rows}
          pagination={false}
          totalCount={rows.length}
          showSearch={true}
          searchPlacedHolder="Search Categories"
          searchValue={search}
          onSearchChange={setSearch}
          columns={columns}
          rowActions={rowActions}
          toolbarExtras={toolbarExtras}
        />
      </Grid>

      {/* -------- Category Modal (Create + Edit) -------- */}

      <CategoryFormModal
        open={openModal}
        mode={selectedCategory ? "edit" : "create"}
        initialData={categoryInitialData}
        errors={errors}
        setErrors={setErrors}
        onClose={() => {
          setOpenModal(false);
          setErrors({});
        }}
        onSubmit={handleCategorySubmit}
      />
    </Grid>
  );
}
