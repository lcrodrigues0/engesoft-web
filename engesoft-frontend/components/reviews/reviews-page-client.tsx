"use client";

import { submittedArticles as initialSubmittedArticles } from "@/lib/articles/submitted-articles";
import { useState } from "react";
import { ReviewerArticlesView } from "./reviewer-articles-view";

export function ReviewsPageClient() {
  const [articles] = useState(() => [...initialSubmittedArticles]);

  return (
    <div className="-m-6 min-h-[calc(100dvh-3.5rem)] bg-slate-100 p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 max-w-3xl">
          <h1 className="text-xl font-bold tracking-tight text-slate-800 md:text-3xl">
            Painel de avaliação
          </h1>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-600 md:text-base">
            <p>
              A EngeSoft distribui artigos submetidos entre colaboradores habilitados por tema de
              edição.
            </p>
            <p>
              Cada artigo é obrigatoriamente avaliado por <strong className="font-semibold text-slate-800">três</strong>{" "}
              colaboradores, todos habilitados ao tema da edição. Cada um atribui notas de{" "}
              <strong className="font-semibold text-slate-800">0 a 10</strong> a três critérios:{" "}
              <strong className="font-semibold text-slate-800">originalidade</strong>,{" "}
              <strong className="font-semibold text-slate-800">conteúdo</strong> e{" "}
              <strong className="font-semibold text-slate-800">apresentação</strong>. Com isso define-se
              se o artigo segue para publicação ou não.
            </p>
            <p>
              Artigos que já receberam as três avaliações estão prontos para a{" "}
              <strong className="font-semibold text-slate-800">seleção</strong> pelos editores-chefe;
              caso contrário permanecem em avaliação. A seleção só pode ocorrer quando todos os
              artigos da edição tiverem sido avaliados. Finda a seleção, ficam definidos os
              manuscritos aceitos para publicação e os rejeitados.
            </p>
          </div>
        </header>

        <ReviewerArticlesView articles={articles} />
      </div>
    </div>
  );
}
