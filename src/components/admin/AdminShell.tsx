"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bell, Loader2, Menu, Search, X } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { notificationsAdmin } from "@/lib/data";
import Sidebar from "./Sidebar";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { admin, chargement } = useAuth();
  const router = useRouter();
  const [drawer, setDrawer] = useState(false);
  const nonLues = notificationsAdmin.filter((n) => !n.lu).length;

  useEffect(() => {
    if (!chargement && !admin) router.replace("/auth/login");
  }, [chargement, admin, router]);

  if (chargement || !admin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:flex">
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-slate-100 lg:block">
        <Sidebar />
      </aside>

      {drawer && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-secondary/40 backdrop-blur-sm"
            onClick={() => setDrawer(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 shadow-xl">
            <button
              onClick={() => setDrawer(false)}
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500"
              aria-label="Fermer"
            >
              <X className="h-4 w-4" />
            </button>
            <Sidebar onNavigate={() => setDrawer(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-100 bg-surface/90 px-4 py-3 backdrop-blur lg:px-8">
          <button
            onClick={() => setDrawer(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 text-slate-500 lg:hidden"
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden max-w-md flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 md:flex">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              placeholder="Rechercher une commande, un produit…"
              className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/notifications"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 text-slate-500 transition hover:text-secondary"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {nonLues > 0 && (
                <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[9px] font-bold text-white">
                  {nonLues}
                </span>
              )}
            </Link>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
              {admin.initiales}
            </span>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
