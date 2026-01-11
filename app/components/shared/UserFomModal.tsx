"use client";

import { Role } from "@/app/_types/Role";
import { UserErrors, UserListItem } from "@/app/_types/User";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  FormControlLabel,
  Switch,
  Autocomplete,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

type InvoiceFormModalProps = {
  open: boolean;
  mode: "create" | "edit";
  initialData: UserListItem;
  loading?: boolean;
  onChange: (patch: Partial<UserListItem>) => void;
  onClose: () => void;
  onSubmit: (data: UserListItem) => void;
  roles: Role[];
  errors: UserErrors;
};

export default function UserFormModal({
  open,
  mode,
  initialData,
  loading = false,
  onClose,
  onSubmit,
  errors,
  onChange,
  roles,
}: InvoiceFormModalProps) {
  console.log(initialData);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {mode === "create" ? "Add User" : "Edit User"}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="First name"
              value={initialData.firstName}
              onChange={(e) => onChange({ firstName: e.target.value })}
              onBlur={(e) => onChange({ firstName: e.target.value.trim() })}
              fullWidth
              required
              error={!!errors.firstName}
              helperText={errors.firstName}
            />

            <TextField
              label="Last name"
              value={initialData.lastName}
              onChange={(e) => onChange({ lastName: e.target.value })}
              onBlur={(e) => onChange({ lastName: e.target.value.trim() })}
              fullWidth
              error={!!errors.lastName}
              helperText={errors.lastName}
            />

            <TextField
              label="Username"
              value={initialData.username}
              onChange={(e) => onChange({ username: e.target.value })}
              onBlur={(e) => onChange({ username: e.target.value.trim() })}
              fullWidth
              required
              error={!!errors.username}
              helperText={errors.username}
            />

            <Autocomplete
              openOnFocus
              id="role-autocomplete"
              disablePortal
              autoHighlight
              options={roles.map((s) => s.name)}
              value={initialData.roleName}
              onChange={(_, role) => onChange({ roleName: role ?? "" })}
              renderInput={(params) => (
                <TextField
                  {...params}
                  id="role-input"
                  label="Role"
                  error={!!errors.roleName}
                  helperText={errors.roleName}
                />
              )}
            />
            {mode === "create" && (
              <TextField
                label="Password"
                type="password"
                value={initialData.password ?? ""}
                onChange={(e) => onChange({ password: e.target.value })}
                fullWidth
                required
                error={!!errors.password}
                helperText={errors.password}
              />
            )}
          </Stack>
          <FormControlLabel
            control={
              <Switch
                checked={initialData.isActive}
                onChange={(e) => onChange({ isActive: e.target.checked })}
              />
            }
            label="User Status"
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => onSubmit(initialData)}
            loading={loading}
            loadingPosition="end"
          >
            {mode === "create" ? "Create" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
