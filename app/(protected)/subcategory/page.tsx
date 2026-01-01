"use client";

import GenericTable from "@/app/components/shared/GenericTable";
import { Grid, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState } from "react";
import { useNotification } from "@/app/components/shared/NotificationProvider";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";
import { SubCategory } from "@/app/_types/SubCategory";
import SubCategoryFormModal, {
  SubCategoryFormData,
} from "@/app/components/shared/SubCategoryFormModal";
import {
  addSubCategory,
  fetchSubCategories,
  updateSubCategory,
} from "@/app/api/subCategory";
import AddIcon from '@mui/icons-material/Add';

export default function Page() {
  const { notify } = useNotification();

  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<SubCategory[]>([]);

  const [openModal, setOpenModal] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] =
    useState<SubCategory | null>(null);

  /* ---------------- Fetch Transports ---------------- */

  const loadSubCategories = async () => {
    try {
      const data = await fetchSubCategories(search);
      setRows(data);
    } catch (err) {
      notify("Error fetching sub categories", "error");
    }
  };

  useEffect(() => {
    loadSubCategories();
  }, [search]);

  /* ---------------- Add / Edit Handlers ---------------- */

  const handleAddSubCategory = () => {
    setSelectedSubCategory(null); // IMPORTANT
    setOpenModal(true);
  };

  const handleEditSubCategory = (subCategory: SubCategory) => {
    setSelectedSubCategory(subCategory);
    setOpenModal(true);
  };

  const handleSubCategorySubmit = async (data: SubCategoryFormData) => {
    try {
      if (selectedSubCategory) {
        // EDIT
        await updateSubCategory(selectedSubCategory.id, data);
        notify("SubCategory updated successfully", "success");
      } else {
        // CREATE
        await addSubCategory(data);
        notify("SubCategory created successfully", "success");
      }

      setOpenModal(false);
      setSelectedSubCategory(null);
      loadSubCategories();
    } catch (err: any) {
      console.error(err);
      notify(err?.response?.data ?? "Error saving sub category", "error");
    }
  };

  useEffect(() => {
    if (!openModal) {
      setSelectedSubCategory(null);
    }
  }, [openModal]);

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
          columns={[
            { id: "id", label: "ID", sortable: false },
            { id: "name", label: "Sub Category Name", sortable: false },
          ]}
          rowActions={[
            {
              label: "Edit",
              icon: () => (
                <IconButton size="small">
                  <EditIcon sx={{ color: "gray" }} />
                </IconButton>
              ),
              onClick: (row: SubCategory) => handleEditSubCategory(row),
            },
          ]}
          toolbarExtras={[
            <IconButton
              key="add-subcategory"
              onClick={handleAddSubCategory}
              title="Add SubCategory"
            >
              <AddIcon />
            </IconButton>,
          ]}
        />
      </Grid>

      {/* -------- SubCategory Modal (Create + Edit) -------- */}

      <SubCategoryFormModal
        open={openModal}
        mode={selectedSubCategory ? "edit" : "create"}
        initialData={
          selectedSubCategory
            ? {
                name: selectedSubCategory.name,
              }
            : undefined
        }
        onClose={() => {
          setOpenModal(false);
        }}
        onSubmit={handleSubCategorySubmit}
      />
    </Grid>
  );
}
