import type { ReactNode } from "react";
import ThemeRegistry from "./ThemeRegistry";
import IdleSessionManager from "./components/shared/IdleSessionManager";
import { AuthProvider } from "./context/AuthProvider";
import { HistoryProvider } from "./context/HistoryContext";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" style={{ overflow: "hidden" }}>
      <body style={{ margin: 0, height: "100vh" }}>
        <AuthProvider>
          <HistoryProvider>
            <IdleSessionManager />
            <ThemeRegistry>{children}</ThemeRegistry>
          </HistoryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
