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
        "flex flex-col overflow-hidden rounded-xl border border-slate-700/80",
        "bg-slate-800 shadow-lg ring-1 ring-slate-200/50 backdrop-blur-sm",
      )}
    >
      <div className="flex gap-4 p-4">
        <div
          className={cn(
            "relative h-28 w-20 shrink-0 overflow-hidden rounded-md shadow-md ring-1 ring-black/20",
          )}
        >
          <Image
            src={coverSrc}
            alt={alt}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <h3 className="text-base font-semibold leading-snug text-slate-50">
            {title}
          </h3>
          <p className="text-sm text-slate-400">{period}</p>
          <span
            className={cn(
              "inline-flex w-fit rounded-full border border-sky-800/50",
              "bg-sky-950/50 px-2.5 py-0.5 text-xs font-medium text-sky-200",
            )}
          >
            {badge}
          </span>
        </div>
      </div>
      <div className="border-t border-slate-700/80 bg-zinc-950/40 p-3">
        <Button
          variant="outline"
          className="w-full cursor-pointer border-slate-600 bg-slate-800/40 text-slate-100 hover:bg-slate-700 hover:text-white"
          asChild
        >
          <Link href={viewHref}>Visualizar</Link>
        </Button>
      </div>
    </article>
  );
}
