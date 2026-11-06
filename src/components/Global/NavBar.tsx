"use client";
import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from "lucide-react";
import Link from "next/link";
import AxiosInstance from "@/lib/axio";
import toast from "react-hot-toast";
import { redirect, RedirectType } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { useCart } from "@/hooks/useCart";

const NavBar = () => {
  const { authUser: user, setAuthUser } = useUser();

  const { cart } = useCart();

  const handleLogout = async () => {
    try {
      const response = await AxiosInstance.get("/auth/logout");
      setAuthUser(null);
      toast.success(response.data.message);
    } catch (error) {
      console.log("handleLogout: ", error);
      toast.error("something went wrong");
    } finally {
      redirect("/login", RedirectType.replace);
    }
  };

  return (
    <header className="fixed top-0 left-0 z-40 h-16 w-full border-b border-emerald-800/40 bg-gray-900/80 shadow-lg backdrop-blur-md transition-all duration-300">
      <div className="container mx-auto flex h-full items-center px-4">
        <div className="flex w-full items-center justify-between gap-4">
          <Link
            href="/"
            className="text-2xl font-bold text-emerald-400 items-center space-x-2 flex"
          >
            E-Commerce
          </Link>

          <nav className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/"
              className="text-gray-300 hover:text-emerald-400 transition duration-300
					 ease-in-out"
            >
              Home
            </Link>
            {user && (
              <Link
                href="/cart"
                className="relative group text-gray-300 hover:text-emerald-400 transition duration-300 
							ease-in-out"
              >
                <ShoppingCart
                  className="inline-block mr-1 group-hover:text-emerald-400"
                  size={20}
                />

                <span className="hidden sm:inline">Cart</span>
                {cart.length > 0 && (
                  <span
                    className="absolute -top-2 -left-2 bg-emerald-500 text-white rounded-full px-2 py-0.5 
									text-xs group-hover:bg-emerald-400 transition duration-300 ease-in-out"
                  >
                    {cart.length}
                  </span>
                )}
              </Link>
            )}

            {user?.role === "admin" && (
              <Link
                className="bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium
								 transition duration-300 ease-in-out flex items-center cursor-pointer"
                href={"/admin"}
              >
                <Lock className="inline-block mr-1" size={18} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            )}

            {user ? (
              <button
                className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 
						rounded-md flex items-center transition duration-300 ease-in-out"
                onClick={handleLogout}
              >
                <LogOut size={18} />
                <span className="hidden sm:inline ml-2">Log Out</span>
              </button>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 
									rounded-md flex items-center transition duration-300 ease-in-out"
                >
                  <UserPlus className="mr-2" size={18} />
                  Sign Up
                </Link>
                <Link
                  href="/login"
                  className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 
									rounded-md flex items-center transition duration-300 ease-in-out"
                >
                  <LogIn className="mr-2" size={18} />
                  Login
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
