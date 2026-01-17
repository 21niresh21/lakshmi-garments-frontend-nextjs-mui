"use client";

import GenericTable from "@/app/components/shared/GenericTable";
import { Grid, IconButton, CircularProgress, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { useGlobalLoading } from "@/app/components/layout/LoadingProvider";

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
  const [rows, setRows] = useState<Supplier[]>([]);

  const [openModal, setOpenModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null
  );

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /* ---------------- Fetch Suppliers ---------------- */

  const loadSuppliers = useCallback(
    async (query: string) => {
      showLoading();
      try {
        const data = await fetchSuppliers({ search: query });
        setRows(data);
      } catch (err) {
        notify(normalizeError(err), "error");
      } finally {
        hideLoading();
      }
    },
    [notify]
  );

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      loadSuppliers(search);
    }, 400);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [search, loadSuppliers]);

  /* ---------------- Add / Edit ---------------- */

  const handleAddSupplier = useCallback(() => {
    setSelectedSupplier(null);
    setOpenModal(true);
  }, []);

  const handleEditSupplier = useCallback((supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setOpenModal(true);
  }, []);

  const handleSupplierSubmit = useCallback(
    async (data: SupplierFormData) => {
      try {
        if (selectedSupplier) {
          await updateSupplier(selectedSupplier.id, data);
          notify("Supplier updated successfully", "success");
        } else {
          await addSupplier(data);
          notify("Supplier created successfully", "success");
        }

        setOpenModal(false);
        setSelectedSupplier(null);
        loadSuppliers(search);
      } catch (err) {
        notify(normalizeError(err), "error");
      }
    },
    [selectedSupplier, notify, loadSuppliers, search]
  );

  /* ---------------- Memoized Table Config ---------------- */

  const columns = useMemo(
    () => [
      { id: "id", label: "ID", sortable: false },
      { id: "name", label: "Supplier Name", sortable: false },
      { id: "location", label: "Location", sortable: false },
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
        onClick: (row: Supplier) => handleEditSupplier(row),
      },
    ],
    [handleEditSupplier]
  );

  const toolbarExtras = useMemo(
    () => [
      <IconButton
        key="add-supplier"
        onClick={handleAddSupplier}
        title="Add Supplier"
      >
        <PersonAddAlt1Icon />
      </IconButton>,
    ],
    [handleAddSupplier]
  );

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
          columns={columns}
          rowActions={rowActions}
          toolbarExtras={toolbarExtras}
        />
      </Grid>

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
