"use client";

import GenericTable from "@/app/components/shared/GenericTable";
import { Grid, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNotification } from "@/app/components/shared/NotificationProvider";
import { SubCategory } from "@/app/_types/SubCategory";
import SubCategoryFormModal, {
  SubCategoryFormData,
} from "@/app/components/shared/SubCategoryFormModal";
import {
  addSubCategory,
  fetchSubCategories,
  updateSubCategory,
} from "@/app/api/subCategory";
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

export default function Page() {
  const { notify } = useNotification();
  const { showLoading, hideLoading } = useGlobalLoading();

  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<SubCategory[]>([]);

  const [openModal, setOpenModal] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] =
    useState<SubCategory | null>(null);

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /* ---------------- Fetch SubCategories ---------------- */

  const loadSubCategories = useCallback(
    async (query: string) => {
      showLoading();
      try {
        const data = await fetchSubCategories(query);
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

    searchTimeoutRef.current = setTimeout(() => loadSubCategories(search), 400);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [search, loadSubCategories]);

  /* ---------------- Add / Edit ---------------- */

  const handleAddSubCategory = useCallback(() => {
    setSelectedSubCategory(null);
    setOpenModal(true);
  }, []);

  const handleEditSubCategory = useCallback((subCategory: SubCategory) => {
    setSelectedSubCategory(subCategory);
    setOpenModal(true);
  }, []);

  const handleSubCategorySubmit = useCallback(
    async (data: SubCategoryFormData) => {
      showLoading();
      try {
        if (selectedSubCategory) {
          await updateSubCategory(selectedSubCategory.id, data);
          notify("SubCategory updated successfully", "success");
        } else {
          await addSubCategory(data);
          notify("SubCategory created successfully", "success");
        }

        setOpenModal(false);
        loadSubCategories(search);
      } catch (err) {
        console.error(err);
        notify(normalizeError(err), "error");
      } finally {
        hideLoading();
      }
    },
    [
      selectedSubCategory,
      notify,
      loadSubCategories,
      search,
      showLoading,
      hideLoading,
    ]
  );

  /* ---------------- Memoized Table Config ---------------- */

  const columns = useMemo(
    () => [
      { id: "id", label: "ID", sortable: false },
      { id: "name", label: "Sub Category Name", sortable: false },
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
        onClick: (row: SubCategory) => handleEditSubCategory(row),
      },
    ],
    [handleEditSubCategory]
  );

  const toolbarExtras = useMemo(
    () => [
      <IconButton
        key="add-subcategory"
        onClick={handleAddSubCategory}
        title="Add SubCategory"
      >
        <AddIcon />
      </IconButton>,
    ],
    [handleAddSubCategory]
  );

  /* ---------------- Render ---------------- */

  return (
    <Grid container>
      <Grid size={12}>
        <GenericTable<SubCategory>
          title="Sub Categories"
          rows={rows}
          pagination={false}
          totalCount={rows.length}
          searchPlacedHolder="Search Sub Categories..."
          searchValue={search}
          onSearchChange={setSearch}
          columns={columns}
          rowActions={rowActions}
          toolbarExtras={toolbarExtras}
        />
      </Grid>

      {/* -------- SubCategory Modal (Create + Edit) -------- */}

      <SubCategoryFormModal
        open={openModal}
        mode={selectedSubCategory ? "edit" : "create"}
        initialData={
          selectedSubCategory ? { name: selectedSubCategory.name } : undefined
        }
        onClose={() => setOpenModal(false)}
        onSubmit={handleSubCategorySubmit}
      />
    </Grid>
  );
}
