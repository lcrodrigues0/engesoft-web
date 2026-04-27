"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { getBaseTypesLabel, getRolesLabel } from "@/types/user-role";
import { useEffect, useState } from "react";
import {
  AddressData,
  getCtaProfileStorage,
  ReviewerProfileData,
  SubscriberProfileData,
} from "@/lib/cta-profile-storage";
import {
  expertiseAreas,
  ExpertiseAreaId,
} from "@/lib/reviewers/reviewer-expertise-areas";
import { ApiError } from "@/lib/api";
import { getMyAuthorProfile } from "@/services/author.service";


function getInitials(name?: string) {
  if (!name) return "US";

  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "US"
  );
}

function formatZipCode(zipCode: string): string {
  if (zipCode.length !== 8) return zipCode;
  return `${zipCode.slice(0, 5)}-${zipCode.slice(5)}`;
}

function renderAddress(address: AddressData) {
  const complement = address.complement ? `, ${address.complement}` : "";
  return `${address.street}, ${address.number}${complement} - ${address.neighborhood}, ${address.city}/${address.stateUf} - CEP ${formatZipCode(address.zipCode)}`;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [authorData, setAuthorData] = useState<{ institutionName: string; address: AddressData } | null>(null);
  const [reviewerData, setReviewerData] = useState<ReviewerProfileData | null>(null);
  const [subscriberData, setSubscriberData] = useState<SubscriberProfileData | null>(null);

  useEffect(() => {
    let active = true;

    if (!user?.id) {
      setAuthorData(null);
      setReviewerData(null);
      setSubscriberData(null);
      return;
    }

    async function loadAuthorFromBackend() {
      try {
        const author = await getMyAuthorProfile();
        if (!active) return;
        setAuthorData({
          institutionName: author.institutionName,
          address: {
            street: author.street,
            number: author.number,
            complement: author.complement ?? undefined,
            neighborhood: author.neighborhood,
            city: author.city,
            stateUf: author.stateUf,
            zipCode: author.zipCode,
          },
        });
      } catch (error) {
        if (!active) return;
        if (error instanceof ApiError && error.status === 404) {
          setAuthorData(null);
          return;
        }
        setAuthorData(null);
      }
    }

    void loadAuthorFromBackend();

    const storage = getCtaProfileStorage(user.id);
    setReviewerData(storage.reviewer ?? null);
    setSubscriberData(storage.subscriber ?? null);

    return () => {
      active = false;
    };
  }, [user?.id]);

  const expertiseLabels = reviewerData
    ? reviewerData.expertiseAreasIds
        .filter((id): id is ExpertiseAreaId => id !== ExpertiseAreaId.Empty)
        .map((id) => expertiseAreas.find((area) => area.id === id)?.label ?? id)
    : [];
  const roleLabels = getRolesLabel(user?.roles);

  if (!user) {
    return (
      <div className="mx-auto flex w-full max-w-3xl p-3">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Meu Perfil</CardTitle>
            <CardDescription>
              Não foi possível carregar os dados do usuário.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl p-3">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarFallback className="bg-blue-500 text-base text-white">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>Meu Perfil</CardTitle>
            <CardDescription>
              Visualize suas informações cadastradas na plataforma.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border bg-white p-4">
            <p className="text-xs font-medium text-slate-500">Nome</p>
            <p className="text-sm font-semibold text-slate-900">{user.name}</p>
          </div>
          <div className="rounded-lg border bg-white p-4">
            <p className="text-xs font-medium text-slate-500">Email</p>
            <p className="text-sm font-semibold text-slate-900">{user.email}</p>
          </div>
          <div className="rounded-lg border bg-white p-4">
            <p className="text-xs font-medium text-slate-500">Perfil de acesso</p>
            <p className="text-sm font-semibold text-slate-900">
              {getBaseTypesLabel(user.baseType)}
            </p>
          </div>
          <div className="rounded-lg border bg-white p-4">
            <p className="text-xs font-medium text-slate-500">Funções no sistema</p>
            <ul className="mt-1 list-disc pl-4 text-sm font-semibold text-slate-900">
              {roleLabels.map((role) => (
                <li key={role}>{role}</li>
              ))}
            </ul>
          </div>

          {authorData && (
            <div className="rounded-lg border bg-white p-4 md:col-span-2">
              <p className="text-xs font-medium text-slate-500">Cadastro de autor</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                Instituição: {authorData.institutionName}
              </p>
              <p className="text-sm text-slate-700">
                Endereço: {renderAddress(authorData.address)}
              </p>
            </div>
          )}

          {reviewerData && (
            <div className="rounded-lg border bg-white p-4 md:col-span-2">
              <p className="text-xs font-medium text-slate-500">Cadastro de avaliador</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                Instituição: {reviewerData.institutionName}
              </p>
              <p className="text-sm text-slate-700">
                Endereço: {renderAddress(reviewerData.address)}
              </p>
              <p className="text-sm text-slate-700">
                Temas: {expertiseLabels.length > 0 ? expertiseLabels.join(", ") : "Não informado"}
              </p>
            </div>
          )}

          {subscriberData && (
            <div className="rounded-lg border bg-white p-4 md:col-span-2">
              <p className="text-xs font-medium text-slate-500">Cadastro de assinante</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                Tipo: {subscriberData.subscriberType === "individual" ? "Pessoa física" : "Corporativo"}
              </p>
              <p className="text-sm text-slate-700">Email: {subscriberData.email}</p>
              {subscriberData.subscriberType === "individual" ? (
                <p className="text-sm text-slate-700">
                  Titular: {subscriberData.fullName} | CPF: {subscriberData.cpf}
                </p>
              ) : (
                <p className="text-sm text-slate-700">
                  Razão social: {subscriberData.corporateName} | CNPJ: {subscriberData.cnpj}
                </p>
              )}
              <p className="text-sm text-slate-700">
                Endereço: {renderAddress(subscriberData.address)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
