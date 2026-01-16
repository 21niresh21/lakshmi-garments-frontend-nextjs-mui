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
import { formatToShortDate, formatToShortDateTime } from "@/app/utils/date";
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
import { Supplier } from "../../invoice/_types/supplier";
import {
  INITIAL_INVOICE,
  InvoiceErrors,
} from "../../invoice/create/invoice.types";
import { InvoiceDetails } from "../../invoice/_types/invoiceDetails";
import {
  closeJobwork,
  fetchJobworks,
  reAssignJobwork,
  reopenJobwork,
} from "@/app/api/jobworkApi";
import { JobworkStatus } from "@/app/_types/JobworkStatus";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import EmployeeReassignModal from "./EmployeeReassignModal";
import { Employee } from "@/app/_types/Employee";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { FaClock, FaUserClock } from "react-icons/fa";
import VerifiedIcon from "@mui/icons-material/Verified";
import { GoIssueClosed, GoIssueReopened } from "react-icons/go";

type SubCategoryWithQuantity = {
  id: number;
  subCategoryName: string;
  quantity: number;
};

export interface JobworkRow {
  id: number;
  batchSerialCode: string;
  jobworkNumber: string;
  assignedTo: string;
  status: string;
  startedAt: string;
  jobworkType: string;
  totalQuantites: number;
  //   subCategories: SubCategoryWithQuantity[];
}

const getJobworkStats = (status: JobworkStatus) => {
  switch (status) {
    case JobworkStatus.CLOSED:
      return {
        label: "Closed",
        icon: <CheckCircleIcon color="success" />,
        color: "success" as const,
      };

    case JobworkStatus.IN_PROGRESS:
      return {
        label: "In Progress",
        icon: <FaClock color="primary" />,
        color: "primary" as const,
      };

    case JobworkStatus.PENDING_RETURN:
    default:
      return {
        label: "Pending Return",
        icon: <HourglassBottomIcon color="warning" />,
        color: "warning" as const,
      };

    case JobworkStatus.REASSIGNED:
      return {
        label: "Re Assigned",
        icon: <SwapHorizIcon color="info" />,
        color: "info" as const,
      };

    case JobworkStatus.AWAITING_CLOSE:
      return {
        label: "Awaiting Close",
        icon: <FaUserClock color="warning" />,
        color: "warning" as const,
      };
  }
};

const HEADERS = [
  {
    id: "jobworkNumber",
    label: "Jobwork Number",
    sortable: true,
  },
  {
    id: "assignedTo",
    label: "Assigned To",
  },
  {
    id: "startedAt",
    label: "Assigned At",
    render: (row: any) => formatToShortDateTime(row.startedAt),
  },
  {
    id: "jobworkType",
    label: "Work",
  },
  {
    id: "batchSerial",
    label: "Batch Serial Code",
  },
  {
    id: "totalQuantitesIssued",
    label: "Total Quantities",
  },
  {
    id: "status",
    label: "Jobwork Status",
    render: (row: any) => {
      const chip = getJobworkStats(row.status);

      return (
        <Chip
          size="small"
          icon={chip.icon}
          label={chip.label}
          color={chip.color}
        />
      );
    },
  },
  //   {
  //     id: "createdAt",
  //     label: "Created At",
  //     sortable: true,
  //     render: (row: any) => formatToShortDate(row.createdAt),
  //   },
  //   {
  //     id: "createdBy",
  //     label: "Created By",
  //     render: (row: any) => (
  //       <Chip
  //         size="small"
  //         // sx={{bgcolor : "transparent"}}
  //         icon={<BadgeIcon />}
  //         label={row.createdBy}
  //       />
  //     ),
  //   },
];

