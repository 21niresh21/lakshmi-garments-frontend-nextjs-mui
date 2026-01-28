"use client";

import GenericTable from "@/app/components/shared/GenericTable";
import {
  Grid,
  IconButton,
  CircularProgress,
  Box,
  Stack,
  Typography,
  Chip,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNotification } from "@/app/components/shared/NotificationProvider";
import { Transport } from "../invoices/_types/transport";
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

export type TransportErrors = {
  name?: string;
};

export default function Page() {
  const { notify } = useNotification();
  const { showLoading, hideLoading } = useGlobalLoading();

  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<Transport[]>([]);

  const [openModal, setOpenModal] = useState(false);
  const [selectedTransport, setSelectedTransport] = useState<Transport | null>(
    null,
  );
  const [errors, setErrors] = useState<TransportErrors>({});

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
    [notify, showLoading, hideLoading],
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
        setErrors({});
        loadTransports(search);
      } catch (err: any) {
        if (err.validationErrors) {
          setErrors(err.validationErrors);
        } else if (err.message && err.message !== "Validation failed") {
          notify(err.message || normalizeError(err), "error");
        }
      }
    },
    [selectedTransport, notify, loadTransports, search],
  );

  /* ---------------- Memoized Table Config ---------------- */

  const columns = useMemo(
    () => [
      { id: "id", label: "ID", sortable: false },
      { id: "name", label: "Transport Name", sortable: false },
    ],
    [],
  );

  const rowActions = useMemo(
    () => [
      {
        label: "Edit",
        icon: () => (
          <Tooltip title="Edit Transport">
            <IconButton size="small">
              <EditIcon sx={{ color: "gray" }} />
            </IconButton>
          </Tooltip>
        ),
        onClick: (row: Transport) => handleEditTransport(row),
      },
    ],
    [handleEditTransport],
  );

  const toolbarExtras = useMemo(
    () => [
      <Tooltip key="add-transport" title="Add Transport">
        <IconButton onClick={handleAddTransport}>
          <AddIcon />
        </IconButton>
      </Tooltip>,
    ],
    [handleAddTransport],
  );

  const transportInitialData = useMemo(
    () => (selectedTransport ? { name: selectedTransport.name } : undefined),
    [selectedTransport],
  );

  /* ---------------- Render ---------------- */

  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          sx={{ mb: 0.5, mx: 1 }}
        >
          <Typography variant="h4" fontWeight={600}>
            Transports
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
        <GenericTable<Transport>
          title="Transports"
          rows={rows}
          pagination={false}
          totalCount={rows.length}
          searchPlacedHolder="Search Transports"
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
        initialData={transportInitialData}
        errors={errors}
        setErrors={setErrors}
        onClose={() => {
          setOpenModal(false);
          setErrors({});
        }}
        onSubmit={handleTransportSubmit}
      />
    </Grid>
  );
}
