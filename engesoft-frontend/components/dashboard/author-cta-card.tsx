"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  fetchAddressByCep,
  formatCepDisplay,
  normalizeCepDigits,
} from "@/lib/viacep";
import { cn } from "@/lib/utils";
import { ApiError } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from 'sonner';
import { useAuth } from "@/contexts/AuthContext";
import { registerAuthor } from "@/services/author.service";
import { saveAuthorProfileStorage } from "@/lib/cta-profile-storage";

type AuthorCtaCardProps = {
  className?: string;
};

export function AuthorCtaCard({ className }: AuthorCtaCardProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [institutionName, setInstitutionName] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [stateUf, setStateUf] = useState("");
  const [zip, setZip] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cepLoading, setCepLoading] = useState(false);
  const [cepLookupError, setCepLookupError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const cepDigits = normalizeCepDigits(zip);

  const { user, loading, setUser, refreshUser } = useAuth();
  const isAuthor = user?.roles?.includes("AUTHOR") ?? false;
  
  useEffect(() => {
    if (loading || cepDigits.length !== 8) {
      setCepLookupError(null);
      setCepLoading(false);
      return;
    }

    const ac = new AbortController();
    const timer = window.setTimeout(async () => {
      setCepLoading(true);
      setCepLookupError(null);
      try {
        const data = await fetchAddressByCep(cepDigits, ac.signal);
        if (ac.signal.aborted) return;
        if (!data) {
          setCepLookupError("CEP não encontrado.");
          return;
        }
        setStreet(data.street?.trim() ?? "");
        setNeighborhood(data.neighborhood?.trim() ?? "");
        setCity(data.city?.trim() ?? "");
        setStateUf((data.state ?? "").trim().toUpperCase().slice(0, 2));
      } catch (e: unknown) {
        const aborted =
          e instanceof DOMException && e.name === "AbortError";
        if (aborted) return;
        setCepLookupError("Não foi possível consultar o CEP. Tente de novo.");
      } finally {
        setCepLoading(false);
      }
    }, 450);

    return () => {
      window.clearTimeout(timer);
      ac.abort();
    };
  }, [cepDigits, loading]);

  function handleOpenChange(next: boolean) {
    if (submitting && !next) return;
    setOpen(next);
    if (!next) {
      setError(null);
      setCepLookupError(null);
      setCepLoading(false);
    }
  }

  function resetAddressFields() {
    setStreet("");
    setNumber("");
    setComplement("");
    setNeighborhood("");
    setCity("");
    setStateUf("");
    setZip("");
  }

  async function handleConfirm() {
    const name = institutionName.trim();
    const s = street.trim();
    const n = number.trim();
    const nb = neighborhood.trim();
    const c = city.trim();
    const uf = stateUf.trim().toUpperCase();
    const cepNormalized = normalizeCepDigits(zip);

    if (!name) {
      setError("Informe o nome da instituição.");
      return;
    }
    if (cepNormalized.length !== 8) {
      setError("Informe um CEP válido com 8 dígitos.");
      return;
    }
    if (!s) {
      setError("Informe o logradouro.");
      return;
    }
    if (!n) {
      setError("Informe o número.");
      return;
    }
    if (!nb) {
      setError("Informe o bairro.");
      return;
    }
    if (!c) {
      setError("Informe a cidade.");
      return;
    }
    if (!/^[A-Z]{2}$/.test(uf)) {
      setError("Informe a UF com 2 letras (ex.: SP).");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await registerAuthor({
        institutionName: name,
        street: s,
        number: n,
        complement: complement.trim() || undefined,
        neighborhood: nb,
        city: c,
        stateUf: uf,
        zipCode: cepNormalized,
      });

      if (user?.id) {
        saveAuthorProfileStorage(user.id, {
          institutionName: name,
          address: {
            street: s,
            number: n,
            complement: complement.trim() || undefined,
            neighborhood: nb,
            city: c,
            stateUf: uf,
            zipCode: cepNormalized,
          },
        });
      }

      if (user && !user.roles.includes("AUTHOR")) {
        setUser({ ...user, roles: [...user.roles, "AUTHOR"] });
      }
      await refreshUser();

      setOpen(false);
      setInstitutionName("");
      resetAddressFields();

      toast.success("Cadastro como autor realizado com sucesso!", {
        description: "Você já está habilitado a submeter artigos. Acesse a aba Artigos para isso."
      });
    } catch (e: unknown) {
      const message =
        e instanceof ApiError
          ? e.message
          : "Não foi possível concluir o cadastro como autor.";
      setError(message);
      toast.error("Erro ao cadastrar autor", {
        description: message,
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return null;
  if (isAuthor) return;

  return (
    <>
      <section
        className={cn(
          "w-full max-w-lg rounded-2xl border border-slate-200/90",
          "bg-white px-5 py-5 text-center shadow-sm ring-1 ring-slate-200/60 md:px-7 md:py-6", "max-h-55",
          className,
        )}
        aria-labelledby="author-cta-heading"
      >
        <h2
          id="author-cta-heading"
          className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl"
        >
          Seja um Autor na EngeSoft
        </h2>
        <p className="mx-auto mt-2 max-w-md text-pretty text-sm leading-relaxed text-slate-800 md:text-base">
          Sua pesquisa merece destaque. Cadastre-se como autor e submeta seus
          artigos sobre os temas mais atuais da engenharia de software.
        </p>
        <Button
          type="button"
          className="mt-4 rounded-full bg-slate-800 px-5 py-1.5 text-sm font-medium text-slate-50 hover:bg-slate-900 md:text-base"
          onClick={() => setOpen(true)}
        >
          Realizar Cadastro como Autor
        </Button>
      </section>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          className="bg-slate-100 flex max-h-[min(90dvh,50rem)] flex-col gap-0 overflow-hidden p-0 text-sm sm:max-w-md md:max-w-xl"
          showCloseButton
        >
          <DialogHeader className="shrink-0 gap-1.5 border-b border-border/60 px-4 pb-3 pt-4 pr-12">
            <DialogTitle className="text-xl font-semibold leading-tight">
              Cadastro como autor
            </DialogTitle>
            <DialogDescription className="text-base leading-snug">
              Confirme que deseja se cadastrar como autor para submeter artigos e preencha os
              dados da sua instituição.
            </DialogDescription>
          </DialogHeader>

          <div
            className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-4 py-3 [scrollbar-gutter:stable]"
          >
            <div className="space-y-2.5 text-left text-base leading-relaxed text-slate-700 sm:text-sm">
              <p>
                Deseja se cadastrar como <strong className="text-slate-900">autor</strong> na
                EngeSoft para <strong className="text-slate-900">submeter artigos</strong> à
                revista?
              </p>
              <p className="text-muted-foreground">
                Informe a instituição à qual você está associado(a) e o endereço completo.
              </p>
            </div>

            <div className="mt-4 grid gap-3.5 mb-5">
              <div className="grid gap-1.5">
                <Label htmlFor="author-institution-name" className="text-xs sm:text-base">
                  Nome da instituição
                </Label>
                <Input
                  id="author-institution-name"
                  className="h-9 text-base"
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  placeholder="Ex.: Universidade Federal ..."
                  autoComplete="organization"
                />
              </div>
              <fieldset className="mt-2 grid gap-3 border-0 p-0">
                <legend className="mb-0.5 text-xs font-medium text-slate-900 sm:text-base">
                  Endereço da instituição
                </legend>

                <div className="grid gap-3 sm:grid-cols-6 sm:items-start">
                  <div className="grid gap-1.5 sm:col-span-2">
                    <Label htmlFor="author-inst-cep" className="text-xs sm:text-sm">
                      CEP
                    </Label>
                    <Input
                      id="author-inst-cep"
                      className="h-9 text-sm"
                      value={zip}
                      onChange={(e) => setZip(formatCepDisplay(e.target.value))}
                      placeholder="00000-000"
                      inputMode="numeric"
                      autoComplete="postal-code"
                      maxLength={9}
                      disabled={cepLoading}
                      aria-busy={cepLoading}
                    />
                  </div>
                  <div className="grid gap-1.5 sm:col-span-4">
                    <Label htmlFor="author-inst-street" className="text-xs sm:text-sm">
                      Logradouro
                    </Label>
                    <Input
                      id="author-inst-street"
                      className="h-9 text-sm"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="Rua, avenida, etc."
                      autoComplete="street-address"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-6">
                    <p className="text-xs text-muted-foreground">
                      {cepLoading
                        ? "Buscando endereço…"
                        : "O endereço é preenchido automaticamente após o CEP."}
                    </p>
                    {cepLookupError ? (
                      <p className="text-xs text-amber-700 dark:text-amber-500">{cepLookupError}</p>
                    ) : null}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-6 sm:items-start">
                  <div className="grid gap-1.5 sm:col-span-2">
                    <Label htmlFor="author-inst-number" className="text-xs sm:text-sm">
                      Número
                    </Label>
                    <Input
                      id="author-inst-number"
                      className="h-9 text-sm"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      placeholder="Nº ou S/N"
                    />
                  </div>
                  <div className="grid gap-1.5 sm:col-span-4">
                    <Label htmlFor="author-inst-complement" className="text-xs sm:text-sm">
                      Complemento{" "}
                      <span className="font-normal text-muted-foreground">(opcional)</span>
                    </Label>
                    <Input
                      id="author-inst-complement"
                      className="h-9 text-sm"
                      value={complement}
                      onChange={(e) => setComplement(e.target.value)}
                      placeholder="Sala, bloco, andar ..."
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-6 sm:items-start">
                  <div className="grid gap-1.5 sm:col-span-2">
                    <Label htmlFor="author-inst-neighborhood" className="text-xs sm:text-sm">
                      Bairro
                    </Label>
                    <Input
                      id="author-inst-neighborhood"
                      className="h-9 text-sm"
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-1.5 sm:col-span-3">
                    <Label htmlFor="author-inst-city" className="text-xs sm:text-sm">
                      Cidade
                    </Label>
                    <Input
                      id="author-inst-city"
                      className="h-9 text-sm"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      autoComplete="address-level2"
                    />
                  </div>
                  <div className="grid gap-1.5 sm:col-span-1">
                    <Label htmlFor="author-inst-uf" className="text-xs sm:text-sm">
                      UF
                    </Label>
                    <Input
                      id="author-inst-uf"
                      className="h-9 text-sm uppercase"
                      value={stateUf}
                      onChange={(e) => setStateUf(e.target.value.slice(0, 2).toUpperCase())}
                      placeholder="SP"
                      maxLength={2}
                      autoComplete="address-level1"
                    />
                  </div>
                </div>
              </fieldset>
              {error ? <p className="text-xs text-red-600 sm:text-sm">{error}</p> : null}
            </div>
          </div>

          <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-border/60 px-4 py-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="text-sm"
              disabled={submitting}
              onClick={() => handleOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              size="lg"
              className="bg-slate-800 text-sm text-slate-50 hover:bg-slate-900"
              disabled={submitting}
              onClick={handleConfirm}
            >
              {submitting ? "Confirmando..." : "Confirmar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
