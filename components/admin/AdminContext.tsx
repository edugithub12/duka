"use client";

import { createContext, useContext } from "react";
import type { User } from "@supabase/supabase-js";

export type AdminContextValue = {
  user: User;
  refresh: () => void;
};

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({
  value,
  children,
}: {
  value: AdminContextValue;
  children: React.ReactNode;
}) {
  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) {
    throw new Error("useAdmin must be used within the /admin layout");
  }
  return ctx;
}
