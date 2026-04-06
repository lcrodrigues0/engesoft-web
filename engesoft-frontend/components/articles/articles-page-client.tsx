"use client";

import { Button } from "@/components/ui/button";
import { submittedArticles as initialSubmittedArticles } from "@/lib/articles/submitted-articles";
import { toast } from "sonner";
import { useState } from "react";
import { SubmitArticleDialog } from "./submit-article-dialog";
import { SubmittedArticlesView } from "./submitted-articles-view";

export function ArticlesPageClient() {
  const [articles, setArticles] = useState(() => [...initialSubmittedArticles]);
  const [submitOpen, setSubmitOpen] = useState(false);

  return (
    <div className="-m-6 min-h-[calc(100dvh-3.5rem)] bg-linear-to-br from-slate-300 to-slate-100 p-6 md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <header className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight text-slate-800 md:text-2xl">
              Artigos submetidos
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-600 md:text-base">
              Submeta um manuscrito para uma edição específica da revista. Cada submissão recebe um
              número de identificação. Selecione um artigo na lista para ver autores, instituições e
              o arquivo enviado.
            </p>
          </header>
          <Button
            type="button"
            size="lg"
            className="h-11 shrink-0 bg-slate-800 text-slate-50 hover:bg-slate-900 sm:h-10"
            onClick={() => setSubmitOpen(true)}
          >
            Submeter artigo
          </Button>
        </div>

        <SubmittedArticlesView articles={articles} />
      </div>

      <SubmitArticleDialog
        open={submitOpen}
        onOpenChange={setSubmitOpen}
        existingArticles={articles}
        onSubmitted={(article) => {
          setArticles((prev) => [article, ...prev]);
          setSubmitOpen(false);
          toast.success("Artigo submetido com sucesso", {
            description: `Identificação: ${article.publicId}. Status: em avaliação.`,
          });
        }}
      />
    </div>
  );
}
