'use client'

import { AppLayout } from '@/components/AppLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { publicOperations, privateOperations } from '@/data/operations.data'

export default function HomePage() {
  const { pageUser, isUserInitialized } = useAuth()

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
        {isUserInitialized && !pageUser && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Inicia sesión para acceder a más funciones</h2>
            <p className="text-gray-600">
              Gestiona tus carreras, consulta tu progreso académico y más.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {privateOperations.map((operation) => (
                <Card key={operation.href} className="opacity-60 cursor-not-allowed">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${operation.color} opacity-75`}>
                        <operation.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-gray-600">{operation.title}</CardTitle>
                        <CardDescription className="text-gray-500">{operation.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button disabled className="w-full">
                      Requiere cuenta
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Private Operations - Loading state, authenticated users, or nothing */}
        {(() => {
          if (!isUserInitialized) {
            // Placeholder mientras se verifica la autenticación
            return (
              <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="animate-pulse">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gray-200 h-10 w-10"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-full"></div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-10 bg-gray-200 rounded w-full"></div>
                    </CardContent>
                  </Card>
                  <Card className="animate-pulse">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gray-200 h-10 w-10"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-full"></div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-10 bg-gray-200 rounded w-full"></div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )
          }

          if (pageUser) {
            // Operaciones privadas para usuarios autenticados
            return (
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
            )
          }

          return null
        })()}
      </div>
    </AppLayout>
  )
}
