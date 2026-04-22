import { AuthorCtaCard } from "@/components/dashboard/author-cta-card";
import { ReviewerCtaCard } from "@/components/dashboard/reviewer-cta-card";

export default function DashboardPage() {
  return (
    <div className="flex gap-3 items-start min-h-[min(60dvh,32rem)] p-3">
      <AuthorCtaCard />
      <ReviewerCtaCard />
    </div>
  );
}
