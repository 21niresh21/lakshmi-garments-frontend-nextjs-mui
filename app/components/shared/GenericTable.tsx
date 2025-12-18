"use client";

import * as React from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Toolbar,
  Typography,
  TextField,
  LinearProgress,
  TableSortLabel,
} from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";

// ---- Types ----
export type SortOrder = "asc" | "desc";

export type Column<T> = {
  id: keyof T | string;
  label: string;
  align?: "left" | "right" | "center";
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
};

export type RowAction<T> = {
  label: string;
  onClick: (row: T) => void;
  icon?: React.ReactNode;
};

interface GenericTableProps<T> {
  title?: string;
  rows: T[];
  columns: Column<T>[];

  // Pagination (optional)
  pagination?: boolean;
  page?: number;
  rowsPerPage?: number;
  totalCount?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (size: number) => void;

  // Sorting (server-side friendly)
  sortBy?: string;
  sortOrder?: SortOrder;
  onSortChange?: (columnId: string, order: SortOrder) => void;

  // Toolbar
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  toolbarExtras?: React.ReactNode;

  // UI States
  loading?: boolean;
  noDataText?: string;

  // Row actions
  rowActions?: RowAction<T>[];
}

// ---- Component ----
export default function GenericTable<T extends { id?: string | number }>({
  title,
  rows,
  columns,
  pagination = true,
  page = 0,
  rowsPerPage = 10,
  totalCount = rows.length,
  onPageChange,
  onRowsPerPageChange,
  sortBy,
  sortOrder = "asc",
  onSortChange,
  showSearch = true,
  searchValue = "",
  onSearchChange,
  toolbarExtras,
  loading = false,
  noDataText = "No data available",
  rowActions,
}: GenericTableProps<T>) {
  const handleSort = (columnId: string) => {
    if (!onSortChange) return;
    const isAsc = sortBy === columnId && sortOrder === "asc";
    onSortChange(columnId, isAsc ? "desc" : "asc");
  };

  return (
    <Paper sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
      {/* Loading indicator */}
      {loading && <LinearProgress />}

      {/* Toolbar */}
      <Toolbar sx={{ gap: 2 }}>
        {title && (
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
        )}

        {showSearch && onSearchChange && (
          <TextField
            id="generic-table-search"
            size="small"
            placeholder="Search…"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        )}

        {toolbarExtras}
      </Toolbar>

      {/* Table */}
      <TableContainer
        sx={{
          flexGrow: 1,
          maxHeight: 400, // 👈 set your desired height
          overflowY: "auto",
        }}
      >
        <Table stickyHeader size="medium">
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: (theme) => theme.palette.primary.main,
              }}
            >
              {columns.map((col) => (
                <TableCell
                  key={String(col.id)}
                  align={col.align}
                  sx={{
                    color: (theme) => theme.palette.primary.contrastText,
                    fontWeight: 600,
                  }}
                >
                  {col.sortable && onSortChange ? (
                    <TableSortLabel
                      active={sortBy === col.id}
                      direction={sortBy === col.id ? sortOrder : "asc"}
                      onClick={() => handleSort(String(col.id))}
                      sx={{
                        color: "inherit",
                        "& .MuiTableSortLabel-icon": {
                          color: "inherit !important",
                        },
                      }}
                    >
                      {col.label}
                    </TableSortLabel>
                  ) : (
                    col.label
                  )}
                </TableCell>
              ))}

              {rowActions && (
                <TableCell
                  align="right"
                  sx={{
                    color: (theme) => theme.palette.primary.contrastText,
                    fontWeight: 600,
                  }}
                >
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row, idx) => (
              <TableRow key={(row as any).id ?? idx} hover>
                {columns.map((col) => (
                  <TableCell key={String(col.id)} align={col.align}>
                    {col.render ? col.render(row) : (row as any)[col.id]}
                  </TableCell>
                ))}

                {rowActions && (
                  <TableCell align="right">
                    {rowActions.map((action) => (
                      <Box
                        key={action.label}
                        component="span"
                        sx={{ cursor: "pointer", ml: 1 }}
                        onClick={() => action.onClick(row)}
                      >
                        {action.icon ?? action.label}
                      </Box>
                    ))}
                  </TableCell>
                )}
              </TableRow>
            ))}

            {!loading && rows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (rowActions ? 1 : 0)}
                  align="center"
                >
                  <Box sx={{ py: 4, color: "text.secondary" }}>
                    <InboxIcon sx={{ fontSize: 48, mb: 1 }} />
                    <Typography variant="body2">{noDataText}</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {pagination && (
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, newPage) => onPageChange?.(newPage)}
          onRowsPerPageChange={(e) => onRowsPerPageChange?.(+e.target.value)}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      )}
    </Paper>
  );
}
