"use client";

import GenericTable from "@/app/components/shared/GenericTable";
import { Grid, IconButton, CircularProgress, Box, Stack, Typography, Chip, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNotification } from "@/app/components/shared/NotificationProvider";
import { Supplier } from "../invoices/_types/supplier";
import {
  fetchSuppliers,
  updateSupplier,
  addSupplier,
} from "@/app/api/supplier";
import SupplierFormModal, {
  SupplierFormData,
} from "@/app/components/shared/SupplierFormModal";
import { useGlobalLoading } from "@/app/components/layout/LoadingProvider";

export type SupplierErrors = {
  name?: string;
  location?: string;
};

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
  const [errors, setErrors] = useState<SupplierErrors>({});

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
    [notify, showLoading, hideLoading]
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
        setErrors({});
        loadSuppliers(search);
      } catch (err: any) {
        if (err.validationErrors) {
          console.log(err.validationErrors);
          setErrors(err.validationErrors);
        } else if (err.message && err.message !== "Validation failed") {
          notify(err.message || normalizeError(err), "error");
        }
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
      <Tooltip key="add-supplier" title="Add Supplier">
        <IconButton
          onClick={handleAddSupplier}
        >
          <PersonAddAlt1Icon />
        </IconButton>
      </Tooltip>,
    ],
    [handleAddSupplier]
  );

  const supplierInitialData = useMemo(
    () =>
      selectedSupplier
        ? {
            name: selectedSupplier.name,
            location: selectedSupplier.location,
          }
        : undefined,
    [selectedSupplier]
  );

  /* ---------------- Render ---------------- */

  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 0.5, mx : 1 }}>
          <Typography variant="h4" fontWeight={600}>
            Suppliers
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
        initialData={supplierInitialData}
        errors={errors}
        setErrors={setErrors}
        onClose={() => {
          setOpenModal(false);
          setErrors({});
        }}
        onSubmit={handleSupplierSubmit}
      />
    </Grid>
  );
}
