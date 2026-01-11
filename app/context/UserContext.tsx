// app/context/UserContext.tsx
"use client";

import { createContext, useContext } from "react";
import { AuthUser } from "../_types/User";

interface UserContextValue {
  user: AuthUser | null;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({
  user,
  children,
}: {
  user: AuthUser | null;
  children: React.ReactNode;
}) {
  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser must be used within UserProvider");
  }
  return ctx;
}
