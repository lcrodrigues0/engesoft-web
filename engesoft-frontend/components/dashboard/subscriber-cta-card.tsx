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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

type SubscriberType = "individual" | "corporate";

type SubscriberCtaCardProps = {
  className?: string;
};

function normalizeDigitsOnly(v: string): string {
  return v.replace(/\D/g, "");
}

export function SubscriberCtaCard({ className }: SubscriberCtaCardProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [subscriberType, setSubscriberType] = useState<SubscriberType>("individual");
  const [email, setEmail] = useState("");

  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [stateUf, setStateUf] = useState("");
  const [zip, setZip] = useState("");

  const [fullName, setFullName] = useState("");
  const [sex, setSex] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [identityNumber, setIdentityNumber] = useState("");
  const [cpf, setCpf] = useState("");

  const [corporateName, setCorporateName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [contactResponsible, setContactResponsible] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [cepLoading, setCepLoading] = useState(false);
  const [cepLookupError, setCepLookupError] = useState<string | null>(null);

  const cepDigits = normalizeCepDigits(zip);

  const { user, isAuthenticated } = useAuth();
  const isGuest = user?.baseType === "GUEST";

  useEffect(() => {
    if (cepDigits.length !== 8) {
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
        const aborted = e instanceof DOMException && e.name === "AbortError";
        if (aborted) return;
        setCepLookupError("Não foi possível consultar o CEP. Tente novamente.");
      } finally {
        setCepLoading(false);
      }
    }, 450);

    return () => {
      window.clearTimeout(timer);
      ac.abort();
    };
  }, [cepDigits]);

  function resetAddressFields() {
    setStreet("");
    setNumber("");
    setComplement("");
    setNeighborhood("");
    setCity("");
    setStateUf("");
    setZip("");
  }

  function resetPersonFields() {
    setFullName("");
    setSex("");
    setBirthDate("");
    setIdentityNumber("");
    setCpf("");
  }

  function resetCorporateFields() {
    setCorporateName("");
    setCnpj("");
    setContactResponsible("");
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setError(null);
      setCepLookupError(null);
      setCepLoading(false);
    }
  }

  function handleConfirm() {
    const emailTrimmed = email.trim();
    const streetTrimmed = street.trim();
    const numberTrimmed = number.trim();
    const neighborhoodTrimmed = neighborhood.trim();
    const cityTrimmed = city.trim();
    const uf = stateUf.trim().toUpperCase();
    const cepNormalized = normalizeCepDigits(zip);

    if (!/\S+@\S+\.\S+/.test(emailTrimmed)) {
      setError("Informe um e-mail válido para contato.");
      return;
    }
    if (cepNormalized.length !== 8) {
      setError("Informe um CEP válido com 8 dígitos.");
      return;
    }
    if (!streetTrimmed) {
      setError("Informe o logradouro.");
      return;
    }
    if (!numberTrimmed) {
      setError("Informe o número.");
      return;
    }
    if (!neighborhoodTrimmed) {
      setError("Informe o bairro.");
      return;
    }
    if (!cityTrimmed) {
      setError("Informe a cidade.");
      return;
    }
    if (!/^[A-Z]{2}$/.test(uf)) {
      setError("Informe a UF com 2 letras (ex.: SP).");
      return;
    }

    if (subscriberType === "individual") {
      if (!fullName.trim()) {
        setError("Informe o nome do assinante pessoa física.");
        return;
      }
      if (!sex.trim()) {
        setError("Informe o sexo.");
        return;
      }
      if (!birthDate) {
        setError("Informe a data de nascimento.");
        return;
      }
      if (!identityNumber.trim()) {
        setError("Informe o número de identidade.");
        return;
      }
      if (normalizeDigitsOnly(cpf).length !== 11) {
        setError("Informe um CPF válido com 11 dígitos.");
        return;
      }
    } else {
      if (!corporateName.trim()) {
        setError("Informe a razão social.");
        return;
      }
      if (normalizeDigitsOnly(cnpj).length !== 14) {
        setError("Informe um CNPJ válido com 14 dígitos.");
        return;
      }
      if (!contactResponsible.trim()) {
        setError("Informe o responsável para contato.");
        return;
      }
    }

    setError(null);
    setOpen(false);
    setEmail("");
    resetAddressFields();
    resetPersonFields();
    resetCorporateFields();
    setSubscriberType("individual");

    toast.success("Assinatura registrada com sucesso!", {
      description:
        "Cadastro de assinante concluído para 12 edições anuais da EngeSoft.",
    });
    router.push("/dashboard");
  }

  if (!isGuest) return;
  
  return (
    <>
      <section
        className={cn(
          "w-full max-w-lg rounded-2xl border border-slate-200/90",
          "bg-white px-5 py-5 text-center shadow-sm ring-1 ring-slate-200/60 md:px-7 md:py-6",
          "max-h-55", className,
        )}
        aria-labelledby="subscriber-cta-heading"
      >
        <h2
          id="subscriber-cta-heading"
          className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl"
        >
          Seja um Assinante da EngeSoft
        </h2>
        <p className="mx-auto mt-2 max-w-md text-pretty text-sm leading-relaxed text-slate-800 md:text-base">
          Receba 12 edições por ano com assinatura anual. Disponível para
          pessoa física e assinante corporativo com preço padrão.
        </p>
        <Button
          type="button"
          className="mt-4 rounded-full bg-slate-800 px-5 py-1.5 text-sm font-medium text-slate-50 hover:bg-slate-900 md:text-base"
          onClick={() => setOpen(true)}
        >
          Realizar Cadastro de Assinante
        </Button>
      </section>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          className="bg-slate-100 flex max-h-[min(90dvh,52rem)] flex-col gap-0 overflow-hidden p-0 text-sm sm:max-w-md md:max-w-xl"
          showCloseButton
        >
          <DialogHeader className="shrink-0 gap-1.5 border-b border-border/60 px-4 pb-3 pt-4 pr-12">
            <DialogTitle className="text-xl font-semibold leading-tight">
              Cadastro de assinatura
            </DialogTitle>
            <DialogDescription className="text-base leading-snug">
              Preencha os dados para tornar-se assinante da EngeSoft por um
              período anual (12 edições).
            </DialogDescription>
          </DialogHeader>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-4 py-3 [scrollbar-gutter:stable]">
            <div className="mt-1 grid gap-3.5 pb-5">
              <div className="grid gap-1.5">
                <Label htmlFor="subscriber-type" className="text-xs sm:text-base">
                  Tipo de assinante
                </Label>
                <select
                  id="subscriber-type"
                  className="h-9 rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                  value={subscriberType}
                  onChange={(e) =>
                    setSubscriberType(e.target.value as SubscriberType)
                  }
                >
                  <option value="individual">Pessoa física</option>
                  <option value="corporate">Assinante corporativo</option>
                </select>
              </div>

              {subscriberType === "individual" ? (
                <fieldset className="grid gap-3 border-0 p-0">
                  <legend className="mb-0.5 text-xs font-medium text-slate-900 sm:text-base">
                    Dados da pessoa física
                  </legend>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="grid gap-1.5 sm:col-span-2">
                      <Label htmlFor="subscriber-full-name" className="text-xs sm:text-sm">
                        Nome completo
                      </Label>
                      <Input
                        id="subscriber-full-name"
                        className="h-9 text-sm"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="subscriber-sex" className="text-xs sm:text-sm">
                        Sexo
                      </Label>
                      <Input
                        id="subscriber-sex"
                        className="h-9 text-sm"
                        value={sex}
                        onChange={(e) => setSex(e.target.value)}
                        placeholder="Ex.: Feminino"
                      />
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="subscriber-birth-date" className="text-xs sm:text-sm">
                        Data de nascimento
                      </Label>
                      <Input
                        id="subscriber-birth-date"
                        type="date"
                        className="h-9 text-sm"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="subscriber-identity" className="text-xs sm:text-sm">
                        Identidade
                      </Label>
                      <Input
                        id="subscriber-identity"
                        className="h-9 text-sm"
                        value={identityNumber}
                        onChange={(e) => setIdentityNumber(e.target.value)}
                        placeholder="RG / documento"
                      />
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="subscriber-cpf" className="text-xs sm:text-sm">
                        CPF
                      </Label>
                      <Input
                        id="subscriber-cpf"
                        className="h-9 text-sm"
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        placeholder="000.000.000-00"
                        inputMode="numeric"
                      />
                    </div>
                  </div>
                </fieldset>
              ) : (
                <fieldset className="grid gap-3 border-0 p-0">
                  <legend className="mb-0.5 text-xs font-medium text-slate-900 sm:text-base">
                    Dados do assinante corporativo
                  </legend>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="grid gap-1.5 sm:col-span-2">
                      <Label htmlFor="subscriber-corporate-name" className="text-xs sm:text-sm">
                        Razão social
                      </Label>
                      <Input
                        id="subscriber-corporate-name"
                        className="h-9 text-sm"
                        value={corporateName}
                        onChange={(e) => setCorporateName(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="subscriber-cnpj" className="text-xs sm:text-sm">
                        CNPJ
                      </Label>
                      <Input
                        id="subscriber-cnpj"
                        className="h-9 text-sm"
                        value={cnpj}
                        onChange={(e) => setCnpj(e.target.value)}
                        placeholder="00.000.000/0000-00"
                        inputMode="numeric"
                      />
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="subscriber-contact-responsible" className="text-xs sm:text-sm">
                        Responsável para contato
                      </Label>
                      <Input
                        id="subscriber-contact-responsible"
                        className="h-9 text-sm"
                        value={contactResponsible}
                        onChange={(e) => setContactResponsible(e.target.value)}
                      />
                    </div>
                  </div>
                </fieldset>
              )}

              <fieldset className="mt-1 grid gap-3 border-0 p-0">
                <legend className="mb-0.5 text-xs font-medium text-slate-900 sm:text-base">
                  Contato e endereço de envio
                </legend>
                <div className="grid gap-1.5">
                  <Label htmlFor="subscriber-email" className="text-xs sm:text-sm">
                    E-mail
                  </Label>
                  <Input
                    id="subscriber-email"
                    type="email"
                    className="h-9 text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nome@dominio.com"
                    autoComplete="email"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-6 sm:items-start">
                  <div className="grid gap-1.5 sm:col-span-2">
                    <Label htmlFor="subscriber-cep" className="text-xs sm:text-sm">
                      CEP
                    </Label>
                    <Input
                      id="subscriber-cep"
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
                    <Label htmlFor="subscriber-street" className="text-xs sm:text-sm">
                      Logradouro
                    </Label>
                    <Input
                      id="subscriber-street"
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
                      <p className="text-xs text-amber-700 dark:text-amber-500">
                        {cepLookupError}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-6 sm:items-start">
                  <div className="grid gap-1.5 sm:col-span-2">
                    <Label htmlFor="subscriber-number" className="text-xs sm:text-sm">
                      Número
                    </Label>
                    <Input
                      id="subscriber-number"
                      className="h-9 text-sm"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      placeholder="Nº ou S/N"
                    />
                  </div>
                  <div className="grid gap-1.5 sm:col-span-4">
                    <Label htmlFor="subscriber-complement" className="text-xs sm:text-sm">
                      Complemento{" "}
                      <span className="font-normal text-muted-foreground">
                        (opcional)
                      </span>
                    </Label>
                    <Input
                      id="subscriber-complement"
                      className="h-9 text-sm"
                      value={complement}
                      onChange={(e) => setComplement(e.target.value)}
                      placeholder="Sala, bloco, andar ..."
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-6 sm:items-start">
                  <div className="grid gap-1.5 sm:col-span-2">
                    <Label htmlFor="subscriber-neighborhood" className="text-xs sm:text-sm">
                      Bairro
                    </Label>
                    <Input
                      id="subscriber-neighborhood"
                      className="h-9 text-sm"
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-1.5 sm:col-span-3">
                    <Label htmlFor="subscriber-city" className="text-xs sm:text-sm">
                      Cidade
                    </Label>
                    <Input
                      id="subscriber-city"
                      className="h-9 text-sm"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      autoComplete="address-level2"
                    />
                  </div>
                  <div className="grid gap-1.5 sm:col-span-1">
                    <Label htmlFor="subscriber-uf" className="text-xs sm:text-sm">
                      UF
                    </Label>
                    <Input
                      id="subscriber-uf"
                      className="h-9 text-sm uppercase"
                      value={stateUf}
                      onChange={(e) =>
                        setStateUf(e.target.value.slice(0, 2).toUpperCase())
                      }
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
              onClick={() => handleOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              size="lg"
              className="bg-slate-800 text-sm text-slate-50 hover:bg-slate-900"
              onClick={handleConfirm}
            >
              Confirmar assinatura
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
