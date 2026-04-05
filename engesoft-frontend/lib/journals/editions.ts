export type JournalArticleRef = {
  title: string;
  authors?: string;
};

export type JournalEditionDetail = {
  id: string;
  coverSrc: string;
  coverAlt?: string;
  /** Título exibido no card e como tema principal da edição */
  theme: string;
  volume: number;
  number: number;
  month: string;
  year: number;
  /** Artigos enviados à edição (submetidos) */
  articlesSubmitted: JournalArticleRef[];
  /** Artigos aceitos/publicados nesta edição (selecionados) */
  articlesSelected: JournalArticleRef[];
};

function cardPeriod(e: JournalEditionDetail) {
  return `${e.month}/${e.year} • v.${e.volume} n.${e.number}`;
}

function cardBadge(e: JournalEditionDetail) {
  const n = e.articlesSelected.length;
  return `${n} ${n === 1 ? "artigo" : "artigos"}`;
}

export const journalEditions: JournalEditionDetail[] = [
  {
    id: "vol12n4-qualidade-software",
    coverSrc:
      "https://res.cloudinary.com/dnxmt9urd/image/upload/v1775354640/samples/zoom.avif",
    coverAlt: "Capa da revista Qualidade de Software, abril 2026",
    theme: "Qualidade de Software",
    volume: 12,
    number: 4,
    month: "Abril",
    year: 2026,
    articlesSubmitted: [
      { title: "Métricas de qualidade em pipelines DevOps", authors: "Silva, A.; Costa, B." },
      { title: "Testes de contrato em microsserviços", authors: "Oliveira, C." },
      { title: "Revisão sistemática sobre dívida técnica", authors: "Santos, D.; Lima, E." },
      { title: "Análise estática contínua em monorepos", authors: "Pereira, F." },
      { title: "Qualidade percebida em APIs REST públicas", authors: "Almeida, G.; Rocha, H." },
      { title: "Mutation testing em aplicações legadas", authors: "Martins, I." },
      { title: "ISO 25010 aplicada a produtos SaaS", authors: "Carvalho, J.; Dias, K." },
      { title: "Observabilidade e SLOs em equipes ágeis", authors: "Ferreira, L." },
      { title: "Padronização de code review em times remotos", authors: "Gomes, M." },
      { title: "Segurança como requisito de qualidade", authors: "Ribeiro, N.; Araújo, O." },
    ],
    articlesSelected: [
      { title: "Métricas de qualidade em pipelines DevOps", authors: "Silva, A.; Costa, B." },
      { title: "Testes de contrato em microsserviços", authors: "Oliveira, C." },
      { title: "Revisão sistemática sobre dívida técnica", authors: "Santos, D.; Lima, E." },
      { title: "Análise estática contínua em monorepos", authors: "Pereira, F." },
      { title: "Qualidade percebida em APIs REST públicas", authors: "Almeida, G.; Rocha, H." },
      { title: "Mutation testing em aplicações legadas", authors: "Martins, I." },
      { title: "ISO 25010 aplicada a produtos SaaS", authors: "Carvalho, J.; Dias, K." },
      { title: "Observabilidade e SLOs em equipes ágeis", authors: "Ferreira, L." },
    ],
  },
  {
    id: "vol12n3-engenharia-dados",
    coverSrc:
      "https://res.cloudinary.com/dnxmt9urd/image/upload/v1775357990/Gemini_Generated_Image_k3iiwgk3iiwgk3ii_pqafap.png",
    coverAlt: "Capa da revista Engenharia de Dados, março 2026",
    theme: "Engenharia de Dados",
    volume: 12,
    number: 3,
    month: "Março",
    year: 2026,
    articlesSubmitted: [
      { title: "Lakehouse com Delta e Spark", authors: "Barbosa, P." },
      { title: "Linhas de dados em tempo real com Kafka", authors: "Teixeira, Q.; Melo, R." },
      { title: "Governança de metadados corporativos", authors: "Nunes, S." },
      { title: "Modelagem dimensional para analytics self-service", authors: "Correia, T." },
      { title: "Qualidade de dados em pipelines ETL", authors: "Vieira, U." },
      { title: "Feature stores em produção", authors: "Monteiro, V." },
      { title: "Privacidade diferencial em agregações", authors: "Cardoso, W." },
      { title: "Catálogo de dados open source", authors: "Lopes, X." },
      { title: "Streaming SQL: estado da arte", authors: "Henriques, Y." },
      { title: "Custos de armazenamento em nuvem", authors: "Morais, Z." },
      { title: "Integração DBT em squads de dados", authors: "Duarte, AA." },
      { title: "Vector databases para busca semântica", authors: "Cunha, AB." },
      { title: "Orquestração com Airflow vs Dagster", authors: "Pinto, AC." },
      { title: "Testes de dados em ambientes críticos", authors: "Macedo, AD." },
    ],
    articlesSelected: [
      { title: "Lakehouse com Delta e Spark", authors: "Barbosa, P." },
      { title: "Linhas de dados em tempo real com Kafka", authors: "Teixeira, Q.; Melo, R." },
      { title: "Governança de metadados corporativos", authors: "Nunes, S." },
      { title: "Modelagem dimensional para analytics self-service", authors: "Correia, T." },
      { title: "Qualidade de dados em pipelines ETL", authors: "Vieira, U." },
      { title: "Feature stores em produção", authors: "Monteiro, V." },
      { title: "Privacidade diferencial em agregações", authors: "Cardoso, W." },
      { title: "Catálogo de dados open source", authors: "Lopes, X." },
      { title: "Streaming SQL: estado da arte", authors: "Henriques, Y." },
      { title: "Custos de armazenamento em nuvem", authors: "Morais, Z." },
      { title: "Integração DBT em squads de dados", authors: "Duarte, AA." },
      { title: "Vector databases para busca semântica", authors: "Cunha, AB." },
    ],
  },
  {
    id: "vol12n2-ia-aplicada",
    coverSrc:
      "https://res.cloudinary.com/dnxmt9urd/image/upload/v1775358263/Gemini_Generated_Image_caadjlcaadjlcaad_zgzeox.png",
    coverAlt: "Capa da revista Inteligência Artificial aplicada, fevereiro 2026",
    theme: "Inteligência Artificial aplicada",
    volume: 12,
    number: 2,
    month: "Fevereiro",
    year: 2026,
    articlesSubmitted: [
      { title: "LLMs em suporte ao cliente: limites éticos", authors: "Reis, AE." },
      { title: "Fine-tuning com poucos dados rotulados", authors: "Tavares, AF." },
      { title: "Visão computacional em inspeção industrial", authors: "Bastos, AG." },
      { title: "Explicabilidade em modelos de scoring", authors: "Campos, AH." },
      { title: "RAG para documentação técnica interna", authors: "Fonseca, AI." },
      { title: "Consumo energético no treino de redes profundas", authors: "Matos, AJ." },
      { title: "Avaliação humana de saídas generativas", authors: "Neves, AK." },
      { title: "Detecção de viés em conjuntos de treino", authors: "Paiva, AL." },
    ],
    articlesSelected: [
      { title: "LLMs em suporte ao cliente: limites éticos", authors: "Reis, AE." },
      { title: "Fine-tuning com poucos dados rotulados", authors: "Tavares, AF." },
      { title: "Visão computacional em inspeção industrial", authors: "Bastos, AG." },
      { title: "Explicabilidade em modelos de scoring", authors: "Campos, AH." },
      { title: "RAG para documentação técnica interna", authors: "Fonseca, AI." },
      { title: "Consumo energético no treino de redes profundas", authors: "Matos, AJ." },
    ],
  },
];

export function getEditionById(id: string): JournalEditionDetail | undefined {
  return journalEditions.find((e) => e.id === id);
}

export function editionToCardProps(e: JournalEditionDetail) {
  return {
    title: e.theme,
    period: cardPeriod(e),
    badge: cardBadge(e),
    coverSrc: e.coverSrc,
    coverAlt: e.coverAlt,
    viewHref: `/dashboard/journals/${e.id}`,
  };
}
