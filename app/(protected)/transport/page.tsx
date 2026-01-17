"use client";

import GenericTable from "@/app/components/shared/GenericTable";
import { Grid, IconButton, CircularProgress, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  const [rows, setRows] = useState<Transport[]>([]);

  const [openModal, setOpenModal] = useState(false);
  const [selectedTransport, setSelectedTransport] = useState<Transport | null>(
    null
  );

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /* ---------------- Fetch Transports ---------------- */

  const loadTransports = useCallback(
    async (query: string) => {
      showLoading();
      try {
        const data = await fetchTransports({ search: query });
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
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => loadTransports(search), 400);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [search, loadTransports]);

  /* ---------------- Add / Edit ---------------- */

  const handleAddTransport = useCallback(() => {
    setSelectedTransport(null);
    setOpenModal(true);
  }, []);

  const handleEditTransport = useCallback((transport: Transport) => {
    setSelectedTransport(transport);
    setOpenModal(true);
  }, []);

  const handleTransportSubmit = useCallback(
    async (data: TransportFormData) => {
      try {
        if (selectedTransport) {
          await updateTransport(selectedTransport.id, data);
          notify("Transport updated successfully", "success");
        } else {
          await addTransport(data);
          notify("Transport created successfully", "success");
        }
        setOpenModal(false);
        loadTransports(search);
      } catch (err: any) {
        console.error(err);
        notify(normalizeError(err), "error");
      }
    },
    [selectedTransport, notify, loadTransports, search]
  );

  /* ---------------- Memoized Table Config ---------------- */

  const columns = useMemo(
    () => [
      { id: "id", label: "ID", sortable: false },
      { id: "name", label: "Transport Name", sortable: false },
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
        onClick: (row: Transport) => handleEditTransport(row),
      },
    ],
    [handleEditTransport]
  );

  const toolbarExtras = useMemo(
    () => [
      <IconButton
        key="add-transport"
        onClick={handleAddTransport}
        title="Add Transport"
      >
        <AddIcon />
      </IconButton>,
    ],
    [handleAddTransport]
  );

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
          columns={columns}
          rowActions={rowActions}
          toolbarExtras={toolbarExtras}
        />
      </Grid>

      {/* -------- Transport Modal (Create + Edit) -------- */}
      <TransportFormModal
        open={openModal}
        mode={selectedTransport ? "edit" : "create"}
        initialData={
          selectedTransport ? { name: selectedTransport.name } : undefined
        }
        onClose={() => setOpenModal(false)}
        onSubmit={handleTransportSubmit}
      />
    </Grid>
  );
}
