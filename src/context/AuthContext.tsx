"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast        from "react-hot-toast";
import { AuthUser }  from "@/types";
import { authApi }   from "@/utils/api";

interface AuthCtx {
  user:        AuthUser | null;
  loading:     boolean;
  login:       (email: string, password: string) => Promise<void>;
  register:    (name: string, email: string, password: string) => Promise<void>;
  logout:      () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user,    setUser]    = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshUser = useCallback(async () => {
    try {
      const res = await authApi.getMe() as { data: AuthUser };
      setUser(res.data ?? null);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const res = await authApi.login(email, password) as { data: AuthUser };
    setUser(res.data);
    toast.success(`Welcome back, ${res.data.name.split(" ")[0]}! 👋`);
    router.push("/dashboard");
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await authApi.register(name, email, password) as { data: AuthUser };
    setUser(res.data);
    toast.success("Account created! Welcome to TravelNest. ✈️");
    router.push("/dashboard");
  };

  const logout = async () => {
    try { await authApi.logout(); } catch { /* ignore */ }
    setUser(null);
    toast.success("Logged out successfully.");
    router.push("/");
  };

  return (
    <Ctx.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = (): AuthCtx => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
