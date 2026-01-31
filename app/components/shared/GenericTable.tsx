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
  alpha,
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
  showToolbar?: boolean;

  // ✅ Row click
  onRowClick?: (row: T) => void;

  // UI states
  loading?: boolean;
  noDataText?: string;

  // Actions
  rowActions?: RowAction<T>[];
  getRowSx?: (row: T) => object;
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
  showSearch = false,
  searchValue = "",
  onSearchChange,
  toolbarExtras,
  loading = false,
  noDataText = "No data available",
  rowActions,
  onRowClick,
  getRowSx,
}: GenericTableProps<T>) {
  const handleSort = (columnId: string) => {
    if (!onSortChange) return;
    const isAsc = sortBy === columnId && sortOrder === "asc";
    onSortChange(columnId, isAsc ? "desc" : "asc");
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        maxWidth: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {loading && <LinearProgress sx={{ height: 3 }} />}

      {/* Toolbar */}
      {(showSearch || toolbarExtras || title) && (
        <Toolbar
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            py: 2,
            px: 3,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", gap: 2 }}>
            {showSearch && onSearchChange && (
              <TextField
                size="small"
                placeholder={searchPlacedHolder}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                sx={{ 
                  maxWidth: 350,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {toolbarExtras}
          </Box>
        </Toolbar>
      )}

      {/* Table */}
      <TableContainer sx={{ flexGrow: 1, maxHeight: 550, overflowX: "auto" }}>
        <Table stickyHeader sx={{ minWidth: 1000 }}>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={String(col.id)}
                  align={col.align}
                  sx={{ 
                    whiteSpace: "nowrap",
                    py: 2,
                  }}
                >
                  {col.sortable && onSortChange ? (
                    <TableSortLabel
                      active={sortBy === col.id}
                      direction={sortBy === col.id ? sortOrder : "asc"}
                      onClick={() => handleSort(String(col.id))}
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
                  ...(getRowSx ? getRowSx(row) : {}),
                }}
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest("[data-row-action]"))
                    return;
                  onRowClick?.(row);
                }}
              >
                {columns.map((col) => (
                  <TableCell 
                    key={String(col.id)} 
                    align={col.align} 
                    sx={{ 
                      whiteSpace: "nowrap",
                      fontSize: "0.9rem",
                      py: 1.5,
                    }}
                  >
                    {col.render ? col.render(row) : (row as any)[col.id]}
                  </TableCell>
                ))}

                {rowActions && (
                  <TableCell align="right" sx={{ whiteSpace: "nowrap", py: 1.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                      {rowActions.map((action) => (
                        <Box
                          key={action.label}
                          data-row-action
                          component="span"
                          sx={{ 
                            cursor: "pointer", 
                            p: 0.5,
                            borderRadius: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s',
                          }}
                          onClick={(e) => action.onClick(row, e)}
                        >
                          {typeof action.icon === "function"
                            ? action.icon(row)
                            : action.icon}
                        </Box>
                      ))}
                    </Box>
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
                  <Box sx={{ py: 8, color: "text.secondary" }}>
                    <InboxIcon sx={{ fontSize: 64, mb: 2, opacity: 0.2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, opacity: 0.5 }}>
                      {noDataText}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.5 }}>
                      Try adjusting your search or filters
                    </Typography>
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
          sx={{
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        />
      )}
    </Paper>
  );
}
