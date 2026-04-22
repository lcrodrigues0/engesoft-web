import { submittedArticles, type SubmittedArticle } from "@/lib/articles/submitted-articles";

/** Avaliação individual feita por um colaborador (avaliador). */
export type PeerReviewRecord = {
  reviewerName: string;
  email: string;
  institution: string;
  originality: number;
  content: number;
  presentation: number;
};

export type ArticleSelectionRow = SubmittedArticle & {
  peerEvaluations: PeerReviewRecord[];
};

export type EditorSelectionDecision = "selected" | "not_selected";

const SAMPLE_EVALS: PeerReviewRecord[] = [
  {
    reviewerName: "Maria Costa Silva",
    email: "m.costa@ufabc.edu.br",
    institution: "Universidade Federal do ABC",
    originality: 8.25,
    content: 7.5,
    presentation: 8,
  },
  {
    reviewerName: "João Pedro Almeida",
    email: "jp.almeida@unicamp.br",
    institution: "Universidade Estadual de Campinas",
    originality: 7,
    content: 8.75,
    presentation: 7.25,
  },
  {
    reviewerName: "Ana Lucia Ferreira",
    email: "ana.ferreira@usp.br",
    institution: "Universidade de São Paulo",
    originality: 9,
    content: 8,
    presentation: 8.5,
  },
];

function sliceEvals(n: number): PeerReviewRecord[] {
  return SAMPLE_EVALS.slice(0, Math.min(3, Math.max(0, n))).map((e, i) => ({
    ...e,
    originality: Math.min(10, Math.max(0, e.originality + (i - 1) * 0.25)),
    content: Math.min(10, Math.max(0, e.content - i * 0.15)),
    presentation: Math.min(10, Math.max(0, e.presentation + (i % 2) * 0.5)),
  }));
}

/**
 * Fila de artigos para a seleção editorial (mock).
 * As avaliações por avaliador espelham `completedPeerReviews` de cada artigo.
 */
export const selectionArticleRows: ArticleSelectionRow[] = submittedArticles.map(
  (a) => ({
    ...a,
    peerEvaluations: sliceEvals(a.completedPeerReviews ?? 0),
  }),
);

export function isReadyForEditorSelection(row: ArticleSelectionRow): boolean {
  return row.peerEvaluations.length >= 3;
}

/** Artigos com três avaliações concluídas (sem filtro de status). */
export const selectionArticleRowsWithThreeReviews: ArticleSelectionRow[] =
  selectionArticleRows.filter(isReadyForEditorSelection);

/**
 * Fila exibida na página de seleção: status aprovado, três avaliações concluídas.
 */
export const selectionArticleRowsApprovedForSelection: ArticleSelectionRow[] =
  selectionArticleRows.filter(
    (row) => isReadyForEditorSelection(row) && row.status === "approved",
  );
