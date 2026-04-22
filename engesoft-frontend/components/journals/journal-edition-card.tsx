import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export interface JournalEditionCardProps {
  title: string;
  period: string;
  badge: string;
  coverSrc: string;
  coverAlt?: string;
  /** Rota ao clicar em Visualizar (ex.: `/dashboard/journals/vol12n4-...`) */
  viewHref: string;
}

export function JournalEditionCard({
  title,
  period,
  badge,
  coverSrc,
  coverAlt,
  viewHref,
}: JournalEditionCardProps) {
  const alt = coverAlt ?? `Capa da edição: ${title}`;

  return (
    <article
      className={cn(
        "flex min-h-60 flex-col overflow-hidden rounded-xl border border-slate-200",
        "bg-white shadow-sm",
      )}
    >
      <div className="flex gap-5 p-5">
        <div
          className={cn(
            "relative h-40 w-28 shrink-0 overflow-hidden rounded-md shadow-md ring-1 ring-slate-200",
          )}
        >
          <Image
            src={coverSrc}
            alt={alt}
            fill
            className="object-cover"
            sizes="112px"
          />
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <h3 className="text-lg font-semibold leading-snug text-slate-900">
            {title}
          </h3>
          <p className="text-base text-slate-600">{period}</p>
          <span
            className={cn(
              "inline-flex w-fit rounded-full border border-sky-200",
              "bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-700",
            )}
          >
            {badge}
          </span>
        </div>
      </div>
      <div className="mt-auto border-t border-slate-200 bg-slate-50 p-4">
        <Button
          variant="outline"
          className="w-full cursor-pointer border-slate-300 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900"
          asChild
        >
          <Link href={viewHref}>Visualizar</Link>
        </Button>
      </div>
    </article>
  );
}
