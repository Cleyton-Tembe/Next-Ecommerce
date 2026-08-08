"use client";

import CartContext from "@/Context/CartContext";
import AxiosInstance from "@/lib/axio";
import { ArrowRight, CheckCircle, HandHeart } from "lucide-react";
import Confetti from "react-confetti";
import Link from "next/link";
import { use, useContext, useEffect, useState } from "react";

const PurchaseSuccess = ({
  searchParams,
}: {
  searchParams: Promise<{ session_id: string }>;
}) => {
  const { session_id } = use(searchParams);
  const [isProcessing, setIsProcessing] = useState<boolean>(true);
  const { clearCart } = useContext(CartContext);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCheckoutSuccess = async (sessionId: string) => {
      try {
        await AxiosInstance.post("/payments/checkout-success", {
          session_id: sessionId,
        });
        clearCart();
      } catch (error) {
        console.log(error);
      } finally {
        setIsProcessing(false);
      }
    };

    if (session_id) {
      console.log("if you see this twice it means the logic is broken!!");
      handleCheckoutSuccess(session_id);
    } else {
      setIsProcessing(false);
      setError("No session ID found in the URL");
    }
  }, []);

  if (isProcessing) return "Processing...";

  if (error) return `Error: ${error}`;

  return (
    <div className="h-screen flex items-center justify-center px-4">
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        gravity={0.1}
        style={{ zIndex: 99 }}
        numberOfPieces={700}
        recycle={false}
      />

      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden relative z-10">
        <div className="p-6 sm:p-8">
          <div className="flex justify-center">
            <CheckCircle className="text-emerald-400 w-16 h-16 mb-4" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-emerald-400 mb-2">
            Purchase Successful!
          </h1>

          <p className="text-gray-300 text-center mb-2">
            Thank you for your order. {"We're"} processing it now.
          </p>
          <p className="text-emerald-400 text-center text-sm mb-6">
            Check your email for order details and updates.
          </p>
          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Order number</span>
              <span className="text-sm font-semibold text-emerald-400">
                #12345
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Estimated delivery</span>
              <span className="text-sm font-semibold text-emerald-400">
                3-5 business days
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <button
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4
             rounded-lg transition duration-300 flex items-center justify-center"
            >
              <HandHeart className="mr-2" size={18} />
              Thanks for trusting us!
            </button>
            <Link
              href={"/"}
              className="w-full bg-gray-700 hover:bg-gray-600 text-emerald-400 font-bold py-2 px-4 
            rounded-lg transition duration-300 flex items-center justify-center"
            >
              Continue Shopping
              <ArrowRight className="ml-2" size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseSuccess;
