import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getEditionById } from "@/lib/journals/editions";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ editionId: string }>;
};

export default async function JournalEditionDetailPage({ params }: PageProps) {
  const { editionId } = await params;
  const edition = getEditionById(editionId);
  if (!edition) notFound();

  return (
    <div className="-m-6 min-h-[calc(100dvh-3.5rem)] bg-slate-100 p-6 md:p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <Button variant="link" className="h-auto p-0 text-sky-700 hover:text-sky-800" asChild>
          <Link href="/dashboard/journals" className="inline-flex items-center gap-2">
            <ArrowLeft className="size-4" aria-hidden />
            Voltar para edições
          </Link>
        </Button>

        <header className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-wide text-slate-600">
            EngeSoft — revista de informática
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Edição: {edition.theme}
          </h1>
          <p className="max-w-2xl text-pretty text-slate-700">
            A <strong>EngeSoft</strong> é publicada <strong>mensalmente</strong>. Cada edição reúne
            artigos sobre <strong>um mesmo tema</strong>. Nesta edição, o tema é{" "}
            <strong>{edition.theme}</strong>, com{" "}
            <strong>{edition.articlesSelected.length}</strong> artigos selecionados para publicação,
            dentre os submetidos ao processo editorial.
          </p>
        </header>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <div className="relative mx-auto aspect-5/7 w-full max-w-[200px] shrink-0 overflow-hidden rounded-xl shadow-lg ring-1 ring-slate-300 lg:mx-0">
            <Image
              src={edition.coverSrc}
              alt={edition.coverAlt ?? `Capa — ${edition.theme}`}
              fill
              className="object-cover"
              sizes="200px"
              priority
            />
          </div>

          <Card className="min-w-0 flex-1 border-slate-200 bg-white/90 shadow-md">
            <CardHeader>
              <CardTitle className="text-slate-900">Dados da edição</CardTitle>
              <CardDescription>
                Volume, número, período e tema desta publicação.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-3 text-sm sm:grid-cols-2">
                <div className="rounded-lg bg-slate-50 px-3 py-2 ring-1 ring-slate-100">
                  <dt className="font-medium text-slate-500">Volume</dt>
                  <dd className="text-lg font-semibold text-slate-900">{edition.volume}</dd>
                </div>
                <div className="rounded-lg bg-slate-50 px-3 py-2 ring-1 ring-slate-100">
                  <dt className="font-medium text-slate-500">Número</dt>
                  <dd className="text-lg font-semibold text-slate-900">{edition.number}</dd>
                </div>
                <div className="rounded-lg bg-slate-50 px-3 py-2 ring-1 ring-slate-100">
                  <dt className="font-medium text-slate-500">Mês</dt>
                  <dd className="text-lg font-semibold text-slate-900">{edition.month}</dd>
                </div>
                <div className="rounded-lg bg-slate-50 px-3 py-2 ring-1 ring-slate-100">
                  <dt className="font-medium text-slate-500">Ano</dt>
                  <dd className="text-lg font-semibold text-slate-900">{edition.year}</dd>
                </div>
                <div className="sm:col-span-2 rounded-lg bg-slate-50 px-3 py-2 ring-1 ring-slate-100">
                  <dt className="font-medium text-slate-500">Tema</dt>
                  <dd className="text-lg font-semibold text-slate-900">{edition.theme}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-slate-200 bg-white/90 shadow-md">
            <CardHeader>
              <CardTitle className="text-slate-900">
                Artigos submetidos
                <span className="ml-2 text-base font-normal text-slate-500">
                  ({edition.articlesSubmitted.length})
                </span>
              </CardTitle>
              <CardDescription>
                Trabalhos enviados para avaliação nesta edição.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal space-y-3 pl-5 text-sm text-slate-800">
                {edition.articlesSubmitted.map((a) => (
                  <li key={a.title} className="marker:font-medium">
                    <span className="font-medium">{a.title}</span>
                    {a.authors ? (
                      <span className="mt-0.5 block text-slate-600">{a.authors}</span>
                    ) : null}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card className="border-emerald-200/80 bg-emerald-50/40 shadow-md ring-1 ring-emerald-100">
            <CardHeader>
              <CardTitle className="text-slate-900">
                Artigos selecionados
                <span className="ml-2 text-base font-normal text-slate-500">
                  ({edition.articlesSelected.length})
                </span>
              </CardTitle>
              <CardDescription>
                Artigos aceitos para compor esta edição da revista.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal space-y-3 pl-5 text-sm text-slate-800">
                {edition.articlesSelected.map((a) => (
                  <li key={a.title} className="marker:font-medium">
                    <span className="font-medium">{a.title}</span>
                    {a.authors ? (
                      <span className="mt-0.5 block text-slate-600">{a.authors}</span>
                    ) : null}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
