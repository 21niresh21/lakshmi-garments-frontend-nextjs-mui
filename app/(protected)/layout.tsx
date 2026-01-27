"use client";

import { useEffect, useState } from "react";
import AppShell from "../components/layout/AppShell";
import { ConfirmationProvider } from "../components/shared/ConfirmationProvider";
import { NotificationProvider } from "../components/shared/NotificationProvider";
import { AuthUser } from "../_types/User";
import { UserProvider } from "../context/UserContext";
import {
  Box,
  LinearProgress,
  ThemeProvider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import theme from "../themes/theme";
import {
  LoadingProvider,
  useGlobalLoading,
} from "../components/layout/LoadingProvider";
import { useAuthorization } from "../hooks/useAuthorization";

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
    <LoadingProvider>
      <GlobalLinearLoading />
      <UserProvider user={user}>
        <AuthorizationGuard>
          <NotificationProvider>
            <ConfirmationProvider>
              <AppShell>{children}</AppShell>
            </ConfirmationProvider>
          </NotificationProvider>
        </AuthorizationGuard>
      </UserProvider>
    </LoadingProvider>
  );
}

function AuthorizationGuard({ children }: { children: React.ReactNode }) {
  const { isAuthorized } = useAuthorization();

  if (isAuthorized === false) {
    return null;
  }

  return <>{children}</>;
}

function GlobalLinearLoading() {
  const { loading } = useGlobalLoading();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        position: "fixed",
        top: isMobile ? 56.5 : 64,
        left: 0,
        right: 0,
        zIndex: 1200,
      }}
    >
      {loading && <LinearProgress />}
    </Box>
  );
}
