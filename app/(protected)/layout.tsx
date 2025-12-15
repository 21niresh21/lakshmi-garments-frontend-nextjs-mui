"use client";

import AppShell from "../components/layout/AppShell";
import { ConfirmationProvider } from "../components/shared/ConfirmationProvider";
import { NotificationProvider } from "../components/shared/NotificationProvider";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NotificationProvider>
      <ConfirmationProvider>
        <AppShell>{children}</AppShell>;
      </ConfirmationProvider>
    </NotificationProvider>
  );
}
