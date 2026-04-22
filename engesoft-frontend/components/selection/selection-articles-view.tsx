"use client";

import { ArticleStatusBadge } from "@/components/articles/article-status-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatScoreBr } from "@/lib/articles/article-evaluation";
import {
  formatSubmissionDate,
  formatSubmissionDateTime,
} from "@/lib/articles/submitted-articles";
import {
  type ArticleSelectionRow,
  type EditorSelectionDecision,
  type PeerReviewRecord,
} from "@/lib/articles/selection-queue";
import { cn } from "@/lib/utils";
import { ExternalLink, FileText } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type SelectionArticlesViewProps = {
  articles: ArticleSelectionRow[];
};

function DecisionBadge({
  decision,
}: {
  decision: EditorSelectionDecision | undefined;
}) {
  if (decision === "selected") {
    return (
      <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-900 ring-1 ring-emerald-600/20">
        Selecionado
      </span>
    );
  }
  if (decision === "not_selected") {
    return (
      <span className="inline-flex rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-800 ring-1 ring-slate-500/20">
        Não selecionado
      </span>
    );
  }
  return (
    <span className="text-xs text-amber-800">Pendente</span>
  );
}

function ReviewerCard({ review, index }: { review: PeerReviewRecord; index: number }) {
  return (
    <li className="rounded-lg border border-slate-200 bg-slate-50/90 p-3 dark:bg-slate-900/30">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Avaliador {index + 1}
      </p>
      <p className="mt-1 font-medium text-slate-900">{review.reviewerName}</p>
      <p className="text-xs text-slate-600">{review.email}</p>
      <p className="mt-1 text-sm text-slate-700">{review.institution}</p>
      <dl className="mt-3 grid grid-cols-3 gap-2 text-center text-xs sm:text-sm">
        <div className="rounded border border-slate-200/80 bg-white/80 px-2 py-1.5">
          <dt className="text-slate-500">Originalidade</dt>
          <dd className="font-mono font-semibold tabular-nums text-slate-900">
            {formatScoreBr(review.originality)}
          </dd>
        </div>
        <div className="rounded border border-slate-200/80 bg-white/80 px-2 py-1.5">
          <dt className="text-slate-500">Conteúdo</dt>
          <dd className="font-mono font-semibold tabular-nums text-slate-900">
            {formatScoreBr(review.content)}
          </dd>
        </div>
        <div className="rounded border border-slate-200/80 bg-white/80 px-2 py-1.5">
          <dt className="text-slate-500">Apresentação</dt>
          <dd className="font-mono font-semibold tabular-nums text-slate-900">
            {formatScoreBr(review.presentation)}
          </dd>
        </div>
      </dl>
    </li>
  );
}

