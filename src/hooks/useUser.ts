"use client";
import { useContext } from "react";
import { UserContext, type UserContextType } from "@/Context/UserContext";

export function useUser(): UserContextType {
  const ctx = useContext(UserContext);
  if (!ctx)
    throw new Error("useUser tem de ser usado dentro de <UserProvider>");
  return ctx;
}

export function useIsAdmin(): boolean {
  return useUser().authUser?.role === "admin";
}
