"use client";
import { useContext } from "react";
import {
  LoadingContext,
  type LoadingContextType,
} from "@/Context/LoadingContext";

export function useLoading(): LoadingContextType {
  const ctx = useContext(LoadingContext);
  if (!ctx)
    throw new Error("useLoading tem de ser usado dentro de <LoadingProvider>");
  return ctx;
}
