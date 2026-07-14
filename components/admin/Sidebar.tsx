"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  Users,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { siteConfig } from "@/lib/siteConfig";
import type { User } from "@supabase/supabase-js";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package, exact: false },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList, exact: false },
  { href: "/admin/customers", label: "Customers", icon: Users, exact: false },
];

export default function Sidebar({
  user,
  onNavigate,
}: {
  user: User;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.href = "/admin";
  }

  return (
    <div className="flex h-full flex-col bg-ink text-paper">
      <Link
        href="/"
        onClick={onNavigate}
        className="flex items-center gap-2 border-b border-white/10 px-5 py-4"
      >
        <Image
          src="/logo.png"
          alt={siteConfig.name}
          width={28}
          height={28}
          className="h-7 w-7"
        />
        <div className="flex flex-col leading-none">
          <span className="font-display text-sm font-bold uppercase tracking-tight">
            {siteConfig.name}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-brand">
            Admin
          </span>
        </div>
      </Link>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {NAV.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                active
                  ? "bg-white/10 text-paper"
                  : "text-paper/60 hover:bg-white/5 hover:text-paper"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
              {item.label}
            </Link>
          );
        })}

        <Link
          href="/"
          onClick={onNavigate}
          className="mt-auto flex items-center gap-3 px-3 py-2.5 text-sm text-paper/60 transition-colors hover:bg-white/5 hover:text-paper"
        >
          <ExternalLink className="h-4 w-4 shrink-0" strokeWidth={1.75} />
          View storefront
        </Link>
      </nav>

      <div className="border-t border-white/10 px-4 py-4">
        <p className="truncate font-mono text-[11px] text-paper/50">
          {user.email}
        </p>
        <button
          onClick={handleSignOut}
          className="mt-2 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-paper/70 transition-colors hover:text-alert"
        >
          <LogOut className="h-3.5 w-3.5" strokeWidth={1.75} />
          Sign out
        </button>
      </div>
    </div>
  );
}
