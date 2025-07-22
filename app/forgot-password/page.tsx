"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import { resetPassword } from '@/lib/firebase/auth'
import { useRedirectIfAuthenticated } from "@/components/ProtectedRoute"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Redirigir si ya está autenticado
  const { user, loading } = useRedirectIfAuthenticated()

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setError('Por favor, ingresa tu email')
      return
    }

    try {
      setIsLoading(true)
      setError('')
      
      await resetPassword(email)
      setSuccess(true)
    } catch (error) {
      console.error('Error al enviar email de recuperación:', error)
      
      let errorMessage = 'Error al enviar el email de recuperación'
      if (error instanceof Error) {
        if (error.message.includes('user-not-found')) {
          errorMessage = 'No existe una cuenta con este email'
        } else if (error.message.includes('invalid-email')) {
          errorMessage = 'Email no válido'
        }
      }
      
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/login">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <CardTitle className="text-2xl font-bold">Recuperar Contraseña</CardTitle>
          </div>
          <CardDescription>Ingresa tu email y te enviaremos un código de verificación</CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="text-center space-y-4">
              <div className="p-4 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
                <p className="font-semibold">Email enviado correctamente</p>
                <p>Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.</p>
              </div>
              <Button 
                onClick={() => setSuccess(false)} 
                variant="outline" 
                className="w-full"
              >
                Enviar otro email
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              
              {/* Mensaje de error */}
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {error}
                </div>
              )}
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    Enviando...
                  </>
                ) : (
                  'Enviar Código'
                )}
              </Button>
            </form>
          )}
          <div className="mt-4 text-center">
            <Link href="/login" className="text-sm text-blue-600 hover:underline">
              Volver al inicio de sesión
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
