"use client";

import GenericTable from "@/app/components/shared/GenericTable";
import { Grid, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { useEffect, useState } from "react";
import { useNotification } from "@/app/components/shared/NotificationProvider";
import { Supplier } from "../invoice/_types/supplier";
import {
  fetchSuppliers,
  updateSupplier,
  addSupplier,
} from "@/app/api/supplier";
import SupplierFormModal, {
  SupplierFormData,
} from "@/app/components/shared/SupplierFormModal";

export default function Page() {
  const { notify } = useNotification();

  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<Supplier[]>([]);

  const [openModal, setOpenModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null
  );

  /* ---------------- Fetch Suppliers ---------------- */

  const loadSuppliers = async () => {
    try {
      const data = await fetchSuppliers({ search });
      setRows(data);
    } catch (err) {
      notify("Error fetching suppliers", "error");
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, [search]);

  /* ---------------- Add / Edit Handlers ---------------- */

  const handleAddSupplier = () => {
    setSelectedSupplier(null); // IMPORTANT
    setOpenModal(true);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setOpenModal(true);
  };

  const handleSupplierSubmit = async (data: SupplierFormData) => {
    try {
      if (selectedSupplier) {
        // EDIT
        await updateSupplier(selectedSupplier.id, data);
        notify("Supplier updated successfully", "success");
      } else {
        // CREATE
        await addSupplier(data);
        notify("Supplier created successfully", "success");
      }

      setOpenModal(false);
      setSelectedSupplier(null);
      loadSuppliers();
    } catch (err: any) {
      console.error(err);
      notify(err?.response?.data ?? "Error saving supplier", "error");
    }
  };

  useEffect(() => {
    if (!openModal) {
      setSelectedSupplier(null);
    }
  }, [openModal]);

  /* ---------------- Render ---------------- */

  return (
    <Grid container>
      <Grid size={12}>
        <GenericTable<Supplier>
          title="Suppliers"
          rows={rows}
          pagination={false}
          totalCount={rows.length}
          searchPlacedHolder="Search Suppliers..."
          searchValue={search}
          onSearchChange={setSearch}
          columns={[
            { id: "id", label: "ID", sortable: false },
            { id: "name", label: "Supplier Name", sortable: false },
            { id: "location", label: "Location", sortable: false },
          ]}
          rowActions={[
            {
              label: "Edit",
              icon: () => (
                <IconButton size="small">
                  <EditIcon sx={{ color: "gray" }} />
                </IconButton>
              ),
              onClick: (row: Supplier) => handleEditSupplier(row),
            },
          ]}
          toolbarExtras={[
            <IconButton
              key="add-supplier"
              onClick={handleAddSupplier}
              title="Add Supplier"
            >
              <PersonAddAlt1Icon />
            </IconButton>,
          ]}
        />
      </Grid>

      {/* -------- Supplier Modal (Create + Edit) -------- */}

      <SupplierFormModal
        open={openModal}
        mode={selectedSupplier ? "edit" : "create"}
        initialData={
          selectedSupplier
            ? {
                name: selectedSupplier.name,
                location: selectedSupplier.location,
              }
            : undefined
        }
        onClose={() => {
          setOpenModal(false);
        }}
        onSubmit={handleSupplierSubmit}
      />
    </Grid>
  );
}
