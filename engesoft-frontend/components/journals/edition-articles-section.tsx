"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import type { JournalEditionDetail } from "@/lib/journals/editions";

type EditionArticlesSectionProps = {
  edition: JournalEditionDetail;
};

export function EditionArticlesSection({ edition }: EditionArticlesSectionProps) {
  const { user } = useAuth();
  const isContributor = user?.baseType === "CONTRIBUTOR";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {isContributor ? (
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
      ) : null}

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
  );
}
