"use client";

import React from "react";
import { useUser } from "@/app/context/UserContext";
import { Roles } from "@/app/_types/RoleType";
import { Box, Typography, CircularProgress } from "@mui/material";
import AccountsDashboard from "@/app/components/dashboard/AccountsDashboard";
import ProductionDashboard from "@/app/components/dashboard/ProductionDashboard";

export default function DashboardPage() {
  const { user } = useUser();

  if (!user) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  const isAccountAdmin = user.roles.includes(Roles.ACCOUNT_ADMIN);
  const isProductionAdmin = user.roles.includes(Roles.PRODUCTION_ADMIN);
  const isSuperAdmin = user.roles.includes(Roles.SUPER_ADMIN);

  // Default to Super Admin view or show specific ones
  if (isAccountAdmin) {
    return <AccountsDashboard />;
  }

  if (isProductionAdmin) {
    return <ProductionDashboard />;
  }

  if (isSuperAdmin) {
    // For now, Super Admin sees Accounts Dashboard as default
    return <AccountsDashboard />;
  }

  return (
    <Box sx={{ p: 4, textAlign: "center" }}>
      <Typography variant="h5">Welcome, {user.username}</Typography>
      <Typography variant="body1" color="text.secondary">
        Checking for assigned dashboard content...
      </Typography>
    </Box>
  );
}
