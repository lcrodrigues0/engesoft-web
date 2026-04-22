"use client";

import {
  articleStatusLabels,
  type ArticleSubmissionStatus,
} from "@/lib/articles/submitted-articles";
import { cn } from "@/lib/utils";

export function ArticleStatusBadge({ status }: { status: ArticleSubmissionStatus }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        status === "approved" &&
          "bg-emerald-50 text-emerald-800 ring-emerald-600/20 dark:bg-emerald-950/40 dark:text-emerald-200",
        status === "rejected" &&
          "bg-red-50 text-red-800 ring-red-600/20 dark:bg-red-950/40 dark:text-red-200",
        status === "under_review" &&
          "bg-amber-50 text-amber-900 ring-amber-600/25 dark:bg-amber-950/40 dark:text-amber-100",
      )}
    >
      {articleStatusLabels[status]}
    </span>
  );
}
