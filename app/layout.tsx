import type { ReactNode } from "react";
import ThemeRegistry from "./ThemeRegistry";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" style={{ overflow: "hidden" }}>
      <body style={{ margin: 0, height: "100vh" }}>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
