"use client";

import GenericTable from "@/app/components/shared/GenericTable";
import {
  Grid,
  Chip,
  Button,
  IconButton,
  Popper,
  ClickAwayListener,
  Paper,
  Typography,
  Divider,
  Stack,
  Box,
  CircularProgress,
  Badge,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import React, { useEffect, useState } from "react";
import { People } from "@mui/icons-material";
import { fetchSuppliers } from "@/app/api/supplier";
import { fetchBatches, recycleBatch } from "@/app/api/batchApi";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import LowPriorityIcon from "@mui/icons-material/LowPriority";
import { formatToShortDate } from "@/app/utils/date";
import BadgeIcon from "@mui/icons-material/Badge";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import { BatchStatus, BatchStatusColorMap } from "@/app/_types/BatchStatus";
import RecyclingIcon from "@mui/icons-material/Recycling";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";
import { SubCategory } from "@/app/_types/SubCategory";
import { useNotification } from "@/app/components/shared/NotificationProvider";
import { fetchInvoices, updateInvoice } from "@/app/api/invoiceApi";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReportIcon from "@mui/icons-material/Report";
import InvoiceFormModal from "@/app/components/shared/InvoiceFormModal";
import { fetchTransports } from "@/app/api/transport";
import dayjs from "dayjs";

import { useRouter } from "next/navigation";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { Supplier } from "../invoice/_types/supplier";
import { Transport } from "../invoice/_types/transport";
import {
  INITIAL_INVOICE,
  InvoiceErrors,
} from "../invoice/create/invoice.types";
import InvoiceFilter, {
  InvoiceFilterType,
} from "../invoice/list/InvoiceFilter";
import { InvoiceDetails } from "../invoice/_types/invoiceDetails";
import { getPaydaySummary } from "@/app/api/paydayApi";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

type SubCategoryWithQuantity = {
  id: number;
  subCategoryName: string;
  quantity: number;
};
const SORT_FIELD_MAP: Record<string, string> = {
  invoiceNumber: "invoiceNumber",
  invoiceDate: "invoiceDate",
  createdAt: "createdAt",
  supplierName: "supplier",
  transportName: "transport",
};

interface BatchRow {
  id: number;
  serialCode: string;
  categoryName: string;
  remarks: string;
  createdAt: string;
  createdBy: string;
  batchStatus: BatchStatus;
  isUrgent: boolean;
  subCategories: SubCategoryWithQuantity[];
}

const HEADERS = [
  {
    id: "employeeName",
    label: "Employee",
    sortable: true,
  },
  {
    id: "completedJobworkCount",
    label: "Jobworks Completed",
    sortable: true,
  },
  {
    id: "totalQuantities",
    label: "Volume Handled",
    sortable: true,
  },
  {
    id: "totalDamages",
    label: "Damages",
  },
  {
    id: "totalSales",
    label: "Purchase done",
  },
  {
    id: "wage",
    label: "wage",
  },
  // {
  //   id: "createdAt",
  //   label: "Created At",
  //   sortable: true,
  //   render: (row: any) => formatToShortDate(row.createdAt),
  // },
  // {
  //   id: "createdBy",
  //   label: "Created By",
  //   render: (row: any) => (
  //     <Chip
  //       size="small"
  //       // sx={{bgcolor : "transparent"}}
  //       icon={<BadgeIcon />}
  //       label={row.createdBy}
  //     />
  //   ),
  // },
];

export default function Page() {
  const { notify } = useNotification();
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string | undefined>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [totalCount, setTotalCount] = useState(0);

  const [fromDate, setFromDate] = useState<dayjs.Dayjs | null>(null);
  const [toDate, setToDate] = useState<dayjs.Dayjs | null>(null);

  const [rows, setRows] = useState<BatchRow[]>([]);
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


  const [openModal, setOpenModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] =
    useState<InvoiceDetails>(INITIAL_INVOICE);



  const handleThisWeekFilter = () => {
    const now = dayjs();

    // Dayjs: Sunday = 0, Saturday = 6
    const todayDay = now.day();

    // Get this week's Saturday 6 PM
    let thisSaturday6PM = now
      .day(6)
      .hour(18)
      .minute(0)
      .second(0)
      .millisecond(0);

    // If today is before Saturday, day(6) gives NEXT Saturday
    if (todayDay < 6) {
      thisSaturday6PM = thisSaturday6PM.subtract(7, "day");
    }

    // If current time is before this Saturday 6 PM, go to last Saturday
    const fromDate = now.isBefore(thisSaturday6PM)
      ? thisSaturday6PM.subtract(7, "day")
      : thisSaturday6PM;

    setFromDate(fromDate);
    setToDate(now);
    setPage(0);
  };
  // Count active filters
  const activeFilterCount =
    (filters.supplierNames?.length || 0) +
    (filters.transportNames?.length || 0) +
    (filters.isPaid?.length || 0) +
    (filters.invoiceStartDate || filters.invoiceEndDate ? 1 : 0);

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
    console.log("validation", invoice);
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
      // setSelectedInvoice(null);
      loadInvoices();
    } catch (err: any) {
      notify(err?.response?.data?.message ?? "Error saving invoice", "error");
    }
  };

  const handleCloseDetails = () => {
    setOpenModal(false);
    setInvoiceErrors({});
  };

  const loadInvoices = async () => {
    try {
      const { invoiceStartDate, invoiceEndDate, ...otherFilters } = filters;

      const data = await getPaydaySummary({
        pageNo: page,
        pageSize: rowsPerPage,
        sortBy: sortBy ?? "employeeName",
        sortOrder,
        employeeName: search,
        fromDate: fromDate ? fromDate.format("YYYY-MM-DDTHH:mm:ss") : undefined,
        toDate: toDate ? toDate.format("YYYY-MM-DDTHH:mm:ss") : undefined,
      });

      setTotalCount(data.totalElements);
      setRows(data.content); // assuming backend returns { content, totalElements, etc. }
    } catch (err) {
      console.error("Error loading invoices:", err);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, [
    page,
    rowsPerPage,
    search,
    sortBy,
    sortOrder,
    fromDate,
    toDate,
    // batchStatusFilter,
    // categoryFilter,
    // isUrgentFilter,
    // dateRange,
  ]);

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
        <GenericTable<BatchRow>
          title="Employee Effort"
          rows={rows}
          pagination={true}
          totalCount={totalCount}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={setPage}
          onRowsPerPageChange={setRowsPerPage}
          searchPlacedHolder="Search employee name"
          searchValue={search}
          onSearchChange={setSearch}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={(col, order) => {
            setSortBy(SORT_FIELD_MAP[col] ?? "invoiceDate");
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
            <Stack direction="row" alignItems="center" spacing={2}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="From Datetime"
                  format="DD/MM/YYYY HH:mm"
                  maxDateTime={dayjs()}
                  value={fromDate}
                  onChange={(value) => {
                    setFromDate(value);
                    setPage(0);
                  }}
                  slotProps={{
                    textField: { size: "small" },
                  }}
                />

                <DateTimePicker
                  label="To Datetime"
                  format="DD/MM/YYYY HH:mm"
                  minDateTime={fromDate ?? undefined}
                  maxDateTime={dayjs()}
                  value={toDate}
                  onChange={(value) => {
                    setToDate(value);
                    setPage(0);
                  }}
                  slotProps={{
                    textField: { size: "small" },
                  }}
                />
                <Chip label="This Week" onClick={handleThisWeekFilter} />
              </LocalizationProvider>
            </Stack>
          }
        />
      </Grid>

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
