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
  InputAdornment,
} from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";
import SearchIcon from "@mui/icons-material/Search";

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
  shouldShow?: (row: T) => void;
  onClick: (row: T, event: React.MouseEvent<HTMLElement>) => void;
  icon?: (row: T) => React.ReactNode;
};

interface GenericTableProps<T> {
  title?: string;
  rows: T[];
  columns: Column<T>[];

  // Pagination
  pagination?: boolean;
  page?: number;
  rowsPerPage?: number;
  totalCount?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (size: number) => void;

  // Sorting
  sortBy?: string;
  sortOrder?: SortOrder;
  onSortChange?: (columnId: string, order: SortOrder) => void;

  // Toolbar
  searchPlacedHolder?: string;
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  toolbarExtras?: React.ReactNode;

  // ✅ Row click
  onRowClick?: (row: T) => void;

  // UI states
  loading?: boolean;
  noDataText?: string;

  // Actions
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
  searchPlacedHolder = "Search...",
  showSearch = true,
  searchValue = "",
  onSearchChange,
  toolbarExtras,
  loading = false,
  noDataText = "No data available",
  rowActions,
  onRowClick,
}: GenericTableProps<T>) {
  const handleSort = (columnId: string) => {
    if (!onSortChange) return;
    const isAsc = sortBy === columnId && sortOrder === "asc";
    onSortChange(columnId, isAsc ? "desc" : "asc");
  };

  return (
    <Paper
      sx={{ width: "100%", display: "flex", flexDirection: "column" }}
      elevation={3}
    >
      {loading && <LinearProgress />}

      {/* Toolbar */}
      <Toolbar sx={{ gap: 2 }}>
        {title && (
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 600 }}>
            {title}
          </Typography>
        )}

        {showSearch && onSearchChange && (
          <TextField
            size="small"
            placeholder={searchPlacedHolder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        )}

        {toolbarExtras}
      </Toolbar>

      {/* Table */}
      <TableContainer sx={{ flexGrow: 1, maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow
              sx={{ backgroundColor: (theme) => theme.palette.primary.main }}
            >
              {columns.map((col) => (
                <TableCell
                  key={String(col.id)}
                  align={col.align}
                  sx={{ color: "white", fontWeight: 600 }}
                >
                  {col.sortable && onSortChange ? (
                    <TableSortLabel
                      active={sortBy === col.id}
                      direction={sortBy === col.id ? sortOrder : "asc"}
                      onClick={() => handleSort(String(col.id))}
                      sx={{ color: "inherit" }}
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
                  sx={{ color: "white", fontWeight: 600 }}
                >
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row, idx) => (
              <TableRow
                key={(row as any).id ?? idx}
                hover
                sx={{
                  cursor: onRowClick ? "pointer" : "default",
                }}
                onClick={(e) => {
                  // Prevent navigation when clicking action buttons
                  if ((e.target as HTMLElement).closest("[data-row-action]"))
                    return;
                  onRowClick?.(row);
                }}
              >
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
                        data-row-action
                        component="span"
                        sx={{ cursor: "pointer", ml: 1 }}
                        onClick={(e) => action.onClick(row, e)}
                      >
                        {typeof action.icon === "function"
                          ? action.icon(row)
                          : action.icon}
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
