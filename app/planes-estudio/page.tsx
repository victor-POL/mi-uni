"use client"

import { useState, useMemo } from "react"
import { AppLayout } from "@/components/AppLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Search, GraduationCap, Clock, BookOpen, Users } from "lucide-react"
import { planesDeEstudio } from "@/data/planes-estudio.data"

export default function PlanesEstudioPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFacultad, setSelectedFacultad] = useState("all")
  const [selectedModalidad, setSelectedModalidad] = useState("all")

  // Get unique values for filters
  const facultades = useMemo(() => {
    const uniqueFacultades = [...new Set(planesDeEstudio.map((plan) => plan.facultad))]
    return uniqueFacultades.sort()
  }, [])

  const modalidades = useMemo(() => {
    const uniqueModalidades = [...new Set(planesDeEstudio.map((plan) => plan.modalidad))]
    return uniqueModalidades.sort()
  }, [])

  // Filter plans based on search and filters
  const filteredPlanes = useMemo(() => {
    return planesDeEstudio.filter((plan) => {
      const matchesSearch =
        plan.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.facultad.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesFacultad = selectedFacultad === "all" || plan.facultad === selectedFacultad
      const matchesModalidad = selectedModalidad === "all" || plan.modalidad === selectedModalidad

      return matchesSearch && matchesFacultad && matchesModalidad
    })
  }, [searchTerm, selectedFacultad, selectedModalidad])

  const getBadgeColor = (estado: string) => {
    switch (estado) {
      case "Activo":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "En Revisión":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case "Suspendido":
        return "bg-red-100 text-red-800 hover:bg-red-200"
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
      case "Semipresencial":
        return "bg-orange-100 text-orange-800 hover:bg-orange-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  return (
    <AppLayout title="Planes de Estudio">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Planes de Estudio</h1>
          <p className="text-gray-600">Explora los diferentes planes de estudio disponibles en la universidad</p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Filtros de Búsqueda
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Buscar</label>
                <Input
                  placeholder="Buscar por nombre, código o facultad..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Facultad</label>
                <Select value={selectedFacultad} onValueChange={setSelectedFacultad}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las facultades" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las facultades</SelectItem>
                    {facultades.map((facultad) => (
                      <SelectItem key={facultad} value={facultad}>
                        {facultad}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Modalidad</label>
                <Select value={selectedModalidad} onValueChange={setSelectedModalidad}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las modalidades" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las modalidades</SelectItem>
                    {modalidades.map((modalidad) => (
                      <SelectItem key={modalidad} value={modalidad}>
                        {modalidad}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Resultados ({filteredPlanes.length})</h2>
          </div>

          {filteredPlanes.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron planes de estudio</h3>
                <p className="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {filteredPlanes.map((plan) => (
                <Card key={plan.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-xl">{plan.nombre}</CardTitle>
                          <Badge variant="outline">{plan.codigo}</Badge>
                        </div>
                        <CardDescription className="text-base">{plan.facultad}</CardDescription>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge className={getBadgeColor(plan.estado)}>{plan.estado}</Badge>
                        <Badge className={getModalidadColor(plan.modalidad)}>{plan.modalidad}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600">{plan.descripcion}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{plan.duracionAnios} años</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <BookOpen className="h-4 w-4" />
                        <span>{plan.totalMaterias} materias</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>{plan.creditos} créditos</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Resolución:</span> {plan.resolucion}
                      </div>
                    </div>

                    <Accordion type="single" collapsible>
                      <AccordionItem value="materias">
                        <AccordionTrigger>Ver Materias del Plan ({plan.materias.length})</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3">
                            {Object.entries(
                              plan.materias.reduce(
                                (acc, materia) => {
                                  if (!acc[materia.anio]) acc[materia.anio] = []
                                  acc[materia.anio].push(materia)
                                  return acc
                                },
                                {} as Record<number, typeof plan.materias>,
                              ),
                            ).map(([anio, materias]) => (
                              <div key={anio} className="space-y-2">
                                <h4 className="font-medium text-gray-900">{anio}° Año</h4>
                                <div className="grid gap-2">
                                  {materias.map((materia) => (
                                    <div
                                      key={materia.codigo}
                                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                    >
                                      <div>
                                        <span className="font-medium">{materia.nombre}</span>
                                        <span className="text-sm text-gray-500 ml-2">({materia.codigo})</span>
                                      </div>
                                      <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <span>{materia.cuatrimestre}° Cuatrimestre</span>
                                        <Badge variant="outline" className="text-xs">
                                          {materia.creditos} créditos
                                        </Badge>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
