"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  hasToken: boolean;
  setHasToken: (val: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  hasToken: false,
  setHasToken: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [hasToken, setHasToken] = useState(false);

  return (
    <AuthContext.Provider value={{ hasToken, setHasToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
