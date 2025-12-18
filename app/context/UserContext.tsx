// app/context/UserContext.tsx
"use client";

import { createContext, useContext } from "react";
import { User } from "../_types/User";

interface UserContextValue {
  user: User | null;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({
  user,
  children,
}: {
  user: User | null;
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
