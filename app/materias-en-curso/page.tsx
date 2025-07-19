"use client"

import { useState } from "react"
import { AppLayout } from "@/components/AppLayout"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Calendar, Clock, User, MapPin, Trophy, AlertCircle } from "lucide-react"
import { materiasEnCurso } from "@/data/materias-en-curso.data"

export default function MateriasEnCursoPage() {
  const [selectedMateria, setSelectedMateria] = useState(materiasEnCurso[0])

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case "En Curso":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "Finalizada":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "Abandonada":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  const calcularPromedio = (notas: any[]) => {
    const notasValidas = notas.filter((nota) => nota.calificacion !== null)
    if (notasValidas.length === 0) return null
    const suma = notasValidas.reduce((acc, nota) => acc + nota.calificacion, 0)
    return (suma / notasValidas.length).toFixed(1)
  }

  const calcularProgreso = (materia: any) => {
    const totalEvaluaciones = materia.evaluaciones.length
    const evaluacionesCompletadas = materia.evaluaciones.filter((ev: any) => ev.calificacion !== null).length
    return totalEvaluaciones > 0 ? (evaluacionesCompletadas / totalEvaluaciones) * 100 : 0
  }

  return (
    <ProtectedRoute>
      <AppLayout title="Materias en Curso">
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Materias en Curso</h1>
            <p className="text-gray-600">Consulta las materias que estás cursando actualmente</p>
          </div>

          {/* Materias Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materiasEnCurso.map((materia) => {
              const promedio = calcularPromedio(materia.evaluaciones)
              const progreso = calcularProgreso(materia)

              return (
                <Card
                  key={materia.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedMateria.id === materia.id ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => setSelectedMateria(materia)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-lg">{materia.nombre}</CardTitle>
                        <CardDescription>{materia.codigo}</CardDescription>
                      </div>
                      <Badge className={getEstadoBadgeColor(materia.estado)}>{materia.estado}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <p className="text-gray-600">Profesor</p>
                        <p className="font-medium">{materia.profesor}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-gray-600">Créditos</p>
                        <p className="font-medium">{materia.creditos}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progreso</span>
                        <span>{progreso.toFixed(0)}%</span>
                      </div>
                      <Progress value={progreso} className="h-2" />
                    </div>

                    {promedio && (
                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="text-sm text-gray-600">Promedio Actual</span>
                        <Badge variant="outline" className="font-semibold">
                          {promedio}
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Detailed View */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                {selectedMateria.nombre}
              </CardTitle>
              <CardDescription>Información detallada de la materia</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="general" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="evaluaciones">Evaluaciones</TabsTrigger>
                  <TabsTrigger value="asistencia">Asistencia</TabsTrigger>
                  <TabsTrigger value="cronograma">Cronograma</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Información de la Materia</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">Profesor:</span>
                          <span className="font-medium">{selectedMateria.profesor}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">Horario:</span>
                          <span className="font-medium">{selectedMateria.horario}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">Aula:</span>
                          <span className="font-medium">{selectedMateria.aula}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">Cuatrimestre:</span>
                          <span className="font-medium">{selectedMateria.cuatrimestre}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Estadísticas</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <Card>
                          <CardContent className="p-4">
                            <div className="text-center">
                              <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                              <p className="text-2xl font-bold">
                                {calcularPromedio(selectedMateria.evaluaciones) || "-"}
                              </p>
                              <p className="text-sm text-gray-600">Promedio</p>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <div className="text-center">
                              <BookOpen className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                              <p className="text-2xl font-bold">{selectedMateria.creditos}</p>
                              <p className="text-sm text-gray-600">Créditos</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="evaluaciones" className="space-y-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Evaluaciones</h3>
                    {selectedMateria.evaluaciones.map((evaluacion: any, index: number) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{evaluacion.tipo}</h4>
                            <Badge variant="outline">{evaluacion.fecha}</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Peso: {evaluacion.peso}%</span>
                            <div className="flex items-center gap-2">
                              {evaluacion.calificacion !== null ? (
                                <Badge className="bg-green-100 text-green-800">{evaluacion.calificacion}</Badge>
                              ) : (
                                <Badge variant="outline" className="text-gray-500">
                                  Pendiente
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="asistencia" className="space-y-4">
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Control de Asistencia</h3>
                    <p className="text-gray-500">Esta funcionalidad estará disponible próximamente</p>
                  </div>
                </TabsContent>

                <TabsContent value="cronograma" className="space-y-4">
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Cronograma de Clases</h3>
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
