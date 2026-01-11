"use client";

import { useEffect, useState } from "react";
import AppShell from "../components/layout/AppShell";
import { ConfirmationProvider } from "../components/shared/ConfirmationProvider";
import { NotificationProvider } from "../components/shared/NotificationProvider";
import { User } from "../_types/User";
import { UserProvider } from "../context/UserContext";
import { ThemeProvider } from "@mui/material";
import theme from "../themes/theme";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    // <ThemeProvider theme={theme}>
    <UserProvider user={user}>
      <NotificationProvider>
        <ConfirmationProvider>
          <AppShell>{children}</AppShell>;
        </ConfirmationProvider>
      </NotificationProvider>
    </UserProvider>
    // </ThemeProvider>
  );
}
