"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Avatar,
  Divider,
  Stack,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useUser } from "@/app/context/UserContext";
import { fetchUserByUsername, updateUser, changePassword } from "@/app/api/userApi";
import { useNotification } from "@/app/components/shared/NotificationProvider";
import PersonIcon from "@mui/icons-material/Person";
import SaveIcon from "@mui/icons-material/Save";
import { UserListItem, UserErrors } from "@/app/_types/User";
import { useGlobalLoading } from "@/app/components/layout/LoadingProvider";
import AppBreadcrumbs from "@/app/components/navigation/AppBreadcrumbs";

export default function ProfilePage() {
  const { user } = useUser();
  const { notify } = useNotification();
  const { loading, showLoading, hideLoading } = useGlobalLoading();

  const [profile, setProfile] = useState<UserListItem | null>(null);
  const [originalProfile, setOriginalProfile] = useState<UserListItem | null>(null);
  const [errors, setErrors] = useState<UserErrors & { oldPassword?: string; newPassword?: string; confirmPassword?: string }>({});

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user?.username) {
      loadProfile(user.username);
    }
  }, [user]);

  const loadProfile = async (username: string) => {
    showLoading();
    try {
      const data = await fetchUserByUsername(username);
      setProfile(data);
      setOriginalProfile(data);
    } catch (err) {
      notify("Failed to load profile details", "error");
    } finally {
      hideLoading();
    }
  };

  const handleChange = (field: keyof UserListItem, value: string) => {
    if (profile) {
      setProfile({ ...profile, [field]: value });
      if (errors[field]) {
        setErrors({ ...errors, [field]: undefined });
      }
    }
  };

  const handleBlur = (field: keyof UserListItem, value: string) => {
    if (profile) {
      setProfile({ ...profile, [field]: value.trim() });
      if (errors[field]) {
        setErrors({ ...errors, [field]: undefined });
      }
    }
  };

  const handlePasswordChange = (field: "oldPassword" | "newPassword" | "confirmPassword", value: string) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleApply = async () => {
    if (!profile || !user?.username || !originalProfile) return;

    // Frontend Check: Is anything actually changed?
    const isProfileUnchanged = 
      profile.firstName === originalProfile.firstName && 
      profile.lastName === originalProfile.lastName;
    
    const isPasswordUnchanged = passwords.newPassword.trim() === "";

    if (isProfileUnchanged && isPasswordUnchanged) {
      notify("Profile updated successfully", "success");
      return;
    }

    showLoading();
    try {
      // 1. If new password is provided, call change-password API
      if (!isPasswordUnchanged) {
        const passErrors: any = {};
        if (!passwords.oldPassword.trim()) {
          passErrors.oldPassword = "Old password is required to set a new one";
        }
        if (passwords.newPassword.length < 8) {
          passErrors.newPassword = "New password must be at least 8 characters long";
        }
        if (passwords.newPassword === passwords.oldPassword) {
          passErrors.newPassword = "New password cannot be the same as the old password";
        }
        if (passwords.newPassword !== passwords.confirmPassword) {
          passErrors.confirmPassword = "Passwords do not match";
        }

        if (Object.keys(passErrors).length > 0) {
          setErrors(prev => ({ ...prev, ...passErrors }));
          throw new Error("Validation failed");
        }

        await changePassword(user.username, {
          oldPassword: passwords.oldPassword,
          newPassword: passwords.newPassword,
        });
      }

      // 2. Update general profile details (exclude password and id)
      if (!isProfileUnchanged) {
        const { id, password, ...payload } = profile;
        await updateUser(id, payload);
      }

      notify("Profile updated successfully", "success");
      setErrors({});
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setOriginalProfile({ ...profile });
    } catch (err: any) {
      if (err.validationErrors) {
        setErrors(err.validationErrors);
      } else if (err.message !== "Validation failed") {
        notify(err.message || "Failed to update profile", "error");
      }
    } finally {
      hideLoading();
    }
  };

  if (!profile) {
    if (loading) return null;
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">User profile not found.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1000, mx: "auto" }}>
      {/* <Box sx={{ mb: 2 }}>
        <AppBreadcrumbs />
      </Box> */}
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar 
          sx={{ 
            bgcolor: "primary.main", 
            width: 54, 
            height: 54, 
            fontSize: "1.5rem", 
            fontWeight: 800,
            color: "primary.contrastText"
          }}
        >
          {profile.username?.[0]?.toUpperCase() || "U"}
        </Avatar>
        <Box>
          <Typography variant="h5" fontWeight={800}>
            My Profile
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your personal information and account security.
          </Typography>
        </Box>
      </Box>

      <Paper
        elevation={3}
        sx={{
          p: 4,
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Personal Information
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Stack spacing={3}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="First Name"
                fullWidth
                value={profile.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                onBlur={(e) => handleBlur("firstName", e.target.value)}
                error={!!errors.firstName}
                helperText={errors.firstName}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Last Name"
                fullWidth
                value={profile.lastName}
                onBlur={(e) => handleBlur("lastName", e.target.value)}
                onChange={(e) => handleChange("lastName", e.target.value)}
                error={!!errors.lastName}
                helperText={errors.lastName}
              />
            </Grid>
          </Grid>

          {/* <TextField
            label="Username"
            fullWidth
            disabled
            value={profile.username}
            helperText="Username cannot be changed"
          />

          <TextField
            label="Role"
            fullWidth
            disabled
            value={profile.roleName}
            helperText="Contact admin to change your role"
          /> */}

          <Box sx={{ pt: 2 }}>
            <Typography variant="subtitle2" fontWeight={700} gutterBottom color="primary">
              Change Password
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
              Leave these fields blank if you do not want to change your password.
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="Current Password"
                fullWidth
                type="password"
                value={passwords.oldPassword}
                onChange={(e) => handlePasswordChange("oldPassword", e.target.value)}
                error={!!errors.oldPassword}
                helperText={errors.oldPassword}
              />
              <TextField
                label="New Password"
                fullWidth
                type="password"
                value={passwords.newPassword}
                onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                error={!!errors.newPassword}
                helperText={errors.newPassword}
              />
              <TextField
                label="Confirm New Password"
                fullWidth
                type="password"
                value={passwords.confirmPassword}
                onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
              />
            </Stack>
          </Box>
        </Stack>

        <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleApply}
            sx={{ px: 4, borderRadius: 2, fontWeight: 700 }}
          >
            Save Changes
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
