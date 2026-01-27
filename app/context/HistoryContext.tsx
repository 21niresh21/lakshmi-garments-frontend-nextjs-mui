"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

interface HistoryContextType {
  previousPath: string | null;
}

const HistoryContext = createContext<HistoryContextType>({ previousPath: null });

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [previousPath, setPreviousPath] = useState<string | null>(null);
  const currentPathRef = useRef<string | null>(pathname);

  useEffect(() => {
    // When pathname changes, the old currentPath becomes the previousPath
    if (currentPathRef.current !== pathname) {
      setPreviousPath(currentPathRef.current);
      currentPathRef.current = pathname;
    }
  }, [pathname]);

  return (
    <HistoryContext.Provider value={{ previousPath }}>
      {children}
    </HistoryContext.Provider>
  );
}

export const useHistory = () => useContext(HistoryContext);
