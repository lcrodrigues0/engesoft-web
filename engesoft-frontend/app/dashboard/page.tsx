import { AuthorCtaCard } from "@/components/dashboard/author-cta-card";
import { ReviewerCtaCard } from "@/components/dashboard/reviewer-cta-card";
import { SubscriberCtaCard } from "@/components/dashboard/subscriber-cta-card";

export default function DashboardPage() {
  return (
    <div className="grid min-h-[min(60dvh,32rem)] grid-cols-1 gap-3 p-3 md:grid-cols-3">
      <AuthorCtaCard className="max-w-none" />
      <ReviewerCtaCard className="max-w-none" />
      <SubscriberCtaCard className="max-w-none" />
    </div>
  );
}
