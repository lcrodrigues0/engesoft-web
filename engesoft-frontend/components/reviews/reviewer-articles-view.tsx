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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  formatScoreBr,
  parseScoreInput,
  type ArticleEvaluationScores,
} from "@/lib/articles/article-evaluation";
import {
  formatSubmissionDate,
  formatSubmissionDateTime,
  type SubmittedArticle,
} from "@/lib/articles/submitted-articles";
import { ExternalLink, FileText } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type ReviewerArticlesViewProps = {
  articles: SubmittedArticle[];
};

export function ReviewerArticlesView({ articles }: ReviewerArticlesViewProps) {
  const [selected, setSelected] = useState<SubmittedArticle | null>(null);
  const [scoreInputs, setScoreInputs] = useState({
    originality: "5",
    content: "5",
    presentation: "5",
  });
  const [savedEvaluations, setSavedEvaluations] = useState<
    Record<string, ArticleEvaluationScores>
  >({});
  const [peerCounts, setPeerCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    setPeerCounts((prev) => {
      const next = { ...prev };
      for (const a of articles) {
        if (next[a.publicId] === undefined) {
          next[a.publicId] = a.completedPeerReviews ?? 0;
        }
      }
      return next;
    });
  }, [articles]);

  useEffect(() => {
    if (!selected) return;
    const saved = savedEvaluations[selected.publicId];
    if (saved) {
      setScoreInputs({
        originality: formatScoreBr(saved.originality),
        content: formatScoreBr(saved.content),
        presentation: formatScoreBr(saved.presentation),
      });
    } else {
      setScoreInputs({
        originality: "5",
        content: "5",
        presentation: "5",
      });
    }
  }, [selected, savedEvaluations]);

  const sorted = useMemo(
    () =>
      [...articles].sort(
        (a, b) =>
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
      ),
    [articles],
  );

  function peerCountFor(article: SubmittedArticle): number {
    return peerCounts[article.publicId] ?? article.completedPeerReviews ?? 0;
  }

  function handleSubmitEvaluation() {
    if (!selected) return;
    const id = selected.publicId;
    const o = parseScoreInput(scoreInputs.originality);
    const c = parseScoreInput(scoreInputs.content);
    const p = parseScoreInput(scoreInputs.presentation);
    if (!o.ok || !c.ok || !p.ok) {
      toast.error("Notas inválidas", {
        description:
          "Informe valores entre 0 e 10, com até duas casas decimais após a vírgula (ex.: 7,25).",
      });
      return;
    }
    setSavedEvaluations((prev) => ({
      ...prev,
      [id]: {
        originality: o.value,
        content: c.value,
        presentation: p.value,
      },
    }));
    setPeerCounts((prev) => ({
      ...prev,
      [id]: Math.min(3, (prev[id] ?? peerCountFor(selected)) + 1),
    }));
    setSelected(null);
    toast.success("Avaliação registrada", {
      description: `Notas enviadas para ${id}.`,
    });
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
                <th className="px-4 py-3">Sua avaliação</th>
                <th className="px-4 py-3">Revista</th>
                <th className="px-4 py-3">Submissão</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sorted.map((article) => {
                const peers = peerCountFor(article);
                const mine = savedEvaluations[article.publicId];
                return (
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
                      <ArticleStatusBadge status={article.status} />
                    </td>
                    <td className="px-4 py-3 align-top text-slate-700">
                      {peers}/3
                      {peers >= 3 ? (
                        <span className="ml-1 text-xs text-emerald-700">
                          (pronto para seleção)
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 align-top">
                      {mine ? (
                        <span className="text-xs font-medium text-emerald-800">Enviada</span>
                      ) : (
                        <span className="text-xs text-amber-800">Pendente</span>
                      )}
                    </td>
                    <td className="px-4 py-3 align-top text-slate-700">{article.journalName}</td>
                    <td className="whitespace-nowrap px-4 py-3 align-top text-slate-600">
                      {formatSubmissionDate(article.submittedAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <ul className="flex flex-col gap-3 md:hidden">
          {sorted.map((article) => {
            const peers = peerCountFor(article);
            const mine = savedEvaluations[article.publicId];
            return (
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
                    <ArticleStatusBadge status={article.status} />
                  </div>
                  <p className="mt-2 font-medium text-slate-900">{article.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{article.journalName}</p>
                  <p className="mt-2 text-xs text-slate-600">
                    Avaliações: {peers}/3
                    {mine ? (
                      <span className="ml-2 text-emerald-800">· Sua nota enviada</span>
                    ) : (
                      <span className="ml-2 text-amber-800">· Sua avaliação pendente</span>
                    )}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    Submetido em {formatSubmissionDate(article.submittedAt)}
                  </p>
                </button>
              </li>
            );
          })}
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
                  Avaliação do artigo
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
                  Cada artigo é avaliado por <strong className="text-slate-900">três</strong>{" "}
                  colaboradores habilitados ao tema da edição. Com as três avaliações concluídas, o
                  artigo fica pronto para a seleção pelos editores-chefe.
                </p>

                <div className="grid gap-1 text-slate-700">
                  <p>
                    <span className="font-medium text-slate-900">Revista / edição:</span>{" "}
                    {selected.journalName}
                  </p>
                  <p>
                    <span className="font-medium text-slate-900">Avaliações concluídas:</span>{" "}
                    {peerCountFor(selected)}/3
                  </p>
                  <p className="text-xs text-slate-600">
                    Submissão: {formatSubmissionDateTime(selected.submittedAt)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Autores
                  </p>
                  <ul className="mt-1.5 list-inside list-disc text-slate-800">
                    {selected.authors.map((name) => (
                      <li key={name}>{name}</li>
                    ))}
                  </ul>
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

                {savedEvaluations[selected.publicId] ? (
                  <div className="rounded-lg border border-emerald-200/80 bg-emerald-50/60 p-3 text-sm text-emerald-950">
                    <p className="font-medium">Você já enviou sua avaliação para este artigo.</p>
                    <ul className="mt-2 space-y-2 text-emerald-900">
                      <li className="flex items-center justify-between gap-4">
                        <span className="font-medium">Originalidade</span>
                        <span className="font-mono tabular-nums">
                          {formatScoreBr(savedEvaluations[selected.publicId].originality)}
                        </span>
                      </li>
                      <li className="flex items-center justify-between gap-4">
                        <span className="font-medium">Conteúdo</span>
                        <span className="font-mono tabular-nums">
                          {formatScoreBr(savedEvaluations[selected.publicId].content)}
                        </span>
                      </li>
                      <li className="flex items-center justify-between gap-4">
                        <span className="font-medium">Apresentação</span>
                        <span className="font-mono tabular-nums">
                          {formatScoreBr(savedEvaluations[selected.publicId].presentation)}
                        </span>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <div className="space-y-4 border-t border-border/60 pt-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Critérios (0 a 10)
                    </p>
                    <p className="text-xs text-slate-500">
                      Digite números decimais com até duas casas após a vírgula. Também é aceito
                      ponto como separador.
                    </p>
                    {(
                      [
                        ["originality", "Originalidade"] as const,
                        ["content", "Conteúdo"] as const,
                        ["presentation", "Apresentação"] as const,
                      ] as const
                    ).map(([key, label]) => (
                      <div
                        key={key}
                        className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1"
                      >
                        <Label
                          htmlFor={`score-${key}`}
                          className="min-w-0 shrink text-sm font-medium"
                        >
                          {label}
                        </Label>
                        <div className="flex shrink-0 items-center gap-2">
                          <Input
                            id={`score-${key}`}
                            type="text"
                            inputMode="decimal"
                            autoComplete="off"
                            className="h-9 w-28 font-mono tabular-nums sm:w-32"
                            value={scoreInputs[key]}
                            onChange={(e) =>
                              setScoreInputs((s) => ({ ...s, [key]: e.target.value }))
                            }
                            onBlur={() => {
                              const parsed = parseScoreInput(scoreInputs[key]);
                              if (parsed.ok) {
                                setScoreInputs((s) => ({
                                  ...s,
                                  [key]: formatScoreBr(parsed.value),
                                }));
                              }
                            }}
                            placeholder="0 a 10"
                            aria-describedby={`score-${key}-hint`}
                          />
                          <p id={`score-${key}-hint`} className="sr-only">
                            Nota de 0 a 10, no máximo duas casas decimais.
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                {savedEvaluations[selected.publicId] ? null : (
                  <Button
                    type="button"
                    className="bg-slate-800 text-sm text-slate-50 hover:bg-slate-900"
                    onClick={handleSubmitEvaluation}
                  >
                    Enviar avaliação
                  </Button>
                )}
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
