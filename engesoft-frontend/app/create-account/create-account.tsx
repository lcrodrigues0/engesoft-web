"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

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
import { Checkbox } from "@/components/ui/checkbox"

import Image from "next/image"

// ----------------------
// Schema
// ----------------------

const schema = z
  .object({
    role: z.enum(["autor", "avaliador", "editor"]),
    name: z.string().min(3, "Nome obrigatório"),
    email: z.email("Email inválido"),
    institution: z.string().min(2, "Instituição obrigatória"),
    password: z.string().min(6, "Mínimo 6 caracteres"),
    confirmPassword: z.string(),
    isMainAuthor: z.boolean().optional(),
    expertise: z.string().optional(),
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
  const [role, setRole] = useState<"autor" | "avaliador" | "editor">("autor")

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      role: "autor",
    },
  })

  function onSubmit(data: FormData) {
    console.log(data)
    // Aqui você conecta com seu backend
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
      
      {/* LEFT SIDE */}
      <div className="hidden md:flex relative bg-gradient-to-br from-slate-900 to-slate-700">
        <Image
          src="/images/auth/login-bg.png"
          alt="Background"
          fill
          className="object-cover opacity-20"
        />

        <div className="relative z-10 p-10 text-white flex flex-col justify-center">
          <h1 className="text-3xl font-bold">EngeSoft Manager</h1>
          <p className="mt-4 text-slate-300">
            Plataforma para submissão e avaliação de artigos científicos
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          
          <CardHeader>
            <CardTitle>Criar conta</CardTitle>
            <CardDescription>
              Cadastre-se para acessar o sistema
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">

            {/* ROLE */}
            <Tabs
              defaultValue="autor"
              onValueChange={(value) => {
                setRole(value as any)
                setValue("role", value as any)
              }}
            >
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="autor">Autor</TabsTrigger>
                <TabsTrigger value="avaliador">Avaliador</TabsTrigger>
                <TabsTrigger value="editor">Editor</TabsTrigger>
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

            {/* INSTITUTION */}
            <div>
              <Label>Instituição</Label>
              <Input {...register("institution")} />
              {errors.institution && (
                <p className="text-red-500 text-sm">
                  {errors.institution.message}
                </p>
              )}
            </div>

            {/* CONDITIONAL FIELDS */}

            {role === "autor" && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  onCheckedChange={(checked) =>
                    setValue("isMainAuthor", !!checked)
                  }
                />
                <Label>Sou autor principal (contato)</Label>
              </div>
            )}

            {role === "avaliador" && (
              <div>
                <Label>Áreas de interesse</Label>
                <Input
                  placeholder="Ex: Qualidade de Software, IA..."
                  {...register("expertise")}
                />
              </div>
            )}

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
              className="w-full"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Criando..." : "Criar conta"}
            </Button>

          </CardContent>

          <CardFooter className="flex flex-col gap-2">
            <Button variant="link">Já tenho conta</Button>
          </CardFooter>

        </Card>
      </div>
    </div>
  )
}