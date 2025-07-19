"use client"
import { useParams } from "next/navigation"
import { AppLayout } from "@/components/AppLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { BookOpen, User, Clock, MapPin, Calendar, Users, FileText, AlertCircle } from "lucide-react"
import { detallesMaterias } from "@/data/detalles-materias.data"

export default function MateriaDetallePage() {
  const params = useParams()
  const codigo = params.codigo as string

  const materia = detallesMaterias.find((m) => m.codigo === codigo)

  if (!materia) {
    return (
      <AppLayout title="Materia no encontrada" backHref="/">
        <div className="text-center py-12">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Materia no encontrada</h2>
          <p className="text-gray-600 mb-6">No se pudo encontrar información para el código: {codigo}</p>
          <Button onClick={() => window.history.back()}>Volver</Button>
        </div>
      </AppLayout>
    )
  }

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case "Disponible":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "Inscripción Abierta":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "Cupo Completo":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      case "Próximamente":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  const getModalidadColor = (modalidad: string) => {
    switch (modalidad) {
      case "Presencial":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "Virtual":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200"
      case "Híbrida":
        return "bg-orange-100 text-orange-800 hover:bg-orange-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  return (
    <AppLayout title={materia.nombre} backHref="/">
      <div className="space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-2xl">{materia.nombre}</CardTitle>
                  <Badge variant="outline">{materia.codigo}</Badge>
                </div>
                <CardDescription className="text-base">{materia.descripcion}</CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge className={getEstadoBadgeColor(materia.estado)}>{materia.estado}</Badge>
                <Badge className={getModalidadColor(materia.modalidad)}>{materia.modalidad}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{materia.profesor}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{materia.horario}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{materia.aula}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>{materia.cuatrimestre}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Information */}
        <Tabs defaultValue="informacion" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="informacion">Información</TabsTrigger>
            <TabsTrigger value="contenido">Contenido</TabsTrigger>
            <TabsTrigger value="evaluacion">Evaluación</TabsTrigger>
            <TabsTrigger value="recursos">Recursos</TabsTrigger>
          </TabsList>

          <TabsContent value="informacion" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Información General
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Créditos:</span>
                      <p className="font-medium">{materia.creditos}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Duración:</span>
                      <p className="font-medium">{materia.duracion}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Departamento:</span>
                      <p className="font-medium">{materia.departamento}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Facultad:</span>
                      <p className="font-medium">{materia.facultad}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Cupos y Disponibilidad
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Cupos Totales:</span>
                      <p className="font-medium">{materia.cuposTotal}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Cupos Disponibles:</span>
                      <p className="font-medium text-green-600">{materia.cuposDisponibles}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Lista de Espera:</span>
                      <p className="font-medium">{materia.listaEspera}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button className="w-full" disabled={materia.cuposDisponibles === 0}>
                      {materia.cuposDisponibles > 0 ? "Inscribirse" : "Sin Cupos"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {materia.prerequisitos && materia.prerequisitos.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Prerequisitos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {materia.prerequisitos.map((prereq, index) => (
                      <Badge key={index} variant="outline">
                        {prereq}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="contenido" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Programa de la Materia</CardTitle>
                <CardDescription>Contenidos y temas que se abordarán durante el curso</CardDescription>
              </CardHeader>
              <CardContent>
                {materia.programa ? (
                  <Accordion type="single" collapsible className="w-full">
                    {materia.programa.map((unidad, index) => (
                      <AccordionItem key={index} value={`unidad-${index}`}>
                        <AccordionTrigger>
                          Unidad {index + 1}: {unidad.titulo}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3">
                            <p className="text-gray-600">{unidad.descripcion}</p>
                            {unidad.temas && (
                              <div>
                                <h5 className="font-medium mb-2">Temas:</h5>
                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                                  {unidad.temas.map((tema, temaIndex) => (
                                    <li key={temaIndex}>{tema}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">El programa de la materia no está disponible en este momento</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="evaluacion" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sistema de Evaluación</CardTitle>
                <CardDescription>Criterios y métodos de evaluación de la materia</CardDescription>
              </CardHeader>
              <CardContent>
                {materia.evaluacion ? (
                  <div className="space-y-4">
                    {materia.evaluacion.map((evaluation, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{evaluation.tipo}</h4>
                          <Badge variant="outline">{evaluation.porcentaje}%</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{evaluation.descripcion}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">La información de evaluación no está disponible en este momento</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recursos" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recursos y Bibliografía</CardTitle>
                <CardDescription>Material de estudio y referencias bibliográficas</CardDescription>
              </CardHeader>
              <CardContent>
                {materia.bibliografia ? (
                  <div className="space-y-6">
                    {materia.bibliografia.obligatoria && (
                      <div>
                        <h4 className="font-medium mb-3">Bibliografía Obligatoria</h4>
                        <ul className="space-y-2">
                          {materia.bibliografia.obligatoria.map((libro, index) => (
                            <li key={index} className="p-3 bg-blue-50 rounded-lg">
                              <p className="font-medium">{libro.titulo}</p>
                              <p className="text-sm text-gray-600">{libro.autor}</p>
                              {libro.editorial && <p className="text-xs text-gray-500">{libro.editorial}</p>}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {materia.bibliografia.complementaria && (
                      <div>
                        <h4 className="font-medium mb-3">Bibliografía Complementaria</h4>
                        <ul className="space-y-2">
                          {materia.bibliografia.complementaria.map((libro, index) => (
                            <li key={index} className="p-3 bg-gray-50 rounded-lg">
                              <p className="font-medium">{libro.titulo}</p>
                              <p className="text-sm text-gray-600">{libro.autor}</p>
                              {libro.editorial && <p className="text-xs text-gray-500">{libro.editorial}</p>}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">La bibliografía no está disponible en este momento</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