export default function Page() {
  const { notify } = useNotification();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string | undefined>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [totalCount, setTotalCount] = useState(0);

  const [rows, setRows] = useState<JobworkRow[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [transports, setTransports] = useState<Supplier[]>([]);
  const [invoiceErrors, setInvoiceErrors] = useState<InvoiceErrors>({});

  const [selectedEmployee, setSelectedEmployee] = useState<Employee>();
  const [selectedJobwork, setSelectedJobwork] = useState<JobworkRow>();
  const [currentAssignedEmployee, setCurrentAssignedEmployee] = useState<
    string | null
  >(null);

  const [openModal, setOpenModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] =
    useState<InvoiceDetails>(INITIAL_INVOICE);

  // ✅ Popper state
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [subCategories, setSubCategories] = useState<SubCategoryWithQuantity[]>(
    []
  );

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

  const handleReAssignJob = (row: JobworkRow) => {
    setCurrentAssignedEmployee(row.assignedTo);
    setSelectedJobwork(row);
    setOpenModal(true);
  };

  const reassignJob = async () => {
    if (!selectedJobwork || !selectedEmployee) return;

    const payload = {
      jobworkNumber: selectedJobwork.jobworkNumber,
      employeeName: selectedEmployee.name,
    };

    try {
      await reAssignJobwork(payload);
      notify("Reassigned jobwork", "success");
      setOpenModal(false);
      loadJobworks(); // refresh table
    } catch (err) {
      notify("Error occurred when re-assigning jobwork", "error");
    }
  };

  const handleSelectedEmployee = (emp: Employee | null) => {
    setSelectedEmployee(emp ?? undefined);
  };

  const validateInvoice = (invoice: InvoiceDetails): boolean => {
    console.log("validation", invoice);
    const errors: InvoiceErrors = {};
    if (!invoice.invoiceNumber)
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
      loadJobworks();
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

  const loadJobworks = async () => {
    try {
      const data = await fetchJobworks({
        pageNo: page,
        pageSize: rowsPerPage,
        sortBy,
        sortOrder,
        search,
        // batchStatusNames: batchStatusFilter,
        // categoryNames: categoryFilter,
        // isUrgent: isUrgentFilter,
        // startDate: dateRange.start,
        // endDate: dateRange.end,
      });
      setTotalCount(data.totalElements);
      setRows(data.content); // assuming backend returns { content, totalElements, etc. }
    } catch (err) {
      console.error("Error loading invoices:", err);
    }
  };

  const handleCloseJobwork = (data: JobworkRow) => {
    closeJobwork(data.jobworkNumber)
      .then((res) => {
        notify("Jobwork has been closed", "success");
        loadJobworks();
      })
      .catch((err) => {
        notify("Error closing jobwork", "error");
      });
  };

  const handleReopenJobwork = (data: JobworkRow) => {
    reopenJobwork(data.jobworkNumber)
      .then((res) => {
        notify("Jobwork has been reopened", "success");
        loadJobworks();
      })
      .catch((err) => {
        notify("Error closing reopened", "error");
      });
  };

  useEffect(() => {
    loadJobworks();
  }, [
    page,
    rowsPerPage,
    search,
    sortBy,
    sortOrder,
    openModal,
    // batchStatusFilter,
    // categoryFilter,
    // isUrgentFilter,
    // dateRange,
  ]);

  //   useEffect(() => {
  //     if (openModal) {
  //       fetchSuppliers()
  //         .then((res) => setSuppliers(res))
  //         .catch((err) => {
  //           notify("Error fetching suppliers", "error");
  //         });
  //       fetchTransports()
  //         .then((res) => setTransports(res))
  //         .catch((err) => {
  //           notify("Error fetching transports", "error");
  //         });
  //     }
  //   }, [openModal]);

  return (
    <Grid container>
      <Grid size={12}>
        <GenericTable<JobworkRow>
          title="Jobworks"
          rows={rows}
          pagination={true}
          totalCount={totalCount}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={setPage}
          onRowsPerPageChange={setRowsPerPage}
          searchPlacedHolder="Search jobwork number..."
          searchValue={search}
          onSearchChange={setSearch}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={(col, order) => {
            setSortBy(col);
            setSortOrder(order);
          }}
          columns={HEADERS}
          rowActions={[
            {
              label: "Close Jobwork",
              icon: (row: JobworkRow) =>
                row.status === JobworkStatus.AWAITING_CLOSE ? (
                  <Tooltip title="Close Jobwork">
                    <IconButton size="small">
                      <VerifiedIcon />
                    </IconButton>
                  </Tooltip>
                ) : (
                  row.status === JobworkStatus.CLOSED && (
                    <Tooltip title="Reopen Jobwork">
                      <IconButton size="small">
                        <AutorenewIcon />
                      </IconButton>
                    </Tooltip>
                  )
                ),
              onClick: (row) =>
                row.status === JobworkStatus.AWAITING_CLOSE
                  ? handleCloseJobwork(row)
                  : handleReopenJobwork(row),
            },
            {
              label: "Re Assign",
              icon: (row: JobworkRow) =>  row.status === JobworkStatus.IN_PROGRESS && (
                <IconButton size="small">
                  <SwapHorizIcon sx={{ color: "gray" }} />
                </IconButton>
              ),
              onClick: (row) => handleReAssignJob(row),
            },
          ]}
        />
      </Grid>

      <EmployeeReassignModal
        jobwork={selectedJobwork}
        currentEmployee={currentAssignedEmployee ?? undefined}
        selectedEmployee={selectedEmployee}
        open={openModal}
        onClose={handleCloseDetails}
        setSelectedEmployee={handleSelectedEmployee}
        onSubmit={reassignJob}
      />

      {/* ✅ POPPER (render ONCE, outside table) */}
      {/* <InvoiceFormModal
        open={openModal}
        mode={selectedInvoice ? "edit" : "create"}
        onChange={handleInvoiceChange}
        initialData={selectedInvoice}
        onClose={handleCloseDetails}
        onSubmit={handleInvoiceSubmit}
        suppliers={suppliers}
        transports={transports}
        errors={invoiceErrors}
      /> */}
    </Grid>
  );
}
