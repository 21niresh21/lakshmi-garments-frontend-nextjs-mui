"use client";

import {
  Autocomplete,
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { fetchEmployees } from "@/app/api/employeeApi";
import { fetchJobworksByEmployee } from "@/app/api/jobworkApi";
import { Employee } from "@/app/_types/Employee";
import { useNotification } from "@/app/components/shared/NotificationProvider";
import { useGlobalLoading } from "@/app/components/layout/LoadingProvider";
import { formatToShortDateTime } from "@/app/utils/date";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

type JobworkItem = {
  itemName: string | null;
  quantity: number;
};

type EmployeeJobwork = {
  jobworkNumber: string;
  jobworkType: string;
  jobworkStatus: string;
  batchSerialCode: string;
  startedAt: string;
  updatedAt: string;
  remarks: string;
  items: JobworkItem[];
};

const STATUS_COLOR_MAP: Record<
  string,
  "default" | "primary" | "success" | "warning" | "error"
> = {
  PENDING_RETURN: "warning",
  CLOSED: "success",
  CANCELLED: "error",
  ASSIGNED: "primary",
};

export default function EmployeeLookupPage() {
  const { notify } = useNotification();
  const { loading, showLoading, hideLoading } = useGlobalLoading();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // null = not searched yet
  const [jobworks, setJobworks] = useState<EmployeeJobwork[] | null>(null);

  const handleCopyJobworkNumber = (jobworkNumber: string) => {
    navigator.clipboard.writeText(jobworkNumber);
    notify(`Copied ${jobworkNumber} to clipboard`, "success");
  };

  useEffect(() => {
    fetchEmployees()
      .then((res: any) => setEmployees(res?.content ?? []))
      .catch(() => notify("Error fetching employees", "error"));
  }, [notify]);

  const handleSubmit = async () => {
    if (!selectedEmployee || loading) return;

    showLoading();
    try {
      const data = await fetchJobworksByEmployee(selectedEmployee.name);

      const sorted = data.sort(
        (a: EmployeeJobwork, b: EmployeeJobwork) =>
          new Date(b.startedAt).getTime() -
          new Date(a.startedAt).getTime()
      );

      setJobworks(sorted);
    } catch (error) {
      notify("Error fetching jobworks", "error");
      setJobworks([]);
    } finally {
      hideLoading();
    }
  };

  const getTotalQuantity = (items: JobworkItem[]) =>
    items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Box >
      <Typography variant="h5" fontWeight={600} mb={3}>
        Employee Jobwork Lookup
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Autocomplete
            sx={{ minWidth: 300 }}
            openOnFocus
            autoHighlight
            options={employees}
            getOptionLabel={(emp) => emp.name}
            value={selectedEmployee}
            isOptionEqualToValue={(option, value) =>
              option.id === value.id
            }
            onChange={(_, employee) => {
              setSelectedEmployee(employee);
              setJobworks(null);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Employee"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault(); // prevent form submit / blur
                    handleSubmit();
                  }
                }}
              />
            )}
          />

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!selectedEmployee || loading}
            sx={{ height: 40 }}
          >
            Search
          </Button>
        </Stack>
      </Paper>

      {/* Results table */}
      {jobworks && jobworks.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Jobwork Number</strong></TableCell>
                <TableCell><strong>Type</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Batch</strong></TableCell>
                <TableCell><strong>Items / Quantity</strong></TableCell>
                <TableCell><strong>Started At</strong></TableCell>
                <TableCell><strong>Remarks</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobworks.map((jobwork) => (
                <TableRow key={jobwork.jobworkNumber} hover>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="body2" fontWeight={500}>
                        {jobwork.jobworkNumber}
                      </Typography>
                      <Tooltip title="Copy Jobwork Number">
                        <IconButton
                          onClick={() => handleCopyJobworkNumber(jobwork.jobworkNumber)}
                          size="small"
                          color="primary"
                        >
                          <ContentCopyIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>

                  <TableCell>
                    <Chip label={jobwork.jobworkType} size="small" />
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={jobwork.jobworkStatus}
                      size="small"
                      color={
                        STATUS_COLOR_MAP[jobwork.jobworkStatus] ||
                        "default"
                      }
                    />
                  </TableCell>

                  <TableCell>{jobwork.batchSerialCode}</TableCell>

                  <TableCell>
                    {jobwork.jobworkType === "CUTTING" ? (
                      <Typography variant="body2">
                        Qty: {getTotalQuantity(jobwork.items)}
                      </Typography>
                    ) : (
                      <Box>
                        {jobwork.items.map((item, idx) => (
                          <Typography
                            key={idx}
                            variant="body2"
                            sx={{ fontSize: "0.875rem" }}
                          >
                            {item.itemName} ({item.quantity})
                          </Typography>
                        ))}
                      </Box>
                    )}
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2">
                      {formatToShortDateTime(jobwork.startedAt)}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {jobwork.remarks || "-"}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Empty state */}
      {jobworks &&
        jobworks.length === 0 &&
        selectedEmployee &&
        !loading && (
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography color="text.secondary">
              No jobworks found for {selectedEmployee.name}
            </Typography>
          </Paper>
        )}
    </Box>
  );
}
