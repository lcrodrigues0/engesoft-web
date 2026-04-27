"use client";

import { useAuth } from "@/contexts/AuthContext";
import { mockSubscriptions } from "@/lib/subscriptions/subscriptions";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";
import { SubscriptionsView } from "./subscriptions-view";

export function SubscriptionsPageClient() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState(() => [...mockSubscriptions]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (user === null) return;
    if (!user.roles.includes("SUBSCRIBER")) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user === null) {
    return (
      <div className="-m-6 flex min-h-[calc(100dvh-3.5rem)] items-center justify-center bg-slate-100 p-6">
        <p className="text-sm text-slate-600">Carregando…</p>
      </div>
    );
  }

  if (!user.roles.includes("SUBSCRIBER")) {
    return (
      <div className="-m-6 flex min-h-[calc(100dvh-3.5rem)] items-center justify-center bg-slate-100 p-6">
        <p className="text-sm text-slate-600">Redirecionando…</p>
      </div>
    );
  }

  return (
    <div className="-m-6 min-h-[calc(100dvh-3.5rem)] bg-slate-100 p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        <SubscriptionsView subscriptions={subscriptions} onChange={setSubscriptions} />
      </div>
    </div>
  );
}
