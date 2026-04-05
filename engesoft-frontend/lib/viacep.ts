const VIACEP_BASE = "https://viacep.com.br/ws";

/** Formato bruto retornado pela API ViaCEP */
type ViaCepJson = {
  cep?: string;
  logradouro?: string;
  complemento?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
};

export type AddressResponse = {
  zipCode: string;        // cep
  street: string;         // logradouro
  complement: string;     // complemento
  neighborhood: string;   // bairro
  city: string;           // localidade
  state: string;          // uf
  error?: boolean;        // erro
};

export function normalizeCepDigits(input: string): string {
  return input.replace(/\D/g, "").slice(0, 8);
}

export function formatCepDisplay(digits: string): string {
  const d = normalizeCepDigits(digits);
  if (d.length <= 5) return d;
  return `${d.slice(0, 5)}-${d.slice(5)}`;
}

export async function fetchAddressByCep(
  cepDigits: string,
  signal?: AbortSignal,
): Promise<AddressResponse | null> {
  if (cepDigits.length !== 8) return null;

  const res = await fetch(`${VIACEP_BASE}/${cepDigits}/json/`, { signal });
  if (!res.ok) throw new Error("Falha ao consultar o CEP.");

  const raw = (await res.json()) as ViaCepJson;
  if (raw.erro) return null;

  const data = {
    zipCode: (raw.cep ?? "").trim(),
    street: (raw.logradouro ?? "").trim(),
    complement: (raw.complemento ?? "").trim(),
    neighborhood: (raw.bairro ?? "").trim(),
    city: (raw.localidade ?? "").trim(),
    state: (raw.uf ?? "").trim(),
  } as AddressResponse;

  return data;
}
