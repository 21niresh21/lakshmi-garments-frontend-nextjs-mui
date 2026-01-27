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
  Tooltip,
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
import { Supplier } from "../../invoices/_types/supplier";
import { Transport } from "../../invoices/_types/transport";
import {
  INITIAL_INVOICE,
  InvoiceErrors,
} from "../../invoices/create/invoice.types";
import InvoiceFilter, {
  InvoiceFilterType,
} from "../../invoices/list/InvoiceFilter";
import { InvoiceDetails } from "../../invoices/_types/invoiceDetails";
import {
  fetchWorkflowRequests,
  updateWorkflowRequests,
} from "@/app/api/workflowRequestApi";
import { WorkflowRequest } from "@/app/_types/WorkflowRequest";
import { useUser } from "@/app/context/UserContext";
import ApprovalIcon from "@mui/icons-material/Approval";
import { WorkflowRequestStatus } from "@/app/_types/WorkflowRequestStatus";
import { Roles } from "@/app/_types/RoleType";

type SubCategoryWithQuantity = {
  id: number;
  subCategoryName: string;
  quantity: number;
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
    id: "id",
    label: "ID",
    // sortable: true,
  },
  {
    id: "requestType",
    label: "Request Type",
  },
  {
    id: "requestedBy",
    label: "Requested By",
    render: (row: any) => (
      <Chip
        size="small"
        // sx={{bgcolor : "transparent"}}
        icon={<BadgeIcon />}
        label={row.requestedBy}
      />
    ),
  },
  {
    id: "requestedAt",
    label: "Date",
    render: (row: any) => formatToShortDate(row.requestedAt),
  },
  {
    id: "systemComments",
    label: "Reason",
  },
  {
    id: "requestStatus",
    label: "Status",
  },
];

export default function Page() {
  const { notify } = useNotification();
  const { user } = useUser();
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string | undefined>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [totalCount, setTotalCount] = useState(0);

  const [rows, setRows] = useState<WorkflowRequest[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [transports, setTransports] = useState<Transport[]>([]);
  const [invoiceErrors, setInvoiceErrors] = useState<InvoiceErrors>({});

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
    null
  );

  const openFilter = Boolean(filterAnchorEl);

  const [openModal, setOpenModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] =
    useState<InvoiceDetails>(INITIAL_INVOICE);

  // ✅ Popper state
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [subCategories, setSubCategories] = useState<SubCategoryWithQuantity[]>(
    []
  );

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
    loadRequests(); // optional but clear
    handleCloseFilter();
  };

  const handleResetFilter = () => {
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

  const handleApproval = (row: WorkflowRequest) => {
    const payload = {
      requestStatus: WorkflowRequestStatus.APPROVED,
    };
    updateWorkflowRequests(row.id, payload)
      .then((res) => {
        notify("Request approved", "success");
        loadRequests();
      })
      .catch((err) => notify("Error approving request", "error"));
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
      loadRequests();
    } catch (err: any) {
      notify(err?.response?.data?.message ?? "Error saving invoice", "error");
    }
  };

  const handleCloseDetails = () => {
    setAnchorEl(null);
    setOpenModal(false);
    setSubCategories([]);
    setInvoiceErrors({});
  };

  const loadRequests = async () => {
    try {
      const requestedByNames: string = user?.username ?? "";

      const data = await fetchWorkflowRequests({
        pageNo: page,
        pageSize: rowsPerPage,
        sortBy,
        sortOrder,
        requestedByNames: [requestedByNames],
      });

      setTotalCount(data.totalElements);
      setRows(data.content); // assuming backend returns { content, totalElements, etc. }
    } catch (err) {
      console.error("Error loading invoices:", err);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [
    page,
    rowsPerPage,
    search,
    sortBy,
    sortOrder,
    filters,
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

  console.log(Roles.SUPER_ADMIN);
  // const canApprove = user?.role?.name === Roles.SUPER_ADMIN;

  return (
    <Grid container>
      <Grid size={12}>
        <GenericTable<WorkflowRequest>
          title="Your Requests"
          rows={rows}
          pagination={true}
          totalCount={totalCount}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={setPage}
          onRowsPerPageChange={setRowsPerPage}
          //   searchPlacedHolder="Search invoice number..."
          //   searchValue={search}
          //   onSearchChange={setSearch}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={(col, order) => {
            setSortBy(col);
            setSortOrder(order);
          }}
          onRowClick={(row) => router.push(`/requests/workflow/${row.id}`)}
          columns={HEADERS}
          // rowActions={
          //   canApprove
          //     ? [
          //         {
          //           label: "Approve",
          //           icon: (row) =>
          //             row.requestStatus === WorkflowRequestStatus.PENDING &&
          //             user?. === Roles.SUPER_ADMIN ? (
          //               <Tooltip title="Approve">
          //                 <IconButton size="small">
          //                   <ApprovalIcon sx={{ color: "gray" }} />
          //                 </IconButton>
          //               </Tooltip>
          //             ) : null,
          //           onClick: (row) => handleApproval(row),
          //         },
          //       ]
          //     : undefined
          // }

          //   toolbarExtras={
          //     <Badge
          //       badgeContent={activeFilterCount}
          //       color="primary"
          //       overlap="circular"
          //       invisible={activeFilterCount === 0} // hide badge when no filters active
          //     >
          //       <IconButton onClick={handleOpenFilter}>
          //         <FilterAltIcon />
          //       </IconButton>
          //     </Badge>
          //   }
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
