export type ArticleSubmissionStatus = "approved" | "rejected" | "under_review";

/** Dados completos de cada autor (submissões novas; mocks antigos podem omitir) */
export type SubmittedArticleAuthor = {
  fullName: string;
  email: string;
  institutionName: string;
  institutionAddress: string;
  isContact: boolean;
};

export type SubmittedArticle = {
  /** Identificador único exibido ao autor (ex.: ENGE-2026-0042) */
  publicId: string;
  title: string;
  status: ArticleSubmissionStatus;
  /** Nome da revista / edição temática */
  journalName: string;
  /** Data da submissão (ISO 8601) */
  submittedAt: string;
  /**
   * Modo avaliador: quantas das três avaliações obrigatórias já foram concluídas (mock).
   */
  completedPeerReviews?: number;
  /** Nomes para exibição na lista (ex.: "Silva, A." ou com marcação de contato) */
  authors: string[];
  /** Detalhes por autor (quando disponível) */
  authorDetails?: SubmittedArticleAuthor[];
  /** Nome do arquivo enviado */
  fileName: string;
  /** URL para visualizar ou baixar o manuscrito (mock) */
  fileUrl: string;
};

/** Próximo identificador sequencial para o ano corrente (ENGE-AAAA-NNNN) */
export function nextSubmissionPublicId(existing: SubmittedArticle[]): string {
  const year = new Date().getFullYear();
  let maxSeq = 0;
  for (const a of existing) {
    const m = a.publicId.match(/^ENGE-(\d{4})-(\d{4})$/);
    if (m) {
      const y = Number(m[1]);
      const seq = Number(m[2]);
      if (y === year) maxSeq = Math.max(maxSeq, seq);
    }
  }
  return `ENGE-${year}-${String(maxSeq + 1).padStart(4, "0")}`;
}

/** PDF de exemplo (público) para demonstração */
const SAMPLE_PDF =
  "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

function authorsFromRef(s: string): string[] {
  return s
    .split(";")
    .map((a) => a.trim())
    .filter(Boolean);
}

/**
 * Lista demonstrativa de artigos submetidos pelo usuário autenticado.
 * Substituir por dados da API quando disponível.
 */
export const submittedArticles: SubmittedArticle[] = [
  {
    publicId: "ENGE-2026-0042",
    title: "Métricas de qualidade em pipelines DevOps",
    status: "under_review",
    journalName: "Qualidade de Software",
    completedPeerReviews: 2,
    submittedAt: "2026-03-18T14:22:00.000Z",
    authors: authorsFromRef("Silva, A.; Costa, B."),
    fileName: "metricas-devops-v2.pdf",
    fileUrl: SAMPLE_PDF,
  },
  {
    publicId: "ENGE-2026-0038",
    title: "Revisão sistemática sobre dívida técnica",
    status: "approved",
    journalName: "Qualidade de Software",
    completedPeerReviews: 3,
    submittedAt: "2026-02-02T09:15:00.000Z",
    authors: authorsFromRef("Santos, D.; Lima, E."),
    fileName: "revisao-divida-tecnica.pdf",
    fileUrl: SAMPLE_PDF,
  },
  {
    publicId: "ENGE-2026-0031",
    title: "Lakehouse com Delta e Spark",
    status: "rejected",
    journalName: "Engenharia de Dados",
    completedPeerReviews: 3,
    submittedAt: "2026-01-20T16:40:00.000Z",
    authors: authorsFromRef("Barbosa, P."),
    fileName: "lakehouse-delta-spark.pdf",
    fileUrl: SAMPLE_PDF,
  },
  {
    publicId: "ENGE-2026-0027",
    title: "Governança de metadados corporativos",
    status: "under_review",
    journalName: "Engenharia de Dados",
    completedPeerReviews: 1,
    submittedAt: "2026-03-05T11:08:00.000Z",
    authors: authorsFromRef("Nunes, S."),
    fileName: "governanca-metadados-final.pdf",
    fileUrl: SAMPLE_PDF,
  },
  {
    publicId: "ENGE-2026-0019",
    title: "LLMs em suporte ao cliente: limites éticos",
    status: "approved",
    journalName: "Inteligência Artificial aplicada",
    completedPeerReviews: 3,
    submittedAt: "2025-12-12T13:55:00.000Z",
    authors: authorsFromRef("Reis, AE."),
    fileName: "llms-suporte-cliente.pdf",
    fileUrl: SAMPLE_PDF,
  },
  {
    publicId: "ENGE-2026-0014",
    title: "RAG para documentação técnica interna",
    status: "under_review",
    journalName: "Inteligência Artificial aplicada",
    completedPeerReviews: 0,
    submittedAt: "2026-03-22T08:30:00.000Z",
    authors: authorsFromRef("Fonseca, AI.; Matos, AJ."),
    fileName: "rag-doc-interna.pdf",
    fileUrl: SAMPLE_PDF,
  },
  {
    publicId: "ENGE-2026-0009",
    title: "Qualidade percebida em APIs REST públicas",
    status: "rejected",
    journalName: "Qualidade de Software",
    completedPeerReviews: 3,
    submittedAt: "2025-11-03T10:00:00.000Z",
    authors: authorsFromRef("Almeida, G.; Rocha, H."),
    fileName: "qualidade-apis-rest.pdf",
    fileUrl: SAMPLE_PDF,
  },
];

export const articleStatusLabels: Record<ArticleSubmissionStatus, string> = {
  approved: "Aprovado",
  rejected: "Reprovado",
  under_review: "Em avaliação",
};

export function formatSubmissionDate(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export function formatSubmissionDateTime(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}
