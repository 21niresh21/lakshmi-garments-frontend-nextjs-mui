"use client";

import GenericTable from "@/app/components/shared/GenericTable";
import {
  Chip,
  Grid,
  IconButton,
  Stack,
  Typography,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNotification } from "@/app/components/shared/NotificationProvider";
import {
  createEmployee,
  fetchEmployees,
  updateEmployee,
} from "@/app/api/employeeApi";
import { Employee } from "@/app/_types/Employee";
import EmployeeFormModal, {
  EmployeeFormData,
} from "@/app/components/shared/EmployeeFormModal";
import { useGlobalLoading } from "@/app/components/layout/LoadingProvider";
import { normalizeError } from "@/app/utils/error";

/* ---------------- Error Normalizer ---------------- */

export type EmployeeErrors = {
  name?: string;
  skills?: string;
};

export default function Page() {
  const { notify } = useNotification();
  const { showLoading, hideLoading } = useGlobalLoading();

  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<Employee[]>([]);

  const [openModal, setOpenModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [errors, setErrors] = useState<EmployeeErrors>({});

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /* ---------------- Fetch Employees ---------------- */

  const loadEmployees = useCallback(
    async (query: string) => {
      showLoading();
      try {
        const data: any = await fetchEmployees({ search: query });
        setRows(data?.content ?? []);
      } catch (err) {
        notify(normalizeError(err), "error");
      } finally {
        hideLoading();
      }
    },
    [notify, showLoading, hideLoading],
  );

  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    searchTimeoutRef.current = setTimeout(() => loadEmployees(search), 400);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [search, loadEmployees]);

  /* ---------------- Add / Edit ---------------- */

  const handleAddEmployee = useCallback(() => {
    setSelectedEmployee(null);
    setOpenModal(true);
  }, []);

  const handleEditEmployee = useCallback((employee: Employee) => {
    setSelectedEmployee(employee);
    setOpenModal(true);
  }, []);

  const handleEmployeeSubmit = useCallback(
    async (data: EmployeeFormData) => {
      try {
        if (selectedEmployee) {
          await updateEmployee(selectedEmployee.id, data);
          notify("Employee updated successfully", "success");
        } else {
          await createEmployee(data);
          notify("Employee created successfully", "success");
        }

        setOpenModal(false);
        setErrors({});
        loadEmployees(search);
      } catch (err: any) {
        if (err.validationErrors) {
          setErrors(err.validationErrors);
        } else if (err.message && err.message !== "Validation failed") {
          notify(err.message || normalizeError(err), "error");
        }
      }
    },
    [selectedEmployee, notify, loadEmployees, search],
  );

  /* ---------------- Memoized Table Config ---------------- */

  const columns = useMemo(
    () => [
      { id: "id", label: "ID", sortable: false },
      { id: "name", label: "Employee Name", sortable: false },
      {
        id: "skills",
        label: "Skills",
        sortable: false,
        render: (row: Employee) =>
          row.skills.map((skill) => (
            <Chip
              key={skill.id}
              size="small"
              label={skill.name}
              sx={{ mx: 0.5 }}
            />
          )),
      },
    ],
    [],
  );

  const rowActions = useMemo(
    () => [
      {
        label: "Edit",
        icon: () => (
          <Tooltip title="Edit Employee">
            <IconButton size="small">
              <EditIcon sx={{ color: "gray" }} />
            </IconButton>
          </Tooltip>
        ),
        onClick: (row: Employee) => handleEditEmployee(row),
      },
    ],
    [handleEditEmployee],
  );

  const toolbarExtras = useMemo(
    () => [
      <Tooltip key="add-employee" title="Add Employee">
        <IconButton onClick={handleAddEmployee}>
          <PersonAddAlt1Icon />
        </IconButton>
      </Tooltip>,
    ],
    [handleAddEmployee],
  );

  const employeeInitialData = useMemo(
    () =>
      selectedEmployee
        ? {
            name: selectedEmployee.name,
            skills: selectedEmployee.skills.map((skill) => skill.id),
          }
        : undefined,
    [selectedEmployee],
  );

  /* ---------------- Render ---------------- */

  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          sx={{ mb: 0.5, mx: 1 }}
        >
          <Typography variant="h4" fontWeight={600}>
            Employees
          </Typography>
          <Chip
            label={`${rows.length}`}
            size="small"
            color="primary"
            sx={{ fontWeight: 700 }}
          />
        </Stack>
      </Grid>
      <Grid size={12}>
        <GenericTable<Employee>
          rows={rows}
          pagination={false}
          totalCount={rows.length}
          searchPlacedHolder="Search Employees"
          searchValue={search}
          onSearchChange={setSearch}
          columns={columns}
          rowActions={rowActions}
          toolbarExtras={toolbarExtras}
        />
      </Grid>

      {/* -------- Employee Modal (Create + Edit) -------- */}

      <EmployeeFormModal
        open={openModal}
        mode={selectedEmployee ? "edit" : "create"}
        initialData={employeeInitialData}
        errors={errors}
        setErrors={setErrors}
        onClose={() => {
          setOpenModal(false);
          setErrors({});
        }}
        onSubmit={handleEmployeeSubmit}
      />
    </Grid>
  );
}
