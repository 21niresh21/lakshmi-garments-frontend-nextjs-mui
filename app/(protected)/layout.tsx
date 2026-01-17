"use client";

import { useEffect, useState } from "react";
import AppShell from "../components/layout/AppShell";
import { ConfirmationProvider } from "../components/shared/ConfirmationProvider";
import { NotificationProvider } from "../components/shared/NotificationProvider";
import { AuthUser } from "../_types/User";
import { UserProvider } from "../context/UserContext";
import { Box, LinearProgress, ThemeProvider } from "@mui/material";
import theme from "../themes/theme";
import {
  LoadingProvider,
  useGlobalLoading,
} from "../components/layout/LoadingProvider";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    // <ThemeProvider theme={theme}>
    <LoadingProvider>
      <GlobalLinearLoading />
      <UserProvider user={user}>
        <NotificationProvider>
          <ConfirmationProvider>
            <AppShell>{children}</AppShell>;
          </ConfirmationProvider>
        </NotificationProvider>
      </UserProvider>
    </LoadingProvider>
    // </ThemeProvider>
  );
}

function GlobalLinearLoading() {
  const { loading } = useGlobalLoading();

  return (
    <Box sx={{ position: "fixed", top: 64, left: 0, right: 0, zIndex: 1200 }}>
      {loading && <LinearProgress />}
    </Box>
  );
}
