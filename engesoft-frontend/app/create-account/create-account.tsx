"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation";
import { register as registerAccount } from "@/services/auth.service";
import { ApiError } from "@/lib/api";
import { USER_BASE_TYPES, type UserBaseTypes } from "@/types/user-role";
import { toast } from "sonner"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

import Image from "next/image"

// ----------------------
// Schema
// ----------------------

const schema = z
  .object({
    baseType: z.enum(USER_BASE_TYPES),
    name: z.string().min(3, "Nome obrigatório"),
    email: z.email("Email inválido"),
    password: z.string().min(6, "Mínimo 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não coincidem",
    path: ["confirmPassword"],
  })

type FormData = z.infer<typeof schema>

// ----------------------
// Page
// ----------------------

export default function RegisterPage() {
  const [baseType, setBaseType] = useState<UserBaseTypes>(USER_BASE_TYPES[0])

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,

  } = useForm<FormData>({

    resolver: zodResolver(schema),
    defaultValues: {
      baseType: USER_BASE_TYPES[0],
    },
  })

  async function onSubmit(data: FormData) {
    try {
      await registerAccount({
        name: data.name,
        email: data.email,
        password: data.password,
        baseType: data.baseType
      });

      toast.success("Cadastro realizado com sucesso!", {
        description: "Faça login para acessar o sistema."
      })
      router.replace("/login"); 

    } catch (err: unknown) {
      if (err instanceof ApiError && err.status === 409) {
        toast.error("Erro ao realizar cadastro", {
          description: err.message,
        });
        return;
      }

      const fallback =
        err instanceof ApiError
          ? err.message
          : "Caso o erro persista, entre em contato com a equipe de desenvolvedores.";

      toast.error("Erro ao realizar cadastro. Tente novamente", {
        description: fallback
      });
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
      
       {/* Lado esquerdo */}
       <div className="hidden md:flex md:items-center md:justify-end relative bg-linear-to-br from-zinc-950 to-zinc-900">

        <Image
          src="/images/auth/login-bg.png"
          alt="Background"
          fill
          className="object-cover opacity-20"
        />

        <div className="relative z-10 p-10 text-white">
          <h1 className="text-5xl font-bold">EngeSoft</h1>
          <p className="mt-4 text-2xl text-gray-400">
            Sistema de gestão de artigos científicos
          </p>
        </div>
      </div>

      {/* Lado direito */}
      <div className="flex items-center justify-center p-6 bg-linear-to-br from-slate-300 to-slate-100">
        <Card className="w-full max-w-sm">
          
          <CardHeader>
            <CardTitle>Criar conta</CardTitle>
            <CardDescription>
              Cadastre-se para acessar o sistema
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">

            {/* BASE TYPE */}
            <Tabs
              value={baseType}
              onValueChange={(value) => {
                const next = value as UserBaseTypes;
                setBaseType(next);
                setValue("baseType", next);
              }}
            >
              <TabsList className="grid grid-cols-2">
                <TabsTrigger
                  value={USER_BASE_TYPES[0]}
                  className="data-[state=active]:bg-slate-600 data-[state=active]:text-white"
                >
                  Visitante
                </TabsTrigger>
                <TabsTrigger
                  value={USER_BASE_TYPES[1]}
                  className="data-[state=active]:bg-slate-600 data-[state=active]:text-white"
                >
                  Colaborador
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* NAME */}
            <div>
              <Label>Nome completo</Label>
              <Input {...register("name")} />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <Label>Email</Label>
              <Input type="email" {...register("email")} />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <Label>Senha</Label>
              <Input type="password" {...register("password")} />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <Label>Confirmar senha</Label>
              <Input type="password" {...register("confirmPassword")} />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* SUBMIT */}
            <Button
              className="w-full bg-slate-700"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Criando..." : "Criar conta"}
            </Button>

          </CardContent>

          <CardFooter className="flex flex-col gap-2">
            <Button variant="link" onClick={() => router.push("/login")}>Já tenho conta</Button>
          </CardFooter>

        </Card>
      </div>
    </div>
  )
}