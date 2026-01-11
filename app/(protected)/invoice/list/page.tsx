"use client";

import GenericTable from "@/app/components/shared/GenericTable";
import { Grid, Chip, IconButton, Badge, Stack, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import React, { useEffect, useState } from "react";
import { fetchSuppliers } from "@/app/api/supplier";
import { useNotification } from "@/app/components/shared/NotificationProvider";
import { fetchInvoices, updateInvoice } from "@/app/api/invoiceApi";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReportIcon from "@mui/icons-material/Report";
import InvoiceFormModal from "@/app/components/shared/InvoiceFormModal";
import { Supplier } from "../_types/supplier";
import { fetchTransports } from "@/app/api/transport";
import dayjs from "dayjs";
import { INITIAL_INVOICE, InvoiceErrors } from "../create/invoice.types";
import { InvoiceDetails } from "../_types/invoiceDetails";
import { useRouter } from "next/navigation";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import InvoiceFilter, { InvoiceFilterType } from "./InvoiceFilter";
import { Transport } from "../_types/transport";
import { formatToShortDate } from "@/app/utils/date";
import AddIcon from "@mui/icons-material/Add";

const HEADERS = [
  {
    id: "invoiceNumber",
    label: "Invoice Number",
    sortable: true,
  },
  {
    id: "invoiceDate",
    label: "Invoice Date",
    sortable: true,
    render: (row: any) => formatToShortDate(row.invoiceDate),
  },
  {
    id: "receivedDate",
    label: "Received Date",
    sortable: true,
    render: (row: any) => formatToShortDate(row.receivedDate),
  },
  {
    id: "supplierName",
    label: "Supplier",
  },
  {
    id: "transportName",
    label: "Transport",
  },
  {
    id: "transportCost",
    label: "Transport Cost",
  },
  {
    id: "isTransportPaid",
    label: "Payment Status",
    render: (row: any) => (
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
];

const toBackendDate = (date: string) => {
  if (!date) return "";
  const [dd, mm, yyyy] = date.split("-");
  return `${yyyy}-${mm}-${dd}`; // yyyy-MM-dd
};

export default function Page() {
  const { notify } = useNotification();
  const router = useRouter();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string | undefined>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [totalCount, setTotalCount] = useState(0);

  const [rows, setRows] = useState<InvoiceRow[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [transports, setTransports] = useState<Transport[]>([]);
  const [invoiceErrors, setInvoiceErrors] = useState<InvoiceErrors>({});

  const [filters, setFilters] = useState<InvoiceFilterType>({
    supplierNames: [],
    transportNames: [],
    isPaid: [],
    invoiceStartDate: "",
    invoiceEndDate: "",
  });

  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLElement | null>(
    null
  );

  const openFilter = Boolean(filterAnchorEl);

  const [openModal, setOpenModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] =
    useState<InvoiceDetails>(INITIAL_INVOICE);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  // Count active filters
  const activeFilterCount =
    (filters.supplierNames?.length || 0) +
    (filters.transportNames?.length || 0) +
    (filters.isPaid?.length || 0) +
    (filters.invoiceStartDate || filters.invoiceEndDate ? 1 : 0);

  const handleOpenFilter = (e: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(e.currentTarget);
  };

  const handleCloseFilter = () => {
    setFilterAnchorEl(null);
  };

  const handleApplyFilter = () => {
    setPage(0);
    handleCloseFilter();
  };

  const handleResetFilter = () => {
    setFilters({
      supplierNames: [],
      transportNames: [],
      isPaid: [],
      invoiceStartDate: "",
      invoiceEndDate: "",
    });
    setPage(0);
    handleCloseFilter();
  };

  const handleInvoiceChange = (patch: Partial<InvoiceDetails>) => {
    setSelectedInvoice((prev) => ({ ...prev, ...patch }));
    setInvoiceErrors((prev) => {
      const next = { ...prev };
      Object.keys(patch).forEach(
        (key) => delete next[key as keyof InvoiceErrors]
      );
      return next;
    });
  };

  const handleEditInvoice = (invoice: any) => {
    setSelectedInvoice({
      ...invoice,
      invoiceDate: invoice.invoiceDate
        ? dayjs(invoice.invoiceDate).format("DD-MM-YYYY")
        : "",
      receivedDate: invoice.receivedDate
        ? dayjs(invoice.receivedDate).format("DD-MM-YYYY")
        : "",
    });
    setOpenModal(true);
  };

  const validateInvoice = (invoice: InvoiceDetails): boolean => {
    const errors: InvoiceErrors = {};
    if (!invoice.invoiceNumber.trim())
      errors.invoiceNumber = "Invoice number is required";

    if (!invoice.invoiceDate) errors.invoiceDate = "Invoice date is required";
    else if (
      dayjs(invoice.invoiceDate, "DD-MM-YYYY", true).isAfter(dayjs(), "day")
    ) {
      errors.invoiceDate = "Cannot select a future date";
    }

    if (!invoice.supplierName) {
      errors.supplierName = "Supplier is required";
    }

    if (!invoice.transportName) {
      errors.transportName = "Transport is required";
    }

    if (!invoice.receivedDate)
      errors.receivedDate = "Received date is required";
    else if (
      dayjs(invoice.receivedDate, "DD-MM-YYYY", true).isAfter(dayjs(), "day")
    ) {
      errors.receivedDate = "Cannot select a future date";
    }
    if (invoice.transportCost === undefined) {
      errors.transportCost = "Transport cost cannot be empty";
    } else if (invoice.transportCost < 0) {
      errors.transportCost = "Transport cost must be > 0";
    }

    if (!invoice.supplierName) errors.supplierName = "Supplier is required";

    if (!invoice.transportName) errors.transportName = "Transport is required";

    setInvoiceErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const toISODate = (date: string) => {
    const [dd, mm, yyyy] = date.split("-");
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleInvoiceSubmit = async (data: InvoiceDetails) => {
    try {
      if (!validateInvoice(data)) {
        return;
      }
      const payload = {
        ...data,
        invoiceDate: toISODate(data.invoiceDate),
        receivedDate: toISODate(data.receivedDate),
      };

      await updateInvoice(data.id, payload);
      notify("Invoice updated successfully", "success");
      setOpenModal(false);
      loadInvoices();
    } catch (err: any) {
      notify(err?.response?.data?.message ?? "Error saving invoice", "error");
    }
  };

  const handleCloseDetails = () => {
    setAnchorEl(null);
    setOpenModal(false);
    setInvoiceErrors({});
  };

  const loadInvoices = async () => {
    try {
      const { invoiceStartDate, invoiceEndDate, ...otherFilters } = filters;

      const data = await fetchInvoices({
        pageNo: page,
        pageSize: rowsPerPage,
        sortBy: sortBy ?? "invoiceDate",
        sortOrder,
        search,
        ...otherFilters, // supplierNames, transportNames, isPaid
        invoiceStartDate: invoiceStartDate
          ? toBackendDate(invoiceStartDate)
          : undefined,
        invoiceEndDate: invoiceEndDate
          ? toBackendDate(invoiceEndDate)
          : undefined,
      });

      setTotalCount(data.totalElements);
      setRows(data.content); // assuming backend returns { content, totalElements, etc. }
    } catch (err) {
      console.error("Error loading invoices:", err);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, [page, rowsPerPage, search, sortBy, sortOrder, filters]);

  useEffect(() => {
    fetchSuppliers()
      .then(setSuppliers)
      .catch(() => notify("Error fetching suppliers", "error"));

    fetchTransports()
      .then(setTransports)
      .catch(() => notify("Error fetching transports", "error"));
  }, []);

  return (
    <Grid container>
      <Grid size={12}>
        <GenericTable<InvoiceRow>
          title="Invoices"
          rows={rows}
          pagination={true}
          totalCount={totalCount}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={setPage}
          onRowsPerPageChange={setRowsPerPage}
          searchPlacedHolder="Search invoice number..."
          searchValue={search}
          onSearchChange={setSearch}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={(col, order) => {
            setSortBy(col);
            setSortOrder(order);
          }}
          onRowClick={(row) => router.push(`/invoice/${row.id}`)}
          columns={HEADERS}
          rowActions={[
            {
              label: "Edit",
              icon: () => (
                <IconButton size="small">
                  <EditIcon sx={{ color: "gray" }} />
                </IconButton>
              ),
              onClick: (row) => handleEditInvoice(row),
            },
          ]}
          toolbarExtras={
            <Stack direction="row" alignItems="center">
              <Tooltip title="Filter">
                <Badge
                  badgeContent={activeFilterCount}
                  color="primary"
                  overlap="circular"
                  invisible={activeFilterCount === 0} // hide badge when no filters active
                >
                  <IconButton onClick={handleOpenFilter}>
                    <FilterAltIcon />
                  </IconButton>
                </Badge>
              </Tooltip>

              <Tooltip title="Add Invoice">
                <IconButton onClick={() => router.push(`/invoice/create`)}>
                  <AddIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          }
        />
      </Grid>

      <InvoiceFilter
        anchorEl={filterAnchorEl}
        open={openFilter}
        filters={filters}
        suppliers={suppliers}
        transports={transports}
        onChange={setFilters}
        onApply={handleApplyFilter}
        onReset={handleResetFilter}
        onClose={handleCloseFilter}
      />

      {/* ✅ POPPER (render ONCE, outside table) */}
      <InvoiceFormModal
        open={openModal}
        mode={selectedInvoice ? "edit" : "create"}
        onChange={handleInvoiceChange}
        initialData={selectedInvoice}
        onClose={handleCloseDetails}
        onSubmit={handleInvoiceSubmit}
        suppliers={suppliers}
        transports={transports}
        errors={invoiceErrors}
      />
    </Grid>
  );
}
