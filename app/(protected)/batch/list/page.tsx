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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";
import { SubCategory } from "@/app/_types/SubCategory";
import { useNotification } from "@/app/components/shared/NotificationProvider";

type Employee = {
  id: number;
  name: string;
  role: string;
  status: "ACTIVE" | "INACTIVE";
};

const MOCK_DATA: Employee[] = [
  { id: 1, name: "Ramesh", role: "Cutter", status: "ACTIVE" },
  { id: 2, name: "Suresh", role: "Stitcher", status: "INACTIVE" },
  { id: 3, name: "Mahesh", role: "Packer", status: "ACTIVE" },
];

type SubCategoryWithQuantity = {
  id: number;
  subCategoryName: string;
  quantity: number;
};

const BatchStatusIconMap = {
  CREATED: NewReleasesIcon,
  WIP: PrecisionManufacturingIcon,
  PACKAGED: CheckCircleIcon,
  DISCARDED: RecyclingIcon,
} as const;

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
    id: "serialCode",
    label: "Serial Code",
    sortable: true,
  },
  {
    id: "categoryName",
    label: "Category",
  },
  {
    id: "batchStatus",
    label: "Status",
    render: (row: BatchRow) => {
      const StatusIcon = BatchStatusIconMap[row.batchStatus];

      return (
        <Chip
          size="small"
          icon={
            StatusIcon ? (
              <StatusIcon color={BatchStatusColorMap[row.batchStatus]} />
            ) : undefined
          }
          label={row.batchStatus}
          //   variant="outlined"
        />
      );
    },
  },
  {
    id: "isUrgent",
    label: "Priority",
    render: (row: any) => (
      <Chip
        size="small"
        icon={
          row.isUrgent ? (
            <PriorityHighIcon color="error" />
          ) : (
            <LowPriorityIcon color="primary" />
          )
        }
        label={row.isUrgent ? "HIGH" : "NORMAL"}
      />
    ),
  },
  {
    id: "remarks",
    label: "Remarks",
    render: (row: any) => (row.remarks === "" ? "No Remarks" : row.remarks),
  },
  {
    id: "createdAt",
    label: "Created At",
    sortable: true,
    render: (row: any) => formatToShortDate(row.createdAt),
  },
  {
    id: "createdBy",
    label: "Created By",
    render: (row: any) => (
      <Chip
        size="small"
        // sx={{bgcolor : "transparent"}}
        icon={<BadgeIcon />}
        label={row.createdBy}
      />
    ),
  },
];

export default function Page() {
  const { notify } = useNotification();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string | undefined>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [totalCount, setTotalCount] = useState(0);

  const [rows, setRows] = useState<BatchRow[]>([]);

  const [recyclingId, setRecyclingId] = useState<number | null>(null);

  // ✅ Popper state
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [subCategories, setSubCategories] = useState<SubCategoryWithQuantity[]>(
    []
  );

  // ✅ Handlers
  const handleOpenDetails = (
    event: React.MouseEvent<HTMLElement>,
    data: SubCategoryWithQuantity[]
  ) => {
    setAnchorEl(event.currentTarget);
    setSubCategories(data);
  };

  const handleRecycle = async (batch: BatchRow) => {
    if (batch.batchStatus === BatchStatus.DISCARDED) {
      notify("Batch has already been discarded", "warning");
      return;
    } else if (batch.batchStatus === BatchStatus.PACKAGED) {
      notify("Batch has already been packaged", "warning");
      return;
    }
    try {
      setRecyclingId(batch.id);

      await recycleBatch(batch.id);
      notify("Batch recycled. Inventory refilled", "success");

      loadBatches(); // refresh table
    } catch (err) {
      notify("Error recycling batch", "error");
    } finally {
      setRecyclingId(null);
    }
  };

  const handleCloseDetails = () => {
    setAnchorEl(null);
    setSubCategories([]);
  };

  const loadBatches = async () => {
    try {
      const data = await fetchBatches({
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
      console.error("Error loading batches:", err);
    }
  };

  useEffect(() => {
    loadBatches();
  }, [
    page,
    rowsPerPage,
    search,
    sortBy,
    sortOrder,
    // batchStatusFilter,
    // categoryFilter,
    // isUrgentFilter,
    // dateRange,
  ]);

  return (
    <Grid container>
      <Grid size={12}>
        <GenericTable<BatchRow>
          title="Batches"
          rows={rows}
          pagination={true}
          totalCount={totalCount}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={setPage}
          onRowsPerPageChange={setRowsPerPage}
          searchPlacedHolder="Search Serial Codes..."
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
              label: "Details",
              icon: (row) => (
                <IconButton size="small">
                  <ExpandCircleDownIcon sx={{ color: "gray" }} />
                </IconButton>
              ),
              onClick: (row: BatchRow, event) =>
                handleOpenDetails(event, row.subCategories),
            },
            {
              label: "Recycle",
              icon: (row) => (
                <IconButton size="small" disabled={recyclingId === row.id}>
                  {recyclingId === row.id ? (
                    <CircularProgress size={18} />
                  ) : (
                    <RecyclingIcon sx={{ color: "gray" }} />
                  )}
                </IconButton>
              ),
              onClick: (row) => handleRecycle(row),
            },
          ]}
        />
      </Grid>

      {/* ✅ POPPER (render ONCE, outside table) */}
      <Popper
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        placement="right-start"
        sx={{ zIndex: 1300 }}
      >
        <ClickAwayListener onClickAway={handleCloseDetails}>
          <Paper elevation={4} sx={{ p: 2, minWidth: 260 }}>
            <Typography variant="subtitle2" gutterBottom>
              Sub-Categories
            </Typography>

            <Divider sx={{ mb: 1 }} />

            {subCategories.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No sub-categories
              </Typography>
            ) : (
              <Stack spacing={1}>
                {subCategories.map((item) => (
                  <Box
                    key={item.id}
                    display="flex"
                    justifyContent="space-between"
                  >
                    <Typography variant="body2">
                      {item.subCategoryName}
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {item.quantity}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            )}
          </Paper>
        </ClickAwayListener>
      </Popper>
    </Grid>
  );
}
