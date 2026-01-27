"use client";

import GenericTable from "@/app/components/shared/GenericTable";
import { Chip, Grid, IconButton, Stack, Typography, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNotification } from "@/app/components/shared/NotificationProvider";
import { Item } from "@/app/_types/Item";
import { addItem, fetchItems, updateItem } from "@/app/api/itemApi";
import ItemFormModal, {
  ItemFormData,
} from "@/app/components/shared/ItemFormModal";
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

export type ItemErrors = {
  name?: string;
};

export default function Page() {
  const { notify } = useNotification();
  const { showLoading, hideLoading } = useGlobalLoading();

  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<Item[]>([]);

  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [errors, setErrors] = useState<ItemErrors>({});

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /* ---------------- Fetch Items ---------------- */

  const loadItems = useCallback(
    async (query: string) => {
      showLoading();
      try {
        const data = await fetchItems({ search: query });
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

    searchTimeoutRef.current = setTimeout(() => loadItems(search), 400);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [search, loadItems]);

  /* ---------------- Add / Edit ---------------- */

  const handleAddItem = useCallback(() => {
    setSelectedItem(null);
    setOpenModal(true);
  }, []);

  const handleEditItem = useCallback((item: Item) => {
    setSelectedItem(item);
    setOpenModal(true);
  }, []);

  const handleItemSubmit = useCallback(
    async (data: ItemFormData) => {
      try {
        if (selectedItem) {
          await updateItem(selectedItem.id, data);
          notify("Item updated successfully", "success");
        } else {
          await addItem(data);
          notify("Item created successfully", "success");
        }

        setOpenModal(false);
        setErrors({});
        loadItems(search);
      } catch (err: any) {
        if (err.validationErrors) {
          setErrors(err.validationErrors);
        } else if (err.message && err.message !== "Validation failed") {
          notify(err.message || normalizeError(err), "error");
        }
      }
    },
    [selectedItem, notify, loadItems, search]
  );

  /* ---------------- Memoized Table Config ---------------- */

  const columns = useMemo(
    () => [
      { id: "id", label: "ID", sortable: false },
      { id: "name", label: "Item Name", sortable: false },
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
        onClick: (row: Item) => handleEditItem(row),
      },
    ],
    [handleEditItem]
  );

  const toolbarExtras = useMemo(
    () => [
      <Tooltip key="add-item" title="Add Item">
        <IconButton onClick={handleAddItem}>
          <AddIcon />
        </IconButton>
      </Tooltip>,
    ],
    [handleAddItem]
  );

  const itemInitialData = useMemo(
    () => (selectedItem ? { name: selectedItem.name } : undefined),
    [selectedItem]
  );

  /* ---------------- Render ---------------- */

  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 0.5, mx : 1 }}>
          <Typography variant="h4" fontWeight={600}>
            Items
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
        <GenericTable<Item>
          rows={rows}
          pagination={false}
          totalCount={rows.length}
          searchPlacedHolder="Search Items..."
          searchValue={search}
          onSearchChange={setSearch}
          columns={columns}
          rowActions={rowActions}
          toolbarExtras={toolbarExtras}
        />
      </Grid>

      {/* -------- Item Modal (Create + Edit) -------- */}

      <ItemFormModal
        open={openModal}
        mode={selectedItem ? "edit" : "create"}
        initialData={itemInitialData}
        errors={errors}
        setErrors={setErrors}
        onClose={() => {
          setOpenModal(false);
          setErrors({});
        }}
        onSubmit={handleItemSubmit}
      />
    </Grid>
  );
}
