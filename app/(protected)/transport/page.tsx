"use client";

import GenericTable from "@/app/components/shared/GenericTable";
import { Grid, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { useEffect, useState } from "react";
import { useNotification } from "@/app/components/shared/NotificationProvider";
import { Transport } from "../invoice/_types/transport";
import {
  fetchTransports,
  updateTransport,
  addTransport,
} from "@/app/api/transport";
import TransportFormModal, {
  TransportFormData,
} from "@/app/components/shared/TransportFormModal";

export default function Page() {
  const { notify } = useNotification();

  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<Transport[]>([]);

  const [openModal, setOpenModal] = useState(false);
  const [selectedTransport, setSelectedTransport] = useState<Transport | null>(
    null
  );

  /* ---------------- Fetch Transports ---------------- */

  const loadTransports = async () => {
    try {
      const data = await fetchTransports({ search });
      setRows(data);
    } catch (err) {
      notify("Error fetching transports", "error");
    }
  };

  useEffect(() => {
    loadTransports();
  }, [search]);

  /* ---------------- Add / Edit Handlers ---------------- */

  const handleAddTransport = () => {
    setSelectedTransport(null); // IMPORTANT
    setOpenModal(true);
  };

  const handleEditTransport = (transport: Transport) => {
    setSelectedTransport(transport);
    setOpenModal(true);
  };

  const handleTransportSubmit = async (data: TransportFormData) => {
    try {
      if (selectedTransport) {
        // EDIT
        await updateTransport(selectedTransport.id, data);
        notify("Transport updated successfully", "success");
      } else {
        // CREATE
        await addTransport(data);
        notify("Transport created successfully", "success");
      }

      setOpenModal(false);
      setSelectedTransport(null);
      loadTransports();
    } catch (err: any) {
      console.error(err);
      notify(err?.response?.data ?? "Error saving transport", "error");
    }
  };

  useEffect(() => {
    if (!openModal) {
      setSelectedTransport(null);
    }
  }, [openModal]);

  /* ---------------- Render ---------------- */

  return (
    <Grid container>
      <Grid size={12}>
        <GenericTable<Transport>
          title="Transports"
          rows={rows}
          pagination={false}
          totalCount={rows.length}
          searchPlacedHolder="Search Transports..."
          searchValue={search}
          onSearchChange={setSearch}
          columns={[
            { id: "id", label: "ID", sortable: false },
            { id: "name", label: "Transport Name", sortable: false },
          ]}
          rowActions={[
            {
              label: "Edit",
              icon: () => (
                <IconButton size="small">
                  <EditIcon sx={{ color: "gray" }} />
                </IconButton>
              ),
              onClick: (row: Transport) => handleEditTransport(row),
            },
          ]}
          toolbarExtras={[
            <IconButton
              key="add-transport"
              onClick={handleAddTransport}
              title="Add Transport"
            >
              <PersonAddAlt1Icon />
            </IconButton>,
          ]}
        />
      </Grid>

      {/* -------- Transport Modal (Create + Edit) -------- */}

      <TransportFormModal
        open={openModal}
        mode={selectedTransport ? "edit" : "create"}
        initialData={
          selectedTransport
            ? {
                name: selectedTransport.name,
              }
            : undefined
        }
        onClose={() => {
          setOpenModal(false);
        }}
        onSubmit={handleTransportSubmit}
      />
    </Grid>
  );
}
