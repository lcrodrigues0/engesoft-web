import { JournalEditionCard } from "@/components/journals/journal-edition-card";

const editions: {
  title: string;
  period: string;
  badge: string;
  coverSrc: string;
  coverAlt?: string;
}[] = [
  {
    title: "Qualidade de Software",
    period: "Abril/2026 • v.12 n.4",
    badge: "8 artigos",
    coverSrc: "https://res.cloudinary.com/dnxmt9urd/image/upload/v1775354640/samples/zoom.avif",
    coverAlt: "Capa da revista Qualidade de Software, abril 2026",
  },
  {
    title: "Engenharia de Dados",
    period: "Março/2026 • v.12 n.3",
    badge: "12 artigos",
    coverSrc: "https://res.cloudinary.com/dnxmt9urd/image/upload/v1775357990/Gemini_Generated_Image_k3iiwgk3iiwgk3ii_pqafap.png",
    coverAlt: "Capa da revista Engenharia de Dados, março 2026",
  },
  {
    title: "Inteligência Artificial aplicada",
    period: "Fevereiro/2026 • v.12 n.2",
    badge: "6 artigos",
    coverSrc: "https://res.cloudinary.com/dnxmt9urd/image/upload/v1775358263/Gemini_Generated_Image_caadjlcaadjlcaad_zgzeox.png",
    coverAlt: "Capa da revista Inteligência Artificial aplicada, fevereiro 2026",
  },
];

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
          {editions.map((edition) => (
            <JournalEditionCard
              key={edition.title}
              title={edition.title}
              period={edition.period}
              badge={edition.badge}
              coverSrc={edition.coverSrc}
              coverAlt={edition.coverAlt}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
