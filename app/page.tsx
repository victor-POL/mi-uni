"use client"

import { AppLayout } from "@/components/AppLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { publicOperations, privateOperations } from "@/data/operations.data"

export default function HomePage() {
  const { user, isInitialized } = useAuth()

  return (
    <AppLayout title="Mi Universidad" showBackButton={false}>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Bienvenido a Mi Universidad</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tu plataforma integral para la gestión académica. Consulta planes de estudio, materias disponibles y
            gestiona tu progreso académico.
          </p>
        </div>

        {/* Public Operations */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Operaciones Públicas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {publicOperations.map((operation) => (
              <Card key={operation.href} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${operation.color}`}>
                      <operation.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle>{operation.title}</CardTitle>
                      <CardDescription>{operation.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Link href={operation.href}>
                    <Button className="w-full">Acceder</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Authentication Section */}
        {isInitialized && !user && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Accede a tu cuenta</h2>
            <Card>
              <CardHeader>
                <CardTitle>Inicia sesión para acceder a más funciones</CardTitle>
                <CardDescription>Gestiona tus carreras, consulta tu progreso académico y más.</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-4">
                <Link href="/login">
                  <Button variant="outline">Iniciar Sesión</Button>
                </Link>
                <Link href="/register">
                  <Button>Registrarse</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Private Operations - Only for authenticated users */}
        {isInitialized && user && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Mi Cuenta</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {privateOperations.map((operation) => (
                <Card key={operation.href} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${operation.color}`}>
                        <operation.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle>{operation.title}</CardTitle>
                        <CardDescription>{operation.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Link href={operation.href}>
                      <Button className="w-full">Acceder</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
