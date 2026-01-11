"use client";

import GenericTable from "@/app/components/shared/GenericTable";
import { Chip, Grid, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { useEffect, useState } from "react";
import { useNotification } from "@/app/components/shared/NotificationProvider";
// import {
//   fetchSuppliers,
//   updateSupplier,
//   addSupplier,
// } from "@/app/api/employeeApi";
import SupplierFormModal, {
  SupplierFormData,
} from "@/app/components/shared/SupplierFormModal";
import {
  createEmployee,
  fetchEmployees,
  updateEmployee,
} from "@/app/api/employeeApi";
import { Employee } from "@/app/_types/Employee";
import EmployeeFormModal, {
  EmployeeFormData,
} from "@/app/components/shared/EmployeeFormModal";

export default function Page() {
  const { notify } = useNotification();

  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<Employee[]>([]);

  const [openModal, setOpenModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );

  /* ---------------- Fetch Employees ---------------- */

  const loadEmployees = async () => {
    try {
      const data : any = await fetchEmployees();
      setRows(data.content);
    } catch (err) {
      notify("Error fetching employees", "error");
    }
  };

  useEffect(() => {
    loadEmployees();
  }, [search]);

  /* ---------------- Add / Edit Handlers ---------------- */

  const handleAddEmployee = () => {
    setSelectedEmployee(null); // IMPORTANT
    setOpenModal(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setOpenModal(true);
  };

  const handleEmployeeSubmit = async (data: EmployeeFormData) => {
    console.log(data)
    try {
      if (selectedEmployee) {
        // EDIT
        await updateEmployee(selectedEmployee.id, data);
        notify("Employee updated successfully", "success");
      } else {
        // CREATE
        await createEmployee(data);
        notify("Employee created successfully", "success");
      }

      setOpenModal(false);
      setSelectedEmployee(null);
      loadEmployees();
    } catch (err: any) {
      console.error(err);
      notify(err?.response?.data ?? "Error saving employee", "error");
    }
  };

  useEffect(() => {
    if (!openModal) {
      setSelectedEmployee(null);
    }
  }, [openModal]);

  /* ---------------- Render ---------------- */

  return (
    <Grid container>
      <Grid size={12}>
        <GenericTable<Employee>
          title="Employees"
          rows={rows ?? []}
          pagination={false}
          totalCount={rows.length}
          searchPlacedHolder="Search Employees..."
          searchValue={search}
          onSearchChange={setSearch}
          columns={[
            { id: "id", label: "ID", sortable: false },
            { id: "name", label: "Employee Name", sortable: false },
            {
              id: "skills",
              label: "Skills",
              sortable: false,
              render: (row: any) =>
                row.skills.map((skill: any) => (
                  <Chip
                    size="small"
                    key={skill.id}
                    label={skill.name}
                    sx={{ mx: 0.5 }}
                  />
                )),
            },
          ]}
          rowActions={[
            {
              label: "Edit",
              icon: () => (
                <IconButton size="small">
                  <EditIcon sx={{ color: "gray" }} />
                </IconButton>
              ),
              onClick: (row: Employee) => handleEditEmployee(row),
            },
          ]}
          toolbarExtras={[
            <IconButton
              key="add-employee"
              onClick={handleAddEmployee}
              title="Add Employee"
            >
              <PersonAddAlt1Icon />
            </IconButton>,
          ]}
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
        onClose={() => {
          setOpenModal(false);
        }}
        onSubmit={handleEmployeeSubmit}
      />
    </Grid>
  );
}
