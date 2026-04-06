"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  articleStatusLabels,
  formatSubmissionDate,
  formatSubmissionDateTime,
  type ArticleSubmissionStatus,
  type SubmittedArticle,
} from "@/lib/articles/submitted-articles";
import { cn } from "@/lib/utils";
import { ExternalLink, FileText } from "lucide-react";
import { useMemo, useState } from "react";

function StatusBadge({ status }: { status: ArticleSubmissionStatus }) {
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

type SubmittedArticlesViewProps = {
  articles: SubmittedArticle[];
};

export function SubmittedArticlesView({ articles }: SubmittedArticlesViewProps) {
  const [selected, setSelected] = useState<SubmittedArticle | null>(null);

  const sorted = useMemo(
    () =>
      [...articles].sort(
        (a, b) =>
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
      ),
    [articles],
  );

  return (
    <>
      <div>
        <div className="hidden overflow-hidden rounded-xl border border-slate-200/90 bg-white/90 shadow-sm ring-1 ring-slate-200/60 md:block">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/90 text-xs font-semibold uppercase tracking-wide text-slate-600">
                <th className="px-4 py-3">Identificação</th>
                <th className="px-4 py-3">Título</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Revista</th>
                <th className="px-4 py-3">Submissão</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sorted.map((article) => (
                <tr key={article.publicId}>
                  <td className="px-4 py-3 align-top">
                    <button
                      type="button"
                      onClick={() => setSelected(article)}
                      className="font-mono text-xs font-medium text-slate-800 underline-offset-2 hover:text-slate-950 hover:underline"
                    >
                      {article.publicId}
                    </button>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <button
                      type="button"
                      onClick={() => setSelected(article)}
                      className="max-w-md text-left font-medium text-slate-900 underline-offset-2 hover:text-slate-950 hover:underline"
                    >
                      {article.title}
                    </button>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <StatusBadge status={article.status} />
                  </td>
                  <td className="px-4 py-3 align-top text-slate-700">{article.journalName}</td>
                  <td className="whitespace-nowrap px-4 py-3 align-top text-slate-600">
                    {formatSubmissionDate(article.submittedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className="flex flex-col gap-3 md:hidden">
          {sorted.map((article) => (
            <li key={article.publicId}>
              <button
                type="button"
                onClick={() => setSelected(article)}
                className="w-full rounded-xl border border-slate-200/90 bg-white/90 p-4 text-left shadow-sm ring-1 ring-slate-200/60 transition-colors hover:bg-slate-50/90"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <span className="font-mono text-xs font-semibold text-slate-800">
                    {article.publicId}
                  </span>
                  <StatusBadge status={article.status} />
                </div>
                <p className="mt-2 font-medium text-slate-900">{article.title}</p>
                <p className="mt-1 text-sm text-slate-600">{article.journalName}</p>
                <p className="mt-2 text-xs text-slate-500">
                  Submetido em {formatSubmissionDate(article.submittedAt)}
                </p>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent
          className="flex max-h-[min(90dvh,40rem)] max-w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg md:max-w-xl"
          showCloseButton
        >
          {selected ? (
            <>
              <DialogHeader className="shrink-0 border-b border-border/60 px-4 pb-3 pt-4 pr-12">
                <DialogTitle className="text-base font-semibold leading-snug sm:text-lg">
                  {selected.title}
                </DialogTitle>
                <DialogDescription className="font-mono text-xs text-muted-foreground sm:text-sm">
                  {selected.publicId}
                </DialogDescription>
              </DialogHeader>

              <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4 text-sm">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Autores
                  </p>
                  {selected.authorDetails?.length ? (
                    <ul className="mt-2 space-y-3">
                      {selected.authorDetails.map((a) => (
                        <li
                          key={`${a.email}-${a.fullName}`}
                          className="rounded-lg border border-slate-200 bg-slate-50/80 p-3 text-slate-800 dark:bg-slate-900/40"
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-medium text-slate-900">{a.fullName}</span>
                            {a.isContact ? (
                              <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-800 dark:bg-slate-700 dark:text-slate-100">
                                Contato
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-1 text-xs text-slate-600">{a.email}</p>
                          <p className="mt-2 text-sm">
                            <span className="font-medium text-slate-900">Instituição:</span>{" "}
                            {a.institutionName}
                          </p>
                          <p className="mt-1 text-xs leading-relaxed text-slate-600">
                            {a.institutionAddress}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <ul className="mt-1.5 list-inside list-disc text-slate-800">
                      {selected.authors.map((name) => (
                        <li key={name}>{name}</li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="grid gap-1 text-slate-700">
                  <p>
                    <span className="font-medium text-slate-900">Revista:</span>{" "}
                    {selected.journalName}
                  </p>
                  <p>
                    <span className="font-medium text-slate-900">Status:</span>{" "}
                    <StatusBadge status={selected.status} />
                  </p>
                  <p>
                    <span className="font-medium text-slate-900">Data da submissão:</span>{" "}
                    {formatSubmissionDateTime(selected.submittedAt)}
                  </p>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3">
                  <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                    <FileText className="size-4 shrink-0" aria-hidden />
                    Arquivo do artigo
                  </p>
                  <p className="mt-1 break-all text-slate-800">{selected.fileName}</p>
                  <Button variant="outline" size="sm" className="mt-3 gap-2" asChild>
                    <a href={selected.fileUrl} target="_blank" rel="noopener noreferrer">
                      Abrir arquivo
                      <ExternalLink className="size-3.5" aria-hidden />
                    </a>
                  </Button>
                </div>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
