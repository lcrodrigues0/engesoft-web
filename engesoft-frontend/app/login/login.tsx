import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"

export function LoginPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
  
      {/* Lado esquerdo */}
      <div className="hidden md:flex md:items-center md:justify-end relative bg-linear-to-br from-zinc-950 to-zinc-900">

        <Image
          src="/images/login-bg.png"
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
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Entre para acessar o sistema
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input type="email" placeholder="seu@email.com" />
            </div>

            <div>
              <Label>Senha</Label>
              <Input type="password" />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox />
              <Label>Lembrar de mim</Label>
            </div>

            <Button className="w-full bg-slate-700">Entrar</Button>
          </CardContent>

          <CardFooter className="flex flex-col gap-2">
            <Button variant="link">Criar conta</Button>
            <Button variant="link">Esqueci minha senha</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
