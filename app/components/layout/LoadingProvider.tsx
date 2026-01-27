// app/components/shared/LoadingProvider.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useMemo,
} from "react";

interface LoadingContextProps {
  setLoading: (value: boolean) => void;
  showLoading: () => void;
  hideLoading: () => void;
  loading: boolean;
}

const LoadingContext = createContext<LoadingContextProps | undefined>(
  undefined
);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoadingState] = useState(false);

  const setLoading = useCallback((value: boolean) => {
    setLoadingState(value);
  }, []);

  const showLoading = useCallback(() => setLoadingState(true), []);
  const hideLoading = useCallback(() => setLoadingState(false), []);

  const value = useMemo(
    () => ({ loading, setLoading, showLoading, hideLoading }),
    [loading, setLoading, showLoading, hideLoading]
  );

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useGlobalLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useGlobalLoading must be used within a LoadingProvider");
  }
  return context;
};
