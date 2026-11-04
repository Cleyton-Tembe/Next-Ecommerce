"use client";
import { useContext } from "react";
import { UserContext, type UserContextType } from "@/Context/UserContext";

/** Acesso tipado ao utilizador autenticado. Dá erro claro se for usado fora do <UserProvider>. */
export function useUser(): UserContextType {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser tem de ser usado dentro de <UserProvider>");
  return ctx;
}

/** Atalho: `true` quando o utilizador autenticado é administrador. */
export function useIsAdmin(): boolean {
  return useUser().authUser?.role === "admin";
}
