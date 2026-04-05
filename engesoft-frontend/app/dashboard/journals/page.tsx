import { JournalEditionCard } from "@/components/journals/journal-edition-card";
import { editionToCardProps, journalEditions } from "@/lib/journals/editions";

export default function JournalsEditionsPage() {
  return (
    <div className="-m-6 min-h-[calc(100dvh-3.5rem)] bg-linear-to-br from-slate-300 to-slate-100 p-6 md:p-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-bold tracking-tight text-slate-800 md:text-2xl">
            Todas edições
          </h1>
        </header>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {journalEditions.map((edition) => {
            const card = editionToCardProps(edition);
            return (
              <JournalEditionCard
                key={edition.id}
                title={card.title}
                period={card.period}
                badge={card.badge}
                coverSrc={card.coverSrc}
                coverAlt={card.coverAlt}
                viewHref={card.viewHref}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
