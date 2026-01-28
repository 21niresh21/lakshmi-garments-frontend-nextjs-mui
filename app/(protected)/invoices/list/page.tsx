"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Grid,
  Chip,
  IconButton,
  Badge,
  Stack,
  Tooltip,
  useMediaQuery,
  useTheme,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReportIcon from "@mui/icons-material/Report";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

import GenericTable from "@/app/components/shared/GenericTable";
import InvoiceFormModal from "@/app/components/shared/InvoiceFormModal";
import InvoiceFilter, { InvoiceFilterType } from "./InvoiceFilter";

import { fetchInvoices, updateInvoice } from "@/app/api/invoiceApi";
import { fetchSuppliers } from "@/app/api/supplier";
import { fetchTransports } from "@/app/api/transport";
import { useNotification } from "@/app/components/shared/NotificationProvider";

import { Supplier } from "../_types/supplier";
import { Transport } from "../_types/transport";
import { InvoiceDetails } from "../_types/invoiceDetails";
import { INITIAL_INVOICE, InvoiceErrors } from "../create/invoice.types";
import { formatToShortDate } from "@/app/utils/date";
import { useGlobalLoading } from "@/app/components/layout/LoadingProvider";

/* -------------------------------------------------------------------------- */
/* Utils                                                                      */
/* -------------------------------------------------------------------------- */

const toISODate = (date: string) => {
  const [dd, mm, yyyy] = date.split("-");
  return `${yyyy}-${mm}-${dd}`;
};

