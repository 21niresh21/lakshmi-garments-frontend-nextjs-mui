"use client";

import GenericTable from "@/app/components/shared/GenericTable";
import { Chip, Grid, IconButton } from "@mui/material";
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

/* ---------------- Error Normalizer ---------------- */

function normalizeError(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as any).response?.data === "string"
  ) {
    return (error as any).response.data;
  }
  return "Something went wrong. Please try again.";
}

export default function Page() {
  const { notify } = useNotification();
  const { showLoading, hideLoading } = useGlobalLoading();

  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<Employee[]>([]);

  const [openModal, setOpenModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );

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
    [notify, showLoading, hideLoading]
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
      showLoading();
      try {
        if (selectedEmployee) {
          await updateEmployee(selectedEmployee.id, data);
          notify("Employee updated successfully", "success");
        } else {
          await createEmployee(data);
          notify("Employee created successfully", "success");
        }

        setOpenModal(false);
        loadEmployees(search);
      } catch (err) {
        console.error(err);
        notify(normalizeError(err), "error");
      } finally {
        hideLoading();
      }
    },
    [selectedEmployee, notify, loadEmployees, search, showLoading, hideLoading]
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
    []
  );

  const rowActions = useMemo(
    () => [
      {
        label: "Edit",
        icon: () => (
          <IconButton size="small">
            <EditIcon sx={{ color: "gray" }} />
          </IconButton>
        ),
        onClick: (row: Employee) => handleEditEmployee(row),
      },
    ],
    [handleEditEmployee]
  );

  const toolbarExtras = useMemo(
    () => [
      <IconButton
        key="add-employee"
        onClick={handleAddEmployee}
        title="Add Employee"
      >
        <PersonAddAlt1Icon />
      </IconButton>,
    ],
    [handleAddEmployee]
  );

  /* ---------------- Render ---------------- */

  return (
    <Grid container>
      <Grid size={12}>
        <GenericTable<Employee>
          title="Employees"
          rows={rows}
          pagination={false}
          totalCount={rows.length}
          searchPlacedHolder="Search Employees..."
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
        initialData={
          selectedEmployee
            ? {
                name: selectedEmployee.name,
                skills: selectedEmployee.skills.map((skill) => skill.id),
              }
            : undefined
        }
        onClose={() => setOpenModal(false)}
        onSubmit={handleEmployeeSubmit}
      />
    </Grid>
  );
}
