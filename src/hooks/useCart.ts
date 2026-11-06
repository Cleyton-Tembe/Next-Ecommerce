"use client";
import { useContext } from "react";
import { CartContext, type CartContextType } from "@/Context/CartContext";

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx)
    throw new Error("useCart tem de ser usado dentro de <CartProvider>");
  return ctx;
}
