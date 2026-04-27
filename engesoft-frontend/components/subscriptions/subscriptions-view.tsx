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
  formatSubscriptionDate,
  type Subscription,
} from "@/lib/subscriptions/subscriptions";
import {
  BookOpen,
  CalendarDays,
  Check,
  ChevronRight,
  CircleAlert,
  Clock3,
  CreditCard,
  Download,
  Mail,
  MapPin,
  PenLine,
  RotateCw,
  Tag,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type SubscriptionsViewProps = {
  subscriptions: Subscription[];
  onChange: (next: Subscription[]) => void;
};

export function SubscriptionsView({ subscriptions, onChange }: SubscriptionsViewProps) {
  const [editAddressOpen, setEditAddressOpen] = useState(false);
  const [editAddress, setEditAddress] = useState("");

  const current = useMemo(
    () =>
      [...subscriptions].sort(
        (a, b) =>
          new Date(b.validUntil).getTime() - new Date(a.validUntil).getTime(),
      )[0] ?? null,
    [subscriptions],
  );

  useEffect(() => {
    if (current) setEditAddress(current.shippingAddress);
  }, [current]);

  function updateSubscription(id: string, updater: (s: Subscription) => Subscription) {
    onChange(subscriptions.map((s) => (s.id === id ? updater(s) : s)));
  }

  function renewSubscription() {
    if (!current) return;
    const base = new Date(current.validUntil);
    const nextEnd = new Date(base);
    nextEnd.setFullYear(nextEnd.getFullYear() + 1);
    updateSubscription(current.id, (subscription) => ({
      ...subscription,
      status: "active",
      validUntil: nextEnd.toISOString(),
      remainingEditions: 12,
    }));
    toast.success("Assinatura renovada", {
      description: `${current.id} renovada por mais 12 edições.`,
    });
  }

  function saveAddress() {
    if (!current) return;
    const addr = editAddress.trim();
    if (!addr) {
      toast.error("Endereço inválido", {
        description: "Informe um endereço de envio válido.",
      });
      return;
    }
    updateSubscription(current.id, (subscription) => ({
      ...subscription,
      shippingAddress: addr,
    }));
    setEditAddressOpen(false);
    toast.success("Endereço atualizado");
  }

  function emitAction(label: string, description: string) {
    toast.success("Assinatura pausada", {
      description: `${label}: ${description}`,
    });
  }

  function dateText(iso: string) {
    return new Intl.DateTimeFormat("pt-BR", {
      timeZone: "UTC",
    }).format(new Date(iso));
  }

  if (!current) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600">
        Nenhuma assinatura encontrada.
      </section>
    );
  }

  const planTitle = "Anual";
  const editionsText = "12 edições por ano";
  const renewalDiscount = "15%";
  const nextEdition = "Julho/2025";
  const nextEditionDate = "15/07/2025";
  const paymentRows = [
    { date: "10/07/2024", description: "Renovação Anual", value: "R$ 299,00", discount: "10%", total: "R$ 269,10" },
    { date: "10/07/2023", description: "Renovação Anual", value: "R$ 299,00", discount: "5%", total: "R$ 284,05" },
    { date: "10/07/2022", description: "Assinatura Anual", value: "R$ 299,00", discount: "0%", total: "R$ 299,00" },
  ];
  const timeline = [
    { label: "Assinatura ativa", date: `${dateText(current.startedAt)} - ${dateText(current.validUntil)}`, type: "check" as const },
    { label: "Aviso de renovação enviado", date: "10/04/2025", type: "mail" as const },
    { label: "Lembrete de renovação enviado", date: "10/05/2025", type: "mail" as const },
    { label: "Lembrete de renovação enviado", date: "10/06/2025", type: "mail" as const },
    { label: "Vencimento da assinatura", date: dateText(current.validUntil), type: "clock" as const },
  ];

  return (
    <>
      <div className="space-y-4">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Minha Assinatura</h1>
        </header>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Resumo da Assinatura</h2>
          <p className="mt-1 text-sm text-slate-600">
            Acompanhe seu plano, renovações e pagamentos.
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-slate-600">
                <CalendarDays className="size-4" />
                <span className="text-xs font-medium">Plano Atual</span>
              </div>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{planTitle}</p>
              <p className="text-sm text-slate-600">{editionsText}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-slate-600">
                <Check className="size-4 text-emerald-600" />
                <span className="text-xs font-medium">Status</span>
              </div>
              <span className="mt-2 inline-flex rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
                Ativa
              </span>
              <p className="mt-2 text-xs text-slate-500">Próximo vencimento</p>
              <p className="text-lg font-semibold text-slate-900">
                {formatSubscriptionDate(current.validUntil)}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-slate-600">
                <Tag className="size-4 text-violet-600" />
                <span className="text-xs font-medium">Desconto de Renovação</span>
              </div>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{renewalDiscount}</p>
              <p className="text-sm text-slate-600">Há 3 anos consecutivos</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-slate-600">
                <BookOpen className="size-4 text-amber-600" />
                <span className="text-xs font-medium">Próxima Edição</span>
              </div>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{nextEdition}</p>
              <p className="text-sm text-slate-600">Envio previsto: {nextEditionDate}</p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[2fr_1fr]">
          <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Informações da Assinatura</h3>
            <div className="mt-4 grid gap-5 lg:grid-cols-2">
              <dl className="space-y-3 text-sm">
                <div className="grid grid-cols-[10rem_1fr] gap-3">
                  <dt className="text-slate-500">Tipo de Assinante</dt>
                  <dd className="font-medium text-slate-900">Pessoa Fisica</dd>
                </div>
                <div className="grid grid-cols-[10rem_1fr] gap-3">
                  <dt className="text-slate-500">Plano</dt>
                  <dd className="font-medium text-slate-900">Anual (12 edicoes)</dd>
                </div>
                <div className="grid grid-cols-[10rem_1fr] gap-3">
                  <dt className="text-slate-500">Data de Inicio</dt>
                  <dd className="font-medium text-slate-900">{dateText(current.startedAt)}</dd>
                </div>
                <div className="grid grid-cols-[10rem_1fr] gap-3">
                  <dt className="text-slate-500">Proximo Vencimento</dt>
                  <dd className="font-medium text-slate-900">{dateText(current.validUntil)}</dd>
                </div>
                <div className="grid grid-cols-[10rem_1fr] gap-3">
                  <dt className="text-slate-500">Renovações Consecutivas</dt>
                  <dd className="font-medium text-slate-900">3 anos</dd>
                </div>
                <div className="grid grid-cols-[10rem_1fr] gap-3">
                  <dt className="text-slate-500">Forma de Pagamento</dt>
                  <dd className="font-medium text-slate-900">Visa **** 4242</dd>
                </div>
              </dl>
              <div>
                <p className="mb-3 font-medium text-slate-900">Linha do Tempo da Renovacao</p>
                <ol className="space-y-3">
                  {timeline.map((item, index) => (
                    <li key={`${item.label}-${index}`} className="flex items-start gap-3 text-sm">
                      <span className="mt-0.5 inline-flex size-6 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                        {item.type === "check" ? (
                          <Check className="size-3.5 text-emerald-600" />
                        ) : item.type === "mail" ? (
                          <Mail className="size-3.5 text-blue-600" />
                        ) : (
                          <Clock3 className="size-3.5 text-amber-600" />
                        )}
                      </span>
                      <span>
                        <span className="block font-medium text-slate-900">{item.label}</span>
                        <span className="block text-slate-500">{item.date}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </article>

          <aside className="space-y-4">
            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Ações Rápidas</h3>
              <div className="mt-3 space-y-2">
                <button
                  type="button"
                  onClick={renewSubscription}
                  className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-left hover:bg-slate-50"
                >
                  <span>
                    <span className="block text-sm font-medium text-slate-900">Renovar Assinatura</span>
                    <span className="block text-xs text-slate-500">
                      Renove agora e mantenha seu desconto
                    </span>
                  </span>
                  <ChevronRight className="size-4 text-slate-500" />
                </button>
                <button
                  type="button"
                  onClick={() => emitAction("Dados cadastrais", "Dados atualizados com sucesso.")}
                  className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-left hover:bg-slate-50"
                >
                  <span className="block">
                    <span className="block text-sm font-medium text-slate-900">Atualizar Dados Cadastrais</span>
                    <span className="block text-xs text-slate-500">
                      Revise suas informações pessoais
                    </span>
                  </span>
                  <ChevronRight className="size-4 text-slate-500" />
                </button>
                <button
                  type="button"
                  onClick={() => emitAction("Forma de pagamento", "Cartao alterado com sucesso.")}
                  className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-left hover:bg-slate-50"
                >
                  <span className="block">
                    <span className="block text-sm font-medium text-slate-900">Alterar Forma de Pagamento</span>
                    <span className="block text-xs text-slate-500">Atualize seu cartao de credito</span>
                  </span>
                  <ChevronRight className="size-4 text-slate-500" />
                </button>
                <button
                  type="button"
                  onClick={() => setEditAddressOpen(true)}
                  className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-left hover:bg-slate-50"
                >
                  <span className="block">
                    <span className="block text-sm font-medium text-slate-900">Alterar Endereco de Entrega</span>
                    <span className="block text-xs text-slate-500">Atualize o endereco para envio</span>
                  </span>
                  <ChevronRight className="size-4 text-slate-500" />
                </button>
                <button
                  type="button"
                  onClick={() => emitAction("Certificado", "Arquivo gerado e pronto para download.")}
                  className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-left hover:bg-slate-50"
                >
                  <span className="block">
                    <span className="block text-sm font-medium text-slate-900">Baixar Certificado de Assinatura</span>
                    <span className="block text-xs text-slate-500">
                      Documento com validade anual
                    </span>
                  </span>
                  <ChevronRight className="size-4 text-slate-500" />
                </button>
              </div>
            </article>

            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Endereco de Entrega</h3>
                <Button type="button" size="sm" variant="outline" onClick={() => setEditAddressOpen(true)}>
                  <PenLine className="mr-2 size-3.5" />
                  Editar
                </Button>
              </div>
              <div className="space-y-1 text-sm text-slate-700">
                <p className="font-semibold text-slate-900">{current.subscriberName}</p>
                <p>{current.shippingAddress}</p>
                <p className="pt-2 text-xs text-slate-500">Recebe em: residencial</p>
              </div>
              <div className="mt-3 flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                <MapPin className="mt-0.5 size-3.5 shrink-0 text-slate-500" />
                <p>As edicoes sao enviadas pelos Correios com codigo de rastreamento.</p>
              </div>
            </article>
          </aside>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Historico de Pagamentos</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                  <th className="py-2 pr-4 font-medium">Data</th>
                  <th className="py-2 pr-4 font-medium">Descricao</th>
                  <th className="py-2 pr-4 font-medium">Valor</th>
                  <th className="py-2 pr-4 font-medium">Desconto</th>
                  <th className="py-2 pr-4 font-medium">Total</th>
                  <th className="py-2 pr-4 font-medium">Forma de Pagamento</th>
                  <th className="py-2 pr-4 font-medium">Status</th>
                  <th className="py-2 font-medium">Comprovante</th>
                </tr>
              </thead>
              <tbody>
                {paymentRows.map((row) => (
                  <tr key={row.date} className="border-b border-slate-100">
                    <td className="py-3 pr-4 text-slate-600">{row.date}</td>
                    <td className="py-3 pr-4 text-slate-900">{row.description}</td>
                    <td className="py-3 pr-4 text-slate-600">{row.value}</td>
                    <td className="py-3 pr-4 text-slate-600">{row.discount}</td>
                    <td className="py-3 pr-4 text-slate-900">{row.total}</td>
                    <td className="py-3 pr-4 text-slate-600">Visa **** 4242</td>
                    <td className="py-3 pr-4">
                      <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
                        Pago
                      </span>
                    </td>
                    <td className="py-3 text-slate-500">
                      <button
                        type="button"
                        className="rounded-md border border-slate-200 p-1 hover:bg-slate-50"
                        onClick={() => emitAction("Comprovante", "Download iniciado.")}
                      >
                        <Download className="size-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900"
            onClick={() => emitAction("Pagamentos", "Lista completa exibida.")}
          >
            Ver todos os pagamentos
            <RotateCw className="size-3.5" />
          </button>
        </section>
      </div>

      <Dialog open={editAddressOpen} onOpenChange={setEditAddressOpen}>
        <DialogContent
          className="max-w-md"
          showCloseButton
        >
          <DialogHeader>
            <DialogTitle>Alterar endereco de entrega</DialogTitle>
            <DialogDescription>
              Informe o novo endereco para envio das proximas edicoes.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Label htmlFor="shipping-address">Endereco</Label>
            <Input
              id="shipping-address"
              value={editAddress}
              onChange={(e) => setEditAddress(e.target.value)}
            />
            <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
              <p className="flex items-center gap-2">
                <CircleAlert className="size-3.5 text-amber-600" />
                O prazo de atualizacao pode levar ate 24 horas.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setEditAddressOpen(false)}>
                Cancelar
              </Button>
              <Button type="button" onClick={saveAddress}>
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
