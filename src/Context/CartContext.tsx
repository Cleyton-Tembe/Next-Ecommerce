"use client";
import AxiosInstance from "@/lib/axio";
import { createContext, ReactNode, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { ProductT } from "./ProductContext";

// --- 1. TYPES based on your Mongoose Models ---

export type Coupon = {
  _id: string;
  code: string;
  discountPercentage: number;
  expirationDate: string; // Dates are usually serialized as ISO strings in JSON responses
  isActive: boolean;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isFeatured: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type CartItem = Product & {
  quantity: number;
};

interface CartContextType {
  cart: CartItem[];
  coupon: Coupon | null;
  total: number;
  subtotal: number;
  isCouponApplied: boolean;
  getMyCoupon: () => Promise<void>;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => void;
  getCartItems: () => Promise<void>;
  clearCart: () => Promise<void>;
  addToCart: (product: ProductT) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  calculateTotals: () => void;
}

// --- 2. CONTEXT INITIALIZATION ---

export const CartContext = createContext<CartContextType | undefined>(
  undefined,
);

// --- 3. PROVIDER COMPONENT ---

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [isCouponApplied, setIsCouponApplied] = useState<boolean>(false);

  const getMyCoupon = async () => {
    try {
      const response = await AxiosInstance.get("/products/coupons");
      setCoupon(response.data);
    } catch (error: any) {
      console.error("Error fetching coupon:", error);
    }
  };

  const applyCoupon = async (code: string) => {
    try {
      const response = await AxiosInstance.post("/products/coupons/validate", {
        code,
      });
      setCoupon(response.data);
      setIsCouponApplied(true);
      toast.success("Coupon applied successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to apply coupon");
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setIsCouponApplied(false);
    toast.success("Coupon removed");
  };

  const getCartItems = async () => {
    try {
      const res = await AxiosInstance.get("/products/cart");
      setCart(res.data.cart);
    } catch (error: any) {
      setCart([]);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  const clearCart = async () => {
    setCart([]);
    setIsCouponApplied(false);
    setCoupon(null);
    setTotal(0);
    setSubtotal(0);
  };

  const addToCart = async (product: ProductT) => {
    try {
      await AxiosInstance.post("/products/cart/adds", { id: product._id });
      toast.success("Product added to cart");

      setCart((prevState) => {
        const existingItem = prevState.find((item) => item._id === product._id);
        if (existingItem) {
          return prevState.map((item) =>
            item._id === product._id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          );
        }
        return [...prevState, { ...product, quantity: 1 }];
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      await AxiosInstance.delete(`/products/cart/delete`, {
        data: { id: productId },
      });
      setCart((prevState) =>
        prevState.filter((item) => item._id !== productId),
      );
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to remove item");
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(productId);
      return;
    }

    try {
      await AxiosInstance.put(`/products/cart/${productId}`, { quantity });
      setCart((prevState) =>
        prevState.map((item) =>
          item._id === productId ? { ...item, quantity: quantity } : item,
        ),
      );
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update quantity");
    }
  };

  const calculateTotals = () => {
    const newSubtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    let newTotal = newSubtotal;

    if (coupon && isCouponApplied) {
      const discount = newSubtotal * (coupon.discountPercentage / 100);
      newTotal = newSubtotal - discount;
    }

    setSubtotal(newSubtotal);
    setTotal(newTotal);
  };

  useEffect(() => {
    calculateTotals();
  }, [cart, coupon, isCouponApplied]);

  return (
    <CartContext.Provider
      value={{
        cart,
        coupon,
        total,
        subtotal,
        isCouponApplied,
        getMyCoupon,
        applyCoupon,
        removeCoupon,
        getCartItems,
        clearCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        calculateTotals,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
