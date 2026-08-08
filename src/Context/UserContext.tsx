"use client";
import { createContext, ReactNode, useState } from "react";
import AxiosInstance from "../lib/axio";
import { redirect, RedirectType } from "next/navigation";

export const UserContext = createContext();

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [authLoading, setAuthLoading] = useState(false);
  const [authUser, setAuthUser] = useState(null);

  const handleAuth = async () => {
    setAuthLoading(true);
    try {
      console.log("started here");
      const response = await AxiosInstance.get("/auth/user");
      console.log("done task", response.data.user);
      if (!response?.data.user) redirect("/login", RedirectType.replace);
      setAuthUser(response.data.user);
    } catch (error) {
      console.error("handleAuth: ", error);
      redirect("/login", RedirectType.replace);
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{ authLoading, setAuthLoading, handleAuth, authUser, setAuthUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
