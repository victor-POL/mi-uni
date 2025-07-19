"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Calendar, GraduationCap, Users, Clock } from "lucide-react"
import { AppLayout } from "@/components/AppLayout"

export default function HomePage() {
  // Datos de ejemplo para el dashboard
  const stats = [
    {
      title: "Planes de Estudio",
      value: "5",
      description: "Carreras disponibles",
      icon: BookOpen,
      color: "text-blue-600",
    },
    {
      title: "Materias Disponibles",
      value: "120+",
      description: "En oferta académica",
      icon: Calendar,
      color: "text-green-600",
    },
    {
      title: "Comisiones",
      value: "45",
      description: "Horarios disponibles",
      icon: Clock,
      color: "text-purple-600",
    },
    {
      title: "Modalidades",
      value: "3",
      description: "Presencial, Virtual, Híbrida",
      icon: Users,
      color: "text-orange-600",
    },
  ]

  const publicFeatures = [
    {
      title: "Planes de Estudio",
      description: "Consulta los planes de estudio disponibles y el estado de las materias",
      icon: GraduationCap,
      href: "/planes-estudio",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      title: "Oferta de Materias",
      description: "Explora las materias disponibles y sus comisiones por cuatrimestre",
      icon: Calendar,
      href: "/oferta-materias",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
  ]

  const privateFeatures = [
    {
      title: "Mis Carreras",
      description: "Gestiona tu progreso académico personal",
      icon: Users,
      color: "text-purple-600",
      requiresAuth: true,
    },
    {
      title: "Materias en Curso",
      description: "Consulta las materias que estás cursando actualmente",
      icon: BookOpen,
      color: "text-orange-600",
      requiresAuth: true,
    },
  ]

  return (
    <AppLayout title="MiUni" showBackButton={false}>
      {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title} className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <p className="text-sm text-gray-600">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Funcionalidades Públicas */}
          <div className="lg:col-span-2">
            <Card className="bg-white shadow-sm mb-6">
              <CardHeader>
                <CardTitle className="text-gray-900">Acceso Público</CardTitle>
                <CardDescription className="text-gray-600">
                  Estas funcionalidades están disponibles sin necesidad de iniciar sesión
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {publicFeatures.map((feature) => (
                    <Link key={feature.title} href={feature.href}>
                      <Card
                        className={`hover:shadow-md transition-shadow cursor-pointer ${feature.bgColor} ${feature.borderColor} border-2`}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-3">
                            <feature.icon className={`h-8 w-8 ${feature.color}`} />
                            <div>
                              <CardTitle className="text-base text-gray-900">{feature.title}</CardTitle>
                              <CardDescription className="text-sm text-gray-600 mt-1">
                                {feature.description}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Funcionalidades Privadas */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Funcionalidades Personales
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Inicia sesión para acceder a estas funcionalidades personalizadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {privateFeatures.map((feature) => (
                    <Card key={feature.title} className="bg-gray-50 border-gray-200 opacity-75">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <feature.icon className={`h-6 w-6 ${feature.color}`} />
                          <div>
                            <CardTitle className="text-base text-gray-700">{feature.title}</CardTitle>
                            <CardDescription className="text-sm text-gray-500 mt-1">
                              {feature.description}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="mt-3">
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                            Requiere iniciar sesión
                          </Badge>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Información del Sistema */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Información del Sistema</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">Consulta Libre</p>
                      <p className="text-sm text-blue-700">Planes y ofertas sin registro</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <Calendar className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">Actualizado</p>
                      <p className="text-sm text-green-700">Información académica 2024</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <Users className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-purple-900">Seguimiento Personal</p>
                      <p className="text-sm text-purple-700">Con cuenta registrada</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Acciones Rápidas */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/planes-estudio">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" size="sm">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Ver Planes de Estudio
                  </Button>
                </Link>
                <Link href="/oferta-materias">
                  <Button
                    variant="outline"
                    className="w-full bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    size="sm"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Ver Oferta de Materias
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Ayuda */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">¿Necesitas Ayuda?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>• Consulta planes de estudio sin registrarte</p>
                  <p>• Ve la oferta académica disponible</p>
                  <p>• Regístrate para seguimiento personal</p>
                  <p>• Contacta soporte técnico si tienes problemas</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
    </AppLayout>
  )
}