export function SelectionArticlesView({ articles }: SelectionArticlesViewProps) {
  const [selected, setSelected] = useState<ArticleSelectionRow | null>(null);
  const [decisions, setDecisions] = useState<
    Record<string, EditorSelectionDecision | undefined>
  >({});
  const [draftDecision, setDraftDecision] = useState<EditorSelectionDecision | null>(null);

  const sorted = useMemo(
    () =>
      [...articles].sort(
        (a, b) =>
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
      ),
    [articles],
  );

  useEffect(() => {
    if (!selected) return;
    const existing = decisions[selected.publicId];
    setDraftDecision(existing ?? null);
  }, [selected, decisions]);

  function handleConfirmDecision() {
    if (!selected) return;
    if (draftDecision === null) {
      toast.error("Escolha uma opção", {
        description: "Indique se o artigo foi selecionado para publicação ou não.",
      });
      return;
    }
    setDecisions((prev) => ({ ...prev, [selected.publicId]: draftDecision }));
    toast.success("Decisão registrada", {
      description:
        draftDecision === "selected"
          ? `${selected.publicId} marcado como selecionado para publicação.`
          : `${selected.publicId} marcado como não selecionado.`,
    });
    setSelected(null);
  }

  if (sorted.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200/90 bg-white/90 p-8 text-center shadow-sm ring-1 ring-slate-200/60">
        <p className="text-sm font-medium text-slate-800">
          Nenhum artigo disponível para seleção no momento.
        </p>
        <p className="mt-2 text-sm text-slate-600">
          Só aparecem aqui manuscritos aprovados que já receberam as três avaliações obrigatórias.
        </p>
      </div>
    );
  }

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
                <th className="px-4 py-3">Avaliações</th>
                <th className="px-4 py-3">Decisão do editor</th>
                <th className="px-4 py-3">Revista</th>
                <th className="px-4 py-3">Submissão</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sorted.map((row) => (
                  <tr key={row.publicId}>
                    <td className="px-4 py-3 align-top">
                      <button
                        type="button"
                        onClick={() => setSelected(row)}
                        className="font-mono text-xs font-medium text-slate-800 underline-offset-2 hover:text-slate-950 hover:underline"
                      >
                        {row.publicId}
                      </button>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <button
                        type="button"
                        onClick={() => setSelected(row)}
                        className="max-w-md text-left font-medium text-slate-900 underline-offset-2 hover:text-slate-950 hover:underline"
                      >
                        {row.title}
                      </button>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <ArticleStatusBadge status={row.status} />
                    </td>
                    <td className="px-4 py-3 align-top text-slate-700">
                      3/3
                      <span className="ml-1 text-xs text-emerald-700">(concluídas)</span>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <DecisionBadge decision={decisions[row.publicId]} />
                    </td>
                    <td className="px-4 py-3 align-top text-slate-700">{row.journalName}</td>
                    <td className="whitespace-nowrap px-4 py-3 align-top text-slate-600">
                      {formatSubmissionDate(row.submittedAt)}
                    </td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className="flex flex-col gap-3 md:hidden">
          {sorted.map((row) => (
              <li key={row.publicId}>
                <button
                  type="button"
                  onClick={() => setSelected(row)}
                  className="w-full rounded-xl border border-slate-200/90 bg-white/90 p-4 text-left shadow-sm ring-1 ring-slate-200/60 transition-colors hover:bg-slate-50/90"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <span className="font-mono text-xs font-semibold text-slate-800">
                      {row.publicId}
                    </span>
                    <ArticleStatusBadge status={row.status} />
                  </div>
                  <p className="mt-2 font-medium text-slate-900">{row.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{row.journalName}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-slate-600">
                      Avaliações: 3/3 · Concluídas
                    </span>
                    <DecisionBadge decision={decisions[row.publicId]} />
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    Submetido em {formatSubmissionDate(row.submittedAt)}
                  </p>
                </button>
              </li>
          ))}
        </ul>
      </div>

      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent
          className="flex max-h-[min(90dvh,44rem)] max-w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg md:max-w-2xl"
          showCloseButton
        >
          {selected ? (
            <>
              <DialogHeader className="shrink-0 border-b border-border/60 px-4 pb-3 pt-4 pr-12">
                <DialogTitle className="text-base font-semibold leading-snug sm:text-lg">
                  Seleção editorial
                </DialogTitle>
                <DialogDescription asChild>
                  <div className="space-y-1 text-left">
                    <p className="font-medium text-slate-900 sm:text-base">{selected.title}</p>
                    <p className="font-mono text-xs text-muted-foreground">{selected.publicId}</p>
                  </div>
                </DialogDescription>
              </DialogHeader>

              <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4 text-sm">
                <p className="rounded-lg border border-slate-200/90 bg-slate-50/90 p-3 text-xs leading-relaxed text-slate-700">
                  Analise as notas atribuídas por cada avaliador (originalidade, conteúdo e
                  apresentação) e registre se o artigo foi{" "}
                  <strong className="text-slate-900">selecionado para publicação</strong> nesta
                  edição ou <strong className="text-slate-900">não</strong>.
                </p>

                <div className="grid gap-1 text-slate-700">
                  <p>
                    <span className="font-medium text-slate-900">Revista / edição:</span>{" "}
                    {selected.journalName}
                  </p>
                  <p className="text-xs text-slate-600">
                    Submissão: {formatSubmissionDateTime(selected.submittedAt)}
                  </p>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3">
                  <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                    <FileText className="size-4 shrink-0" aria-hidden />
                    Manuscrito
                  </p>
                  <p className="mt-1 break-all text-slate-800">{selected.fileName}</p>
                  <Button variant="outline" size="sm" className="mt-3 gap-2" asChild>
                    <a href={selected.fileUrl} target="_blank" rel="noopener noreferrer">
                      Abrir arquivo
                      <ExternalLink className="size-3.5" aria-hidden />
                    </a>
                  </Button>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Avaliações dos colaboradores
                  </p>
                  <ul className="mt-2 space-y-3">
                    {selected.peerEvaluations.map((rev, i) => (
                      <ReviewerCard key={`${selected.publicId}-rev-${i}`} review={rev} index={i} />
                    ))}
                  </ul>
                </div>

                <div className="border-t border-border/60 pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Decisão do editor-chefe
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Esta edição: o artigo foi selecionado para publicação?
                  </p>
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                    <Button
                      type="button"
                      variant={draftDecision === "selected" ? "default" : "outline"}
                      className={cn(
                        "sm:min-w-40",
                        draftDecision === "selected" &&
                          "bg-emerald-700 text-white hover:bg-emerald-800",
                      )}
                      onClick={() => setDraftDecision("selected")}
                    >
                      Selecionado para publicação
                    </Button>
                    <Button
                      type="button"
                      variant={draftDecision === "not_selected" ? "default" : "outline"}
                      className={cn(
                        "sm:min-w-40",
                        draftDecision === "not_selected" && "bg-slate-700 text-white hover:bg-slate-800",
                      )}
                      onClick={() => setDraftDecision("not_selected")}
                    >
                      Não selecionado
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-border/60 px-4 py-3 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="text-sm"
                  onClick={() => setSelected(null)}
                >
                  Fechar
                </Button>
                <Button
                  type="button"
                  className="bg-slate-800 text-sm text-slate-50 hover:bg-slate-900"
                  onClick={handleConfirmDecision}
                >
                  Confirmar decisão
                </Button>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
