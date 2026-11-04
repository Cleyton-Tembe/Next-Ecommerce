"use client";

import AxiosInstance from "@/lib/axio";
import { getErrorMessage } from "@/lib/getErrorMessage";
import type {
  CreateProductResponse,
  FeaturedProductsResponse,
  Product,
  ProductInput,
  ProductsResponse,
  ToggleFeaturedResponse,
} from "@/types/Product";
import {
  createContext,
  Dispatch,
  FormEvent,
  ReactNode,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";

// Re-exportados para não partir `import { ProductT } from "./ProductContext"`.
export type { Product, ProductInput } from "@/types/Product";
export type ProductT = Product;
export type ProductsData = ProductInput;

export interface ProductContextType {
  products: Product[];
  setProducts: Dispatch<SetStateAction<Product[]>>;
  handleCreateProducts: (e: FormEvent<HTMLFormElement>, productsData: ProductInput) => Promise<void>;
  handleFetchAllProducts: () => Promise<void>;
  fetchProductsByCategory: (category: string) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  toggleFeaturedProduct: (productId: string) => Promise<void>;
  fetchFeaturedProducts: () => Promise<void>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

export const ProductContext = createContext<ProductContextType | undefined>(undefined);

const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const handleCreateProducts = useCallback(
    async (e: FormEvent<HTMLFormElement>, productsData: ProductInput) => {
      e.preventDefault();
      try {
        setLoading(true);
        const { data } = await AxiosInstance.post<CreateProductResponse>("/products/new", productsData);
        if (data?.product) {
          setProducts((prev) => [...prev, data.product]);
        }
      } catch (error) {
        console.error("handleCreateProducts Context: ", error);
        toast.error(getErrorMessage(error, "Failed to create product"));
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const handleFetchAllProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await AxiosInstance.get<ProductsResponse>("/products");
      setProducts(data.products ?? []);
    } catch (error) {
      // em caso de erro mantém os produtos que já estavam no ecrã
      console.error("handleFetchAllProducts: ", error);
      toast.error(getErrorMessage(error, "Failed to fetch products"));
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProductsByCategory = useCallback(async (category: string) => {
    try {
      setLoading(true);
      const { data } = await AxiosInstance.get<ProductsResponse>(
        `/products/categorys/${encodeURIComponent(category)}`,
      );
      setProducts(data.products ?? []);
    } catch (error) {
      console.error("FetchProductsByCategory: ", error);
      toast.error(getErrorMessage(error, "Failed to fetch products"));
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProduct = useCallback(async (productId: string) => {
    try {
      setLoading(true);
      await AxiosInstance.delete(`/products/delete/${productId}`);
      setProducts((prev) => prev.filter((product) => product._id !== productId));
    } catch (error) {
      console.error("deleteProduct: ", error);
      toast.error(getErrorMessage(error, "Failed to delete product"));
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleFeaturedProduct = useCallback(async (productId: string) => {
    try {
      setLoading(true);
      const { data } = await AxiosInstance.patch<ToggleFeaturedResponse>(`/products/features/${productId}`);
      setProducts((prev) =>
        prev.map((product) =>
          product._id === productId ? { ...product, isFeatured: data.updatedProd.isFeatured } : product,
        ),
      );
    } catch (error) {
      console.error("toggleFeaturedProduct: ", error);
      toast.error(getErrorMessage(error, "Failed to update product"));
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFeaturedProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await AxiosInstance.get<FeaturedProductsResponse>("/products/features");
      setProducts(data.fproducts ?? []);
    } catch (error) {
      console.error("Error fetching featured products:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo<ProductContextType>(
    () => ({
      products,
      setProducts,
      handleCreateProducts,
      handleFetchAllProducts,
      fetchProductsByCategory,
      deleteProduct,
      toggleFeaturedProduct,
      fetchFeaturedProducts,
      loading,
      setLoading,
    }),
    [
      products,
      handleCreateProducts,
      handleFetchAllProducts,
      fetchProductsByCategory,
      deleteProduct,
      toggleFeaturedProduct,
      fetchFeaturedProducts,
      loading,
    ],
  );

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export default ProductProvider;
