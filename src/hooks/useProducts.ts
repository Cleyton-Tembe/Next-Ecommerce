"use client";
import { useContext } from "react";
import {
  ProductContext,
  type ProductContextType,
} from "@/Context/ProductContext";

export function useProducts(): ProductContextType {
  const ctx = useContext(ProductContext);
  if (!ctx)
    throw new Error("useProducts tem de ser usado dentro de <ProductProvider>");
  return ctx;
}
