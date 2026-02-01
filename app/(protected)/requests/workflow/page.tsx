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
// import { fetchInvoices, updateInvoice } from "@/app/api/invoiceApi";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReportIcon from "@mui/icons-material/Report";

import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

import {
  fetchWorkflowRequests,
  updateWorkflowRequests,
} from "@/app/api/workflowRequestApi";
import { WorkflowRequest } from "@/app/_types/WorkflowRequest";
import { useUser } from "@/app/context/UserContext";
import ApprovalIcon from "@mui/icons-material/Approval";
import { WorkflowRequestStatus } from "@/app/_types/WorkflowRequestStatus";
import { Roles } from "@/app/_types/RoleType";
import WorkflowFilter, { WorkflowFilterType } from "./WorkflowFilter";
import { fetchUsers } from "@/app/api/userApi";
import { UserListItem } from "@/app/_types/User";

import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

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

const getStatusChip = (status: WorkflowRequestStatus) => {
  switch (status) {
    case WorkflowRequestStatus.APPROVED:
      return (
        <Chip
          icon={<CheckCircleIcon sx={{ fontSize: "16px !important" }} />}
          label="Approved"
          size="small"
          color="success"
          sx={{ fontWeight: 500 }}
        />
      );
    case WorkflowRequestStatus.PENDING:
      return (
        <Chip
          icon={<HourglassEmptyIcon sx={{ fontSize: "16px !important" }} />}
          label="Pending"
          size="small"
          color="warning"
          sx={{ fontWeight: 500 }}
        />
      );
    default:
      return <Chip label={status} size="small" />;
  }
};

const getTypeChip = (type: string) => {
  return (
    <Chip
      icon={<ReceiptLongIcon sx={{ fontSize: "16px !important" }} />}
      label={type.replace(/_/g, " ")}
      size="small"
      sx={{ fontWeight: 500, bgcolor: "grey.200" }}
    />
  );
};

const HEADERS = [
  {
    id: "id",
    label: "ID",
    // sortable: true,
  },
  {
    id: "requestType",
    label: "Request Type",
    render: (row: any) => getTypeChip(row.requestType),
  },
  {
    id: "requestedBy",
    label: "Requested By",
    render: (row: any) => (
      <Chip
        size="small"
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
    render: (row: any) => getStatusChip(row.requestStatus),
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
  const [users, setUsers] = useState<UserListItem[]>([]);

  const [filters, setFilters] = useState<WorkflowFilterType>({
    requestedByNames: [],
    requestTypes: [],
    statuses: [],
    startDate: "",
    endDate: "",
  });

  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLElement | null>(
    null
  );

  const openFilter = Boolean(filterAnchorEl);

  // ✅ Popper state
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [subCategories, setSubCategories] = useState<SubCategoryWithQuantity[]>(
    []
  );

  // Count active filters
  const activeFilterCount =
    (filters.requestedByNames?.length || 0) +
    (filters.requestTypes?.length || 0) +
    (filters.statuses?.length || 0) +
    (filters.startDate || filters.endDate ? 1 : 0);

  const handleOpenFilter = (e: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(e.currentTarget);
  };

  const handleCloseFilter = () => {
    setFilterAnchorEl(null);
  };

  const handleApplyFilter = () => {
    setPage(0);
    loadRequests();
    handleCloseFilter();
  };

  const handleResetFilter = () => {
    setFilters({
      requestedByNames: [],
      requestTypes: [],
      statuses: [],
      startDate: "",
      endDate: "",
    });
    setPage(0);
    handleCloseFilter();
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

  const toISODate = (date: string) => {
    if (!date) return "";
    const [dd, mm, yyyy] = date.split("-");
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleCloseDetails = () => {
    setAnchorEl(null);
    setSubCategories([]);
  };

  const isSuperAdmin = user?.roles.includes(Roles.SUPER_ADMIN);

  const loadRequests = async () => {
    try {
      const data = await fetchWorkflowRequests({
        pageNo: page,
        pageSize: rowsPerPage,
        sortBy,
        sortOrder,
        requestedByNames: isSuperAdmin
          ? filters.requestedByNames
          : user?.username
          ? [user.username]
          : [],
        requestTypes: filters.requestTypes,
        statuses: filters.statuses,
        startDate: toISODate(filters.startDate),
        endDate: toISODate(filters.endDate),
      });

      setTotalCount(data.totalElements);
      setRows(data.content);
    } catch (err) {
      console.error("Error loading workflow requests:", err);
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
    fetchUsers()
      .then((data) => setUsers(data.content || []))
      .catch(() => notify("Error fetching users", "error"));
  }, []);

  console.log(Roles.SUPER_ADMIN);
  // const canApprove = user?.role?.name === Roles.SUPER_ADMIN;

  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 0.5, mx : 1 }}>
          <Typography variant="h4" fontWeight={600}>
            Workflow Requests
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
        <GenericTable<WorkflowRequest>
          title="Your Requests"
          rows={rows}
          pagination={true}
          totalCount={totalCount}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={setPage}
          onRowsPerPageChange={setRowsPerPage}
          //   searchPlacedHolder="Search invoice number"
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

          toolbarExtras={
            <Badge
              badgeContent={activeFilterCount}
              color="primary"
              overlap="circular"
              invisible={activeFilterCount === 0}
            >
              <IconButton onClick={handleOpenFilter}>
                <FilterAltIcon />
              </IconButton>
            </Badge>
          }
        />
      </Grid>

      <WorkflowFilter
        anchorEl={filterAnchorEl}
        open={openFilter}
        filters={filters}
        usernames={users.map((u) => u.username)}
        onChange={setFilters}
        onApply={handleApplyFilter}
        onReset={handleResetFilter}
        onClose={handleCloseFilter}
        showRequestedByFilter={!!isSuperAdmin}
      />
    </Grid>
  );
}
