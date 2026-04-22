"use client";

import { mockSubscriptions } from "@/lib/subscriptions/subscriptions";
import { useState } from "react";
import { SubscriptionsView } from "./subscriptions-view";

export function SubscriptionsPageClient() {
  const [subscriptions, setSubscriptions] = useState(() => [...mockSubscriptions]);

  return (
    <div className="-m-6 min-h-[calc(100dvh-3.5rem)] bg-slate-100 p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        <SubscriptionsView subscriptions={subscriptions} onChange={setSubscriptions} />
      </div>
    </div>
  );
}
