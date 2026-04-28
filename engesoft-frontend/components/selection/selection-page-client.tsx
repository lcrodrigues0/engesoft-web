"use client";

import { useAuth } from "@/contexts/AuthContext";
import { selectionArticleRowsApprovedForSelection } from "@/lib/articles/selection-queue";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";
import { SelectionArticlesView } from "./selection-articles-view";

export function SelectionPageClient() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [articles] = useState(selectionArticleRowsApprovedForSelection);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (user === null) return;
    if (!user.roles.includes("CHIEF_EDITOR")) {
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

  if (!user.roles.includes("CHIEF_EDITOR")) {
    return (
      <div className="-m-6 flex min-h-[calc(100dvh-3.5rem)] items-center justify-center bg-slate-100 p-6">
        <p className="text-sm text-slate-600">Redirecionando…</p>
      </div>
    );
  }

  return (
    <div className="-m-6 min-h-[calc(100dvh-3.5rem)] bg-slate-100 p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 max-w-3xl">
          <h1 className="text-xl font-bold tracking-tight text-slate-800 md:text-3xl">
            Seleção de artigos
          </h1>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-600 md:text-base">
            <p>
              Os editores-chefe da edição analisam as avaliações feitas pelos colaboradores e
              decidem quais manuscritos serão <strong className="font-semibold text-slate-800">publicados</strong>{" "}
              ou <strong className="font-semibold text-slate-800">rejeitados</strong> nesta edição.
            </p>
            <p>
              São listados apenas artigos <strong className="font-semibold text-slate-800">aprovados</strong>{" "}
              no fluxo editorial, com as <strong className="font-semibold text-slate-800">três</strong>{" "}
              avaliações concluídas. Abra cada item para ver as notas de cada avaliador e registrar a
              decisão.
            </p>
          </div>
        </header>

        <SelectionArticlesView articles={articles} />
      </div>
    </div>
  );
}
