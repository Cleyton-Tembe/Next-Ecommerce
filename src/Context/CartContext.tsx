"use client";
import AxiosInstance from "@/lib/axio";
import { getErrorMessage } from "@/lib/getErrorMessage";
import type {
  CartItem,
  CartResponse,
  Coupon,
  MyCouponResponse,
  Product,
  ValidateCouponResponse,
} from "@/types/Product";
import {
  createContext,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";

export type { CartItem, Coupon, Product } from "@/types/Product";

export interface CartContextType {
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
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  calculateTotals: () => void;
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined,
);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [isCouponApplied, setIsCouponApplied] = useState(false);

  const { subtotal, total } = useMemo(() => {
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const discount =
      coupon && isCouponApplied
        ? subtotal * (coupon.discountPercentage / 100)
        : 0;
    return { subtotal, total: subtotal - discount };
  }, [cart, coupon, isCouponApplied]);

  const getMyCoupon = useCallback(async () => {
    try {
      const { data } =
        await AxiosInstance.get<MyCouponResponse>("/products/coupons");

      setCoupon(data.coupon);
    } catch (error) {
      console.error("Error fetching coupon:", error);
    }
  }, []);

  const applyCoupon = useCallback(async (code: string) => {
    try {
      const { data } = await AxiosInstance.post<ValidateCouponResponse>(
        "/products/coupons/validate",
        { code },
      );

      setCoupon((prev) => ({
        ...prev,
        code: data.code,
        discountPercentage: data.discountPercentage,
      }));
      setIsCouponApplied(true);
      toast.success("Coupon applied successfully");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to apply coupon"));
    }
  }, []);

  const removeCoupon = useCallback(() => {
    setCoupon(null);
    setIsCouponApplied(false);
    toast.success("Coupon removed");
  }, []);

  const getCartItems = useCallback(async () => {
    try {
      const { data } = await AxiosInstance.get<CartResponse>("/products/cart");
      setCart(data.cart ?? []);
    } catch (error) {
      setCart([]);
      toast.error(getErrorMessage(error, "An error occurred"));
    }
  }, []);

  const clearCart = useCallback(async () => {
    setCart([]);
    setIsCouponApplied(false);
    setCoupon(null);
  }, []);

  const addToCart = useCallback(async (product: Product) => {
    try {
      await AxiosInstance.post("/products/cart/adds", { id: product._id });
      toast.success("Product added to cart");

      setCart((prev) => {
        const existing = prev.find((item) => item._id === product._id);
        if (existing) {
          return prev.map((item) =>
            item._id === product._id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          );
        }
        return [...prev, { ...product, quantity: 1 }];
      });
    } catch (error) {
      toast.error(getErrorMessage(error, "An error occurred"));
    }
  }, []);

  const removeFromCart = useCallback(async (productId: string) => {
    try {
      await AxiosInstance.delete("/products/cart/delete", {
        data: { id: productId },
      });
      setCart((prev) => prev.filter((item) => item._id !== productId));
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to remove item"));
    }
  }, []);

  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      if (quantity === 0) {
        await removeFromCart(productId);
        return;
      }

      try {
        await AxiosInstance.put(`/products/cart/${productId}`, { quantity });
        setCart((prev) =>
          prev.map((item) =>
            item._id === productId ? { ...item, quantity } : item,
          ),
        );
      } catch (error) {
        toast.error(getErrorMessage(error, "Failed to update quantity"));
      }
    },
    [removeFromCart],
  );

  const calculateTotals = useCallback(() => {}, []);

  const value = useMemo<CartContextType>(
    () => ({
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
    }),
    [
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
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
