"use client"

import { useState } from "react"
import { AppLayout } from "@/components/AppLayout"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GraduationCap, BookOpen, Trophy, Clock, Plus } from "lucide-react"

// Mock data - En una aplicación real, esto vendría de una API
const misCarreras = [
  {
    id: 1,
    nombre: "Ingeniería en Sistemas",
    codigo: "IS-2020",
    estado: "En Curso",
    progreso: 65,
    materiasAprobadas: 26,
    materiasTotal: 40,
    creditosObtenidos: 156,
    creditosTotal: 240,
    promedioGeneral: 8.5,
    añoIngreso: 2021,
    añoEstimadoEgreso: 2026,
  },
  {
    id: 2,
    nombre: "Licenciatura en Administración",
    codigo: "LA-2019",
    estado: "Completada",
    progreso: 100,
    materiasAprobadas: 35,
    materiasTotal: 35,
    creditosObtenidos: 210,
    creditosTotal: 210,
    promedioGeneral: 7.8,
    añoIngreso: 2019,
    añoEstimadoEgreso: 2023,
  },
]

const materiasEnCurso = [
  {
    codigo: "SIS301",
    nombre: "Bases de Datos Avanzadas",
    creditos: 6,
    profesor: "Dr. María González",
    horario: "Lun/Mié 14:00-16:00",
    parcial1: 8.5,
    parcial2: null,
    final: null,
  },
  {
    codigo: "SIS302",
    nombre: "Ingeniería de Software II",
    creditos: 8,
    profesor: "Ing. Carlos Rodríguez",
    horario: "Mar/Jue 16:00-18:00",
    parcial1: 7.0,
    parcial2: 8.0,
    final: null,
  },
]

export default function MisCarrerasPage() {
  const [selectedCarrera, setSelectedCarrera] = useState(misCarreras[0])

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case "En Curso":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "Completada":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "Suspendida":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  return (
    <ProtectedRoute>
      <AppLayout title="Mis Carreras">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">Mis Carreras</h1>
              <p className="text-gray-600">Gestiona tus carreras y seguimiento académico</p>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Agregar Carrera
            </Button>
          </div>

          {/* Carreras Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {misCarreras.map((carrera) => (
              <Card
                key={carrera.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedCarrera.id === carrera.id ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => setSelectedCarrera(carrera)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-xl">{carrera.nombre}</CardTitle>
                      <CardDescription>{carrera.codigo}</CardDescription>
                    </div>
                    <Badge className={getEstadoBadgeColor(carrera.estado)}>{carrera.estado}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progreso General</span>
                      <span>{carrera.progreso}%</span>
                    </div>
                    <Progress value={carrera.progreso} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <p className="text-gray-600">Materias</p>
                      <p className="font-medium">
                        {carrera.materiasAprobadas}/{carrera.materiasTotal}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-gray-600">Promedio</p>
                      <p className="font-medium">{carrera.promedioGeneral}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detailed View */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                {selectedCarrera.nombre}
              </CardTitle>
              <CardDescription>Información detallada de tu carrera</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="resumen" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="resumen">Resumen</TabsTrigger>
                  <TabsTrigger value="materias">Materias en Curso</TabsTrigger>
                  <TabsTrigger value="historial">Historial Académico</TabsTrigger>
                </TabsList>

                <TabsContent value="resumen" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <BookOpen className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold">{selectedCarrera.materiasAprobadas}</p>
                            <p className="text-sm text-gray-600">Materias Aprobadas</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <Trophy className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold">{selectedCarrera.promedioGeneral}</p>
                            <p className="text-sm text-gray-600">Promedio General</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <Clock className="h-6 w-6 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold">{selectedCarrera.añoEstimadoEgreso}</p>
                            <p className="text-sm text-gray-600">Año Est. Egreso</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Progreso Detallado</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Materias Completadas</span>
                          <span>
                            {selectedCarrera.materiasAprobadas}/{selectedCarrera.materiasTotal}
                          </span>
                        </div>
                        <Progress
                          value={(selectedCarrera.materiasAprobadas / selectedCarrera.materiasTotal) * 100}
                          className="h-2"
                        />
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Créditos Obtenidos</span>
                          <span>
                            {selectedCarrera.creditosObtenidos}/{selectedCarrera.creditosTotal}
                          </span>
                        </div>
                        <Progress
                          value={(selectedCarrera.creditosObtenidos / selectedCarrera.creditosTotal) * 100}
                          className="h-2"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="materias" className="space-y-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Materias en Curso</h3>
                    {materiasEnCurso.map((materia) => (
                      <Card key={materia.codigo}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="font-semibold text-lg">{materia.nombre}</h4>
                              <p className="text-gray-600">
                                {materia.codigo} - {materia.creditos} créditos
                              </p>
                              <p className="text-sm text-gray-500">{materia.profesor}</p>
                            </div>
                            <Badge variant="outline">{materia.horario}</Badge>
                          </div>

                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="space-y-1">
                              <p className="text-sm text-gray-600">Parcial 1</p>
                              <p className="text-lg font-semibold">{materia.parcial1 || "-"}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-600">Parcial 2</p>
                              <p className="text-lg font-semibold">{materia.parcial2 || "-"}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-600">Final</p>
                              <p className="text-lg font-semibold">{materia.final || "-"}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="historial" className="space-y-4">
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Historial Académico</h3>
                    <p className="text-gray-500">Esta funcionalidad estará disponible próximamente</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    </ProtectedRoute>
  )
}
