"use client";

import { useEffect, useState, useCallback } from "react";
import { Menu, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { checkIsAdmin } from "@/lib/admin";
import AuthForm from "@/components/AuthForm";
import Sidebar from "@/components/admin/Sidebar";
import { AdminProvider } from "@/components/admin/AdminContext";
import type { User } from "@supabase/supabase-js";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);

    if (user) {
      setIsAdmin(await checkIsAdmin(user.id));
    } else {
      setIsAdmin(false);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-16 text-sm text-muted">
        Loading…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-16">
        <h1 className="mb-8 text-center font-display text-3xl font-semibold">
          Admin sign in
        </h1>
        <AuthForm onAuth={load} />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-16 text-center">
        <h1 className="font-display text-3xl font-semibold">
          Not authorized
        </h1>
        <p className="mt-2 text-sm text-muted">
          Signed in as {user.email}, but this account isn&apos;t an admin.
        </p>
      </div>
    );
  }

  return (
    <AdminProvider value={{ user, refresh: load }}>
      <div className="min-h-screen bg-paper lg:flex">
        {/* Desktop sidebar */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="fixed h-screen w-64">
            <Sidebar user={user} />
          </div>
        </aside>

        {/* Mobile topbar */}
        <div className="flex items-center justify-between border-b border-line bg-ink px-4 py-3 text-paper lg:hidden">
          <span className="font-mono text-xs uppercase tracking-widest">
            Admin
          </span>
          <button
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Mobile sidebar drawer */}
        {mobileNavOpen && (
          <div className="fixed inset-0 z-30 lg:hidden">
            <div
              className="absolute inset-0 bg-ink/60"
              onClick={() => setMobileNavOpen(false)}
            />
            <div className="absolute inset-y-0 left-0 w-72 max-w-[85%]">
              <div className="relative h-full">
                <button
                  onClick={() => setMobileNavOpen(false)}
                  aria-label="Close menu"
                  className="absolute right-3 top-3 z-10 text-paper/70 hover:text-paper"
                >
                  <X className="h-5 w-5" />
                </button>
                <Sidebar user={user} onNavigate={() => setMobileNavOpen(false)} />
              </div>
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </AdminProvider>
  );
}