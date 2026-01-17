"use client";

import GenericTable from "@/app/components/shared/GenericTable";
import { Grid, IconButton } from "@mui/material";
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

export default function Page() {
  const { notify } = useNotification();
  const { showLoading, hideLoading } = useGlobalLoading();

  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<Item[]>([]);

  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

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
      showLoading();
      try {
        if (selectedItem) {
          await updateItem(selectedItem.id, data);
          notify("Item updated successfully", "success");
        } else {
          await addItem(data);
          notify("Item created successfully", "success");
        }

        setOpenModal(false);
        loadItems(search);
      } catch (err) {
        console.error(err);
        notify(normalizeError(err), "error");
      } finally {
        hideLoading();
      }
    },
    [selectedItem, notify, loadItems, search, showLoading, hideLoading]
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
      <IconButton key="add-item" onClick={handleAddItem} title="Add Item">
        <AddIcon />
      </IconButton>,
    ],
    [handleAddItem]
  );

  /* ---------------- Render ---------------- */

  return (
    <Grid container>
      <Grid size={12}>
        <GenericTable<Item>
          title="Items"
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
        initialData={
          selectedItem
            ? {
                name: selectedItem.name,
              }
            : undefined
        }
        onClose={() => setOpenModal(false)}
        onSubmit={handleItemSubmit}
      />
    </Grid>
  );
}
