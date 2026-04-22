export type ArticleEvaluationScores = {
  originality: number;
  content: number;
  presentation: number;
};

export function formatScoreBr(n: number): string {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(n);
}

/** Aceita vírgula ou ponto; exige entre 0 e 10 e no máximo duas casas decimais. */
export function parseScoreInput(
  raw: string,
): { ok: true; value: number } | { ok: false } {
  const t = raw.trim().replace(/\s/g, "");
  if (t === "") return { ok: false };
  if (t.includes(",") && t.includes(".")) return { ok: false };
  const normalized = t.replace(",", ".");
  const n = Number(normalized);
  if (!Number.isFinite(n)) return { ok: false };
  const frac = normalized.split(".")[1];
  if (frac !== undefined && frac.length > 2) return { ok: false };
  const rounded = Math.round(n * 100) / 100;
  if (rounded < 0 || rounded > 10) return { ok: false };
  return { ok: true, value: rounded };
}
