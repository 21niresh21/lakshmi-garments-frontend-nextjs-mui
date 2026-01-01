"use client";

import GenericTable from "@/app/components/shared/GenericTable";
import { Grid, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { useEffect, useState } from "react";
import { useNotification } from "@/app/components/shared/NotificationProvider";
import SupplierFormModal, {
  SupplierFormData,
} from "@/app/components/shared/SupplierFormModal";
import CategoryFormModal, {
  CategoryFormData,
} from "@/app/components/shared/CategoryFormModal";
import {
  addCategory,
  fetchCategories,
  updateCategory,
} from "@/app/api/category";
import { Category } from "@/app/_types/Category";
import AddIcon from "@mui/icons-material/Add";

export default function Page() {
  const { notify } = useNotification();

  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<Category[]>([]);

  const [openModal, setOpenModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  /* ---------------- Fetch Suppliers ---------------- */

  const loadCategories = async () => {
    try {
      const data = await fetchCategories(search);
      setRows(data);
    } catch (err) {
      notify("Error fetching categories", "error");
    }
  };

  useEffect(() => {
    loadCategories();
  }, [search]);

  /* ---------------- Add / Edit Handlers ---------------- */

  const handleAddCategory = () => {
    setSelectedCategory(null); // IMPORTANT
    setOpenModal(true);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setOpenModal(true);
  };

  const handleCategorySubmit = async (data: CategoryFormData) => {
    try {
      if (selectedCategory) {
        // EDIT
        await updateCategory(selectedCategory.id, data);
        notify("Category updated successfully", "success");
      } else {
        // CREATE
        await addCategory(data);
        notify("Category created successfully", "success");
      }

      setOpenModal(false);
      setSelectedCategory(null);
      loadCategories();
    } catch (err: any) {
      console.error(err);
      notify(err?.response?.data ?? "Error saving supplier", "error");
    }
  };

  useEffect(() => {
    if (!openModal) {
      setSelectedCategory(null);
    }
  }, [openModal]);

  /* ---------------- Render ---------------- */

  return (
    <Grid container>
      <Grid size={12}>
        <GenericTable<Category>
          title="Categories"
          rows={rows}
          pagination={false}
          totalCount={rows.length}
          searchPlacedHolder="Search Categories..."
          searchValue={search}
          onSearchChange={setSearch}
          columns={[
            { id: "id", label: "ID", sortable: false },
            { id: "name", label: "Category Name", sortable: false },
            { id: "code", label: "Code", sortable: false },
          ]}
          rowActions={[
            {
              label: "Edit",
              icon: () => (
                <IconButton size="small">
                  <EditIcon sx={{ color: "gray" }} />
                </IconButton>
              ),
              onClick: (row: Category) => handleEditCategory(row),
            },
          ]}
          toolbarExtras={[
            <IconButton
              key="add-category"
              onClick={handleAddCategory}
              title="Add Category"
            >
              <AddIcon />
            </IconButton>,
          ]}
        />
      </Grid>

      {/* -------- Category Modal (Create + Edit) -------- */}

      <CategoryFormModal
        open={openModal}
        mode={selectedCategory ? "edit" : "create"}
        initialData={
          selectedCategory
            ? {
                name: selectedCategory.name,
                code: selectedCategory.code,
              }
            : undefined
        }
        onClose={() => {
          setOpenModal(false);
        }}
        onSubmit={handleCategorySubmit}
      />
    </Grid>
  );
}
