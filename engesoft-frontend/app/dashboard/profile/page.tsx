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
import { getBaseTypesLabel } from "@/types/user-role";


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

export default function ProfilePage() {
  const { user } = useAuth();

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
        </CardContent>
      </Card>
    </div>
  );
}
