"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, LogOut, BookOpen, Clock, Calendar } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { EstadoMateria, PlanDeEstudio, planesOferta } from "@/app/oferta-materias/data"

// Simulamos estados de materias del usuario
const estadosMateriasUsuario: { [key: number]: EstadoMateria } = {
  1: "Aprobada",
  2: "Cursando",
  3: "Pendiente",
  4: "En Final",
  5: "Pendiente",
  6: "Pendiente",
  101: "Aprobada",
  102: "Pendiente",
}

export default function OfertaMateriasPage() {
  const [selectedPlanId, setSelectedPlanId] = useState<string>("")
  const [planConsultado, setPlanConsultado] = useState<PlanDeEstudio | null>(null)
  const [filtroEstado, setFiltroEstado] = useState<string>("todos")

  const handleConsultar = () => {
    if (selectedPlanId) {
      const plan = planesOferta.find((p) => p.idPlan.toString() === selectedPlanId)
      setPlanConsultado(plan || null)
    }
  }

  const handleLogout = () => {
    window.location.href = "/"
  }

  const getEstadoBadge = (estado: EstadoMateria) => {
    const colors = {
      Pendiente: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
      Cursando: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      "En Final": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      Aprobada: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    }

    return <Badge className={colors[estado]}>{estado}</Badge>
  }

  const getFiltrosMaterias = () => {
    if (!planConsultado) return []

    return planConsultado.materias.filter((materia) => {
      const estadoMateria = "Pendiente"

      // Filtro por estado
      if (filtroEstado !== "todos" && estadoMateria !== filtroEstado) {
        return false
      }

      return true
    })
  }

  const materiasFiltradas = getFiltrosMaterias()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/materias">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Oferta de Materias</h1>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2 bg-transparent">
                <LogOut className="h-4 w-4" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Selector de Plan */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Consultar Oferta Académica</CardTitle>
            <CardDescription>
              Selecciona un plan de estudio para ver las materias y comisiones disponibles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1 max-w-md">
                <label
                  htmlFor="plan-select"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Plan de Estudio
                </label>
                <Select value={selectedPlanId} onValueChange={setSelectedPlanId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un plan de estudio" />
                  </SelectTrigger>
                  <SelectContent>
                    {planesOferta.map((plan) => (
                      <SelectItem key={plan.idPlan} value={plan.idPlan.toString()}>
                        {plan.nombreCarrera} ({plan.anio})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleConsultar} disabled={!selectedPlanId} className="px-8">
                Consultar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Filtros */}
        {planConsultado && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Filtros por Estado</CardTitle>
              <CardDescription>Filtra las materias según tu progreso académico</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Estado de la Materia
                  </label>
                  <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todas las materias</SelectItem>
                      <SelectItem value="Pendiente">Solo Pendientes</SelectItem>
                      <SelectItem value="Cursando">Solo Cursando</SelectItem>
                      <SelectItem value="En Final">Solo En Final</SelectItem>
                      <SelectItem value="Aprobada">Solo Aprobadas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button variant="outline" onClick={() => setFiltroEstado("todos")} className="w-full">
                    Limpiar Filtros
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Información del Plan */}
        {planConsultado && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl">{planConsultado.nombreCarrera}</CardTitle>
              <CardDescription className="text-lg">
                Plan de Estudio {planConsultado.anio} - Oferta Académica Disponible
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {/* Contador de resultados */}
        {planConsultado && (
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Mostrando {materiasFiltradas.length} de {planConsultado.materias.length} materias
          </div>
        )}

        {/* Lista de Materias con Oferta */}
        {planConsultado && (
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {materiasFiltradas.map((materia) => {
              const estadoMateria = estadosMateriasUsuario[materia.idMateria] || "Pendiente"
              return (
                <Card key={materia.idMateria} className="relative">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">{materia.nombreMateria}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-mono">{materia.codigoMateria}</span>
                          <span>•</span>
                          <span className="font-mono">Código: {materia.codigoMateria}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getEstadoBadge(estadoMateria)}
                      </div>
                    </div>

                    {/* Botón Ver Detalles */}
                    <Link href={`/materias/${materia.codigoMateria}`}>
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Ver Detalles de la Materia
                      </Button>
                    </Link>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Comisiones Disponibles
                      </h4>

                      {materia.comisiones.map((comision) => (
                        <Card
                          key={comision.comisionNombre}
                          className="bg-gray-50 dark:bg-gray-800 border-l-4 border-l-blue-500"
                        >
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">
                                Comisión {comision.comisionNombre}
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {comision.diasYHorarios.length} día{comision.diasYHorarios.length > 1 ? "s" : ""}
                              </Badge>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                              {comision.diasYHorarios.map((dia) => (
                                <span key={dia.dia} className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {`${dia.dia} ${dia.horario}`}
                                </span>
                              ))}
                            </div>

                            {/* Días individuales */}
                            <div className="flex flex-wrap gap-1 mt-2">
                              {comision.diasYHorarios.map((dia) => (
                                <Badge key={dia.dia} variant="secondary" className="text-xs">
                                  {dia.dia}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Estado inicial */}
        {!planConsultado && (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Selecciona un Plan de Estudio</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Elige un plan de estudio para ver la oferta académica disponible con horarios y comisiones.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Sin resultados */}
        {planConsultado && materiasFiltradas.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No hay materias disponibles</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No se encontraron materias que coincidan con los filtros seleccionados.
              </p>
              <Button variant="outline" onClick={() => setFiltroEstado("todos")}>
                Limpiar Filtros
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
