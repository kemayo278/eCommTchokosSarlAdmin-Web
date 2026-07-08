"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function Home() {
  const { admin, chargement } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (chargement) return;
    router.replace(admin ? "/dashboard" : "/auth/login");
  }, [chargement, admin, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-aurora">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </div>
  );
}
