"use client";

import GenericTable from "@/app/components/shared/GenericTable";
import { Grid, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState } from "react";
import { useNotification } from "@/app/components/shared/NotificationProvider";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";
import { Item } from "@/app/_types/Item";
import { addItem, fetchItems, updateItem } from "@/app/api/itemApi";
import ItemFormModal, {
  ItemFormData,
} from "@/app/components/shared/ItemFormModal";
import AddIcon from '@mui/icons-material/Add';

export default function Page() {
  const { notify } = useNotification();

  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<Item[]>([]);

  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  /* ---------------- Fetch Transports ---------------- */

  const loadItems = async () => {
    try {
      const data = await fetchItems({ search });
      setRows(data);
    } catch (err) {
      notify("Error fetching items", "error");
    }
  };

  useEffect(() => {
    loadItems();
  }, [search]);

  /* ---------------- Add / Edit Handlers ---------------- */

  const handleAddItem = () => {
    setSelectedItem(null); // IMPORTANT
    setOpenModal(true);
  };

  const handleEditItem = (item: Item) => {
    setSelectedItem(item);
    setOpenModal(true);
  };

  const handleItemSubmit = async (data: ItemFormData) => {
    try {
      if (selectedItem) {
        // EDIT
        await updateItem(selectedItem.id, data);
        notify("Item updated successfully", "success");
      } else {
        // CREATE
        await addItem(data);
        notify("Item created successfully", "success");
      }

      setOpenModal(false);
      setSelectedItem(null);
      loadItems();
    } catch (err: any) {
      console.error(err);
      notify(err?.response?.data ?? "Error saving item", "error");
    }
  };

  useEffect(() => {
    if (!openModal) {
      setSelectedItem(null);
    }
  }, [openModal]);

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
          columns={[
            { id: "id", label: "ID", sortable: false },
            { id: "name", label: "Item Name", sortable: false },
          ]}
          rowActions={[
            {
              label: "Edit",
              icon: () => (
                <IconButton size="small">
                  <EditIcon sx={{ color: "gray" }} />
                </IconButton>
              ),
              onClick: (row: Item) => handleEditItem(row),
            },
          ]}
          toolbarExtras={[
            <IconButton key="add-item" onClick={handleAddItem} title="Add Item">
              <AddIcon />
            </IconButton>,
          ]}
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
        onClose={() => {
          setOpenModal(false);
        }}
        onSubmit={handleItemSubmit}
      />
    </Grid>
  );
}
