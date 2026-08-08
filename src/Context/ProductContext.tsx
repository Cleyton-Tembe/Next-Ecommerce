"use client";

import AxiosInstance from "@/lib/axio";
import { createContext, SubmitEvent, ReactNode, useState } from "react";
import toast from "react-hot-toast";

type ProductsData = {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isFeatured: boolean;
};

export type ProductT = ProductsData & {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
};

interface ProductContextType {
  products: ProductT[];
  setProducts: React.Dispatch<React.SetStateAction<ProductT[]>>;
  handleCreateProducts: (
    e: SubmitEvent<HTMLFormElement>,
    productsData: ProductsData,
  ) => Promise<void>;
  handleFetchAllProducts: () => Promise<void>;
  fetchProductsByCategory: (category: string) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  toggleFeaturedProduct: (productId: string) => Promise<void>;
  fetchFeaturedProducts: () => Promise<void>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ProductContext = createContext<ProductContextType | undefined>(
  undefined,
);

const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<ProductT[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleCreateProducts = async (
    e: SubmitEvent,
    productsData: ProductsData,
  ) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await AxiosInstance.post("/products/new", productsData);
      if (response.data?.product) {
        setProducts((prev) => [...prev, response.data.product]);
      }
    } catch (error) {
      console.error("handleCreateProducts Context: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchAllProducts = async () => {
    const fallbackP = products;
    try {
      setLoading(true);
      const response = await AxiosInstance.get("/products");
      console.log("reponse: ", response);
      setProducts(response.data.products);
    } catch (error) {
      setProducts(fallbackP);
      console.log("handleFetchAllProducts: ", error);
      toast.error(error.response.data.error || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const fetchProductsByCategory = async (category: string) => {
    try {
      setLoading(true);
      const response = await AxiosInstance.get(
        `/products/categorys/${category}`,
      );
      setProducts(response.data.products);
    } catch (error) {
      console.log("FetchProductsByCategory: ", error);
      toast.error(error.response.data.error || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      setLoading(true);
      await AxiosInstance.delete(`/products/delete/${productId}`);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== productId),
      );
    } catch (error) {
      console.log("deleteProduct: ", error);
      toast.error(error.response.data.error || "Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  const toggleFeaturedProduct = async (productId: string) => {
    try {
      setLoading(true);
      const response = await AxiosInstance.patch(
        `/products/features/${productId}`,
      );
      // this will update the isFeatured prop of the product
      console.log(response);
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId
            ? { ...product, isFeatured: response.data.updatedProd.isFeatured }
            : product,
        ),
      );
    } catch (error) {
      console.log("toggleFeaturedProduct: ", error);
      toast.error(error.response.data.error || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const response = await AxiosInstance.get("/products/features");
      setProducts(response.data.fproducts);
    } catch (error) {
      console.log("Error fetching featured products:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        setProducts,
        handleCreateProducts,
        setLoading,
        loading,
        handleFetchAllProducts,
        deleteProduct,
        toggleFeaturedProduct,
        fetchFeaturedProducts,
        fetchProductsByCategory,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;
