"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { submittedArticles as initialSubmittedArticles } from "@/lib/articles/submitted-articles";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SubmitArticleDialog } from "./submit-article-dialog";
import { SubmittedArticlesView } from "./submitted-articles-view";

export function ArticlesPageClient() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [articles, setArticles] = useState(() => [...initialSubmittedArticles]);
  const [submitOpen, setSubmitOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (user === null) return;
    if (!user.roles.includes("AUTHOR")) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user === null) {
    return (
      <div className="-m-6 flex min-h-[calc(100dvh-3.5rem)] items-center justify-center bg-slate-100 p-6">
        <p className="text-sm text-slate-600">Carregando…</p>
      </div>
    );
  }

  if (!user.roles.includes("AUTHOR")) {
    return (
      <div className="-m-6 flex min-h-[calc(100dvh-3.5rem)] items-center justify-center bg-slate-100 p-6">
        <p className="text-sm text-slate-600">Redirecionando…</p>
      </div>
    );
  }

  return (
    <div className="-m-6 min-h-[calc(100dvh-3.5rem)] bg-slate-100 p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <header className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight text-slate-800 md:text-3xl">
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
