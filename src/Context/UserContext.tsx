"use client";
import AxiosInstance from "@/lib/axio";
import type { AuthUser, AuthUserResponse } from "@/types/User";
import { useRouter } from "next/navigation";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";

export type { AuthUser, UserRole } from "@/types/User";

export interface UserContextType {
  authUser: AuthUser | null;
  setAuthUser: Dispatch<SetStateAction<AuthUser | null>>;
  authLoading: boolean;
  setAuthLoading: Dispatch<SetStateAction<boolean>>;
  handleAuth: () => Promise<void>;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

const UserProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  const handleAuth = useCallback(async () => {
    setAuthLoading(true);
    try {
      const { data } = await AxiosInstance.get<AuthUserResponse>("/auth/user");
      if (data?.user) {
        setAuthUser(data.user);
      } else {
        setAuthUser(null);
      }
    } catch (error) {
      console.error("handleAuth: ", error);
      setAuthUser(null);
    } finally {
      setAuthLoading(false);
    }
  }, [router]);

  const value = useMemo<UserContextType>(
    () => ({ authUser, setAuthUser, authLoading, setAuthLoading, handleAuth }),
    [authUser, authLoading, handleAuth],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserProvider;
