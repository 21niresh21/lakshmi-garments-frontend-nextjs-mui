"use client";

import GenericTable from "@/app/components/shared/GenericTable";
import { Grid, Chip, IconButton, Badge, Stack, Tooltip, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReportIcon from "@mui/icons-material/Report";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import AppBreadcrumbs from "@/app/components/navigation/AppBreadcrumbs";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { fetchUsers, updateUser, createUser } from "@/app/api/userApi";
import { fetchRoles } from "@/app/api/roleApi";
import { useNotification } from "@/app/components/shared/NotificationProvider";
import { useUser } from "@/app/context/UserContext";

import UserFormModal from "@/app/components/shared/UserFomModal";
import { INITIAL_USER, UserErrors, UserListItem } from "@/app/_types/User";
import { Role } from "@/app/_types/Role";

const HEADERS = [
  { id: "id", label: "ID", sortable: true },
  { id: "firstName", label: "First Name" },
  { id: "lastName", label: "Last Name" },
  { id: "username", label: "Username" },
  { id: "roleName", label: "Role" },
  {
    id: "isActive",
    label: "User Status",
    render: (row: any) => (
      <Chip
        size="small"
        icon={
          row.isActive ? (
            <CheckCircleIcon color="success" />
          ) : (
            <ReportIcon color="error" />
          )
        }
        label={row.isActive ? "Active" : "Inactive"}
      />
    ),
  },
];

export default function Page() {
  const { user } = useUser();
  const { notify } = useNotification();
  const router = useRouter();

  const [rows, setRows] = useState<UserListItem[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null);
  const [formUser, setFormUser] = useState<UserListItem>(INITIAL_USER);
  const [errors, setErrors] = useState<UserErrors>({});

  const isEditMode = Boolean(selectedUser);

  /* ---------------- handlers ---------------- */

  const handleAddUser = () => {
    setSelectedUser(null);
    setFormUser(INITIAL_USER);
    setErrors({});
    setOpenModal(true);
  };

  const handleEditUserClick = (user: UserListItem) => {
    setSelectedUser(user);
    setFormUser({ ...user });
    setErrors({});
    setOpenModal(true);
  };

  const handleUserChange = (patch: Partial<UserListItem>) => {
    setFormUser((prev) => ({ ...prev, ...patch }));
    setErrors((prev) => {
      const next = { ...prev };
      Object.keys(patch).forEach((k) => delete next[k as keyof UserErrors]);
      return next;
    });
  };

  const validateUser = (): boolean => {
    const e: UserErrors = {};

    if (!formUser.firstName.trim()) e.firstName = "First name required";
    if (!formUser.username.trim()) e.username = "Username required";
    if (!formUser.roleName) e.roleName = "Role required";

    if (!isEditMode) {
      if (!formUser.password || formUser.password.length < 8) {
        e.password = "Password must be at least 8 characters";
      }
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateUser()) return;

    try {
      if (isEditMode) {
        const { id, password, ...payload } = formUser;
        await updateUser(id, payload);
        notify("User updated successfully", "success");
      } else {
        const { id, ...payload } = formUser;
        await createUser(payload);
        notify("User created successfully", "success");
      }

      setOpenModal(false);
      loadUsers();
    } catch (err: any) {
      if (err.validationErrors) {
        console.log(err.validationErrors);
        setErrors(err.validationErrors);
      } else {
        notify(err.message || "Error saving user", "error");
      }
    }
  };

  const loadUsers = async () => {
    const data = await fetchUsers({
      page: page,
      size: rowsPerPage,
      search: debouncedSearch,
    });
    setRows(data.content);
    setTotalCount(data.totalElements);
  };

  /* ---------------- effects ---------------- */

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    loadUsers();
  }, [page, rowsPerPage, debouncedSearch]);

  useEffect(() => {
    fetchRoles().then(setRoles);
  }, []);

  /* ---------------- render ---------------- */

  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 0.5, mx : 1 }}>
          <Typography variant="h4" fontWeight={600}>
            Users
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
        <GenericTable<UserListItem>
          rows={rows}
          pagination
          totalCount={totalCount}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={setPage}
          searchPlacedHolder="Search Users"
          onRowsPerPageChange={setRowsPerPage}
          searchValue={search}
          onSearchChange={setSearch}
          columns={HEADERS}
          rowActions={[
            {
              label: "Edit",
              icon: (row: UserListItem) =>
                row.username === user?.username ? null : (
                  <IconButton size="small">
                    <EditIcon sx={{ color: "gray" }} />
                  </IconButton>
                ),
              onClick: handleEditUserClick,
            },
          ]}
          toolbarExtras={
            <Stack direction="row">
              <Tooltip title="Add User">
                <IconButton onClick={handleAddUser}>
                  <PersonAddAlt1Icon />
                </IconButton>
              </Tooltip>
            </Stack>
          }
        />
      </Grid>

      <UserFormModal
        open={openModal}
        mode={isEditMode ? "edit" : "create"}
        initialData={formUser}
        onChange={handleUserChange}
        onClose={() => setOpenModal(false)}
        onSubmit={handleSubmit}
        errors={errors}
        roles={roles}
      />
    </Grid>
  );
}
