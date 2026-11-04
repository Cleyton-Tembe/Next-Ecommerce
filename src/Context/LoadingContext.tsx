"use client";
import { createContext, Dispatch, ReactNode, SetStateAction, useMemo, useState } from "react";

export type LoadingContextType = {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
};

export const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);

  const value = useMemo(() => ({ loading, setLoading }), [loading]);

  return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>;
};

export default LoadingProvider;
