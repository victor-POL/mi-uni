"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import { useRedirectIfAuthenticated } from "@/components/ProtectedRoute"

export default function VerifyCodePage() {
  const [code, setCode] = useState("")
  const [email, setEmail] = useState("")
  const searchParams = useSearchParams()
  const router = useRouter()

  // Redirigir si ya está autenticado
  const { user, loading } = useRedirectIfAuthenticated()

  useEffect(() => {
    const emailParam = searchParams.get("email")
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [searchParams])

  // Mostrar carga mientras se verifica la autenticación O si el usuario está autenticado
  if (loading || user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {loading ? "Verificando autenticación..." : "Redirigiendo..."}
          </p>
        </div>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica para verificar el código
    console.log("Verify code:", { email, code })
    // Simular verificación exitosa
    router.push(`/reset-password?email=${encodeURIComponent(email)}&code=${code}`)
  }

  const handleResendCode = () => {
    // Aquí iría la lógica para reenviar el código
    console.log("Resend code to:", email)
    alert("Código reenviado")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/forgot-password">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <CardTitle className="text-2xl font-bold">Verificar Código</CardTitle>
          </div>
          <CardDescription>Ingresa el código de 6 dígitos que enviamos a {email}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Código de Verificación</Label>
              <Input
                id="code"
                type="text"
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Verificar Código
            </Button>
          </form>
          <div className="mt-4 text-center space-y-2">
            <Button variant="ghost" onClick={handleResendCode} className="text-sm">
              Reenviar código
            </Button>
            <div>
              <Link href="/login" className="text-sm text-blue-600 hover:underline">
                Volver al inicio de sesión
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