const toBackendDate = (date?: string) => (date ? toISODate(date) : undefined);

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function Page() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();
  const { notify } = useNotification();
  const { loading, showLoading, hideLoading } = useGlobalLoading();

  /* ----------------------------- Table State ----------------------------- */

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortBy, setSortBy] = useState<string>("invoiceDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [rows, setRows] = useState<InvoiceDetails[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  /* ----------------------------- Search (Debounced) ----------------------------- */

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  /* ----------------------------- Filters ----------------------------- */

  const [filters, setFilters] = useState<InvoiceFilterType>({
    supplierNames: [],
    transportNames: [],
    isPaid: [],
    invoiceStartDate: "",
    invoiceEndDate: "",
    receivedStartDate: "",
    receivedEndDate: "",
  });

  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLElement | null>(
    null,
  );

  const isFilterOpen = Boolean(filterAnchorEl);

  const activeFilterCount = useMemo(() => {
    return (
      filters.supplierNames.length +
      filters.transportNames.length +
      filters.isPaid.length +
      (filters.invoiceStartDate || filters.invoiceEndDate ? 1 : 0)
    );
  }, [filters]);

  /* ----------------------------- Modal State ----------------------------- */

  const [openModal, setOpenModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] =
    useState<InvoiceDetails>(INITIAL_INVOICE);
  const [invoiceErrors, setInvoiceErrors] = useState<InvoiceErrors>({});

  /* ----------------------------- Lookup Data ----------------------------- */

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [transports, setTransports] = useState<Transport[]>([]);

  /* -------------------------------------------------------------------------- */
  /* Columns                                                                    */
  /* -------------------------------------------------------------------------- */

  const columns = useMemo(
    () => [
      {
        id: "invoiceNumber",
        label: "Invoice Number",
        sortable: true,
      },
      {
        id: "invoiceDate",
        label: "Invoice Date",
        sortable: true,
        render: (row: InvoiceDetails) => formatToShortDate(row.invoiceDate),
      },
      {
        id: "receivedDate",
        label: "Received Date",
        sortable: true,
        render: (row: InvoiceDetails) => formatToShortDate(row.receivedDate),
      },
      { id: "supplierName", label: "Supplier" },
      { id: "transportName", label: "Transport" },
      { id: "transportCost", label: "Transport Cost", sortable: true },
      {
        id: "isTransportPaid",
        label: "Payment Status",
        render: (row: InvoiceDetails) => (
          <Chip
            size="small"
            icon={
              row.isTransportPaid ? (
                <CheckCircleIcon color="success" />
              ) : (
                <ReportIcon color="error" />
              )
            }
            label={row.isTransportPaid ? "Paid" : "Unpaid"}
          />
        ),
      },
    ],
    [],
  );

  /* -------------------------------------------------------------------------- */
  /* Data Fetching                                                              */
  /* -------------------------------------------------------------------------- */

  const loadInvoices = useCallback(async () => {
    showLoading();
    try {
      const data = await fetchInvoices({
        pageNo: page,
        pageSize: rowsPerPage,
        sortBy,
        sortOrder,
        search: debouncedSearch,
        supplierNames: filters.supplierNames,
        transportNames: filters.transportNames,
        isPaid: filters.isPaid,
        invoiceStartDate: toBackendDate(filters.invoiceStartDate),
        invoiceEndDate: toBackendDate(filters.invoiceEndDate),
        receivedStartDate: toBackendDate(filters.receivedStartDate),
        receivedEndDate: toBackendDate(filters.receivedEndDate),
      });

      setRows(data.content);
      setTotalCount(data.totalElements);
    } catch (err) {
      console.error(err);
      notify("Error loading invoices", "error");
    } finally {
      hideLoading();
    }
  }, [page, rowsPerPage, sortBy, sortOrder, debouncedSearch, filters, notify]);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  /* -------------------------------------------------------------------------- */
  /* Initial Lookup Data                                                        */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    fetchSuppliers()
      .then(setSuppliers)
      .catch(() => notify("Error fetching suppliers", "error"));

    fetchTransports()
      .then(setTransports)
      .catch(() => notify("Error fetching transports", "error"));
  }, [notify]);

  /* -------------------------------------------------------------------------- */
  /* Handlers                                                                   */
  /* -------------------------------------------------------------------------- */

  const handleOpenFilter = useCallback((e: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(e.currentTarget);
  }, []);

  const handleCloseFilter = useCallback(() => {
    setFilterAnchorEl(null);
  }, []);

  const handleApplyFilter = useCallback(() => {
    setPage(0);
    handleCloseFilter();
  }, [handleCloseFilter]);

  const handleResetFilter = useCallback(() => {
    setFilters({
      supplierNames: [],
      transportNames: [],
      isPaid: [],
      invoiceStartDate: "",
      invoiceEndDate: "",
      receivedStartDate: "",
      receivedEndDate: "",
    });
    setPage(0);
    handleCloseFilter();
  }, [handleCloseFilter]);

  const handleEditInvoice = useCallback((invoice: InvoiceDetails) => {
    setSelectedInvoice({
      ...invoice,
      invoiceDate: dayjs(invoice.invoiceDate).format("DD-MM-YYYY"),
      receivedDate: dayjs(invoice.receivedDate).format("DD-MM-YYYY"),
    });
    setInvoiceErrors({});
    setOpenModal(true);
  }, []);

  const handleInvoiceChange = useCallback((patch: Partial<InvoiceDetails>) => {
    setSelectedInvoice((prev) => ({
      ...prev,
      ...patch,
    }));
    setInvoiceErrors((prev) => {
      const next = { ...prev };
      Object.keys(patch).forEach((k) => delete next[k as keyof InvoiceErrors]);
      return next;
    });
  }, []);

  const validateInvoice = (invoice: InvoiceDetails) => {
    const errors: InvoiceErrors = {};

    if (!invoice.invoiceNumber.trim())
      errors.invoiceNumber = "Invoice number is required";

    if (!invoice.invoiceDate) errors.invoiceDate = "Invoice date is required";
    else if (dayjs(invoice.invoiceDate, "DD-MM-YYYY").isAfter(dayjs(), "day"))
      errors.invoiceDate = "Cannot select a future date";

    if (!invoice.receivedDate)
      errors.receivedDate = "Received date is required";
    else if (dayjs(invoice.receivedDate, "DD-MM-YYYY").isAfter(dayjs(), "day"))
      errors.receivedDate = "Cannot select a future date";

    if (!invoice.supplierName) errors.supplierName = "Supplier is required";

    if (!invoice.transportName) errors.transportName = "Transport is required";

    if (invoice.transportCost == null || invoice.transportCost < 0)
      errors.transportCost = "Transport cost must be ≥ 0";

    setInvoiceErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInvoiceSubmit = async (data: InvoiceDetails) => {
    if (!validateInvoice(data)) return;
    showLoading();
    try {
      await updateInvoice(data.id, {
        ...data,
        invoiceDate: toISODate(data.invoiceDate),
        receivedDate: toISODate(data.receivedDate),
      });

      notify("Invoice updated successfully", "success");
      setOpenModal(false);
      loadInvoices();
    } catch (err: any) {
      notify(err?.response?.data?.message || "Error saving invoice", "error");
    } finally {
      hideLoading();
    }
  };

  /* -------------------------------------------------------------------------- */
  /* Render                                                                     */
  /* -------------------------------------------------------------------------- */

  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 0.5, mx : 1 }}>
          <Typography variant="h4" fontWeight={600}>
            Invoices
          </Typography>
          <Chip 
            label={`${totalCount}`} 
            size="small" 
            color="primary" 
            sx={{ fontWeight: 700 }}
          />
        </Stack>
      </Grid>
      <Grid size={12}>
        <GenericTable<InvoiceDetails>
          title={isMobile ? "" : "Invoices"}
          rows={rows}
          columns={columns}
          pagination
          totalCount={totalCount}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={setPage}
          onRowsPerPageChange={setRowsPerPage}
          showSearch={true}
          searchPlacedHolder="Search invoice number..."
          searchValue={search}
          onSearchChange={setSearch}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={(col, order) => {
            setSortBy(col);
            setSortOrder(order);
          }}
          onRowClick={(row) => router.push(`/invoices/${row.id}`)}
          rowActions={[
            {
              label: "Edit",
              icon: () => (
                <Tooltip title="Edit Invoice">
                  <IconButton size="small">
                    <EditIcon sx={{ color: "gray" }} />
                  </IconButton>
                </Tooltip>
              ),
              onClick: handleEditInvoice,
            },
          ]}
          toolbarExtras={
            <Stack direction="row" alignItems="center">
              <Tooltip title="Filter Invoices">
                <Badge
                  badgeContent={activeFilterCount}
                  color="primary"
                  invisible={activeFilterCount === 0}
                >
                  <IconButton size="small" onClick={handleOpenFilter}>
                    <FilterAltIcon />
                  </IconButton>
                </Badge>
              </Tooltip>

              <Tooltip title="Add Invoice">
                <IconButton
                  size="small"
                  onClick={() => router.push("/invoices/create")}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          }
        />
      </Grid>

      <InvoiceFilter
        anchorEl={filterAnchorEl}
        open={isFilterOpen}
        filters={filters}
        suppliers={suppliers}
        transports={transports}
        onChange={setFilters}
        onApply={handleApplyFilter}
        onReset={handleResetFilter}
        onClose={handleCloseFilter}
      />

      <InvoiceFormModal
        open={openModal}
        mode="edit"
        loading={loading}
        initialData={selectedInvoice}
        onChange={handleInvoiceChange}
        onClose={() => setOpenModal(false)}
        onSubmit={handleInvoiceSubmit}
        suppliers={suppliers}
        transports={transports}
        errors={invoiceErrors}
      />
    </Grid>
  );
}
