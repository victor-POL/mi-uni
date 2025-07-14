"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, LogOut, BookOpen, Clock, Calendar, MapPin } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

// Tipos de datos
interface Comision {
  codigo: string
  dias: string[]
  horarioInicio: string
  horarioFin: string
}

interface MateriaOferta {
  idMateria: number
  codigoMateria: string
  nombreMateria: string
  codigoOferta: string
  horasSemanales?: number
  comisiones: Comision[]
}

interface PlanDeEstudio {
  idPlan: number
  nombreCarrera: string
  anio: number
  materias: MateriaOferta[]
}

type EstadoMateria = "Pendiente" | "Cursando" | "En Final" | "Aprobada"

// Datos de ejemplo con oferta de materias
const planesOferta: PlanDeEstudio[] = [
  {
    idPlan: 1,
    nombreCarrera: "Ingeniería en Sistemas",
    anio: 2023,
    materias: [
      {
        idMateria: 1,
        codigoMateria: "MAT101",
        nombreMateria: "Matemática I",
        codigoOferta: "3321",
        horasSemanales: 6,
        comisiones: [
          {
            codigo: "01-1900",
            dias: ["Lunes"],
            horarioInicio: "19:00",
            horarioFin: "23:00",
          },
          {
            codigo: "02-1400",
            dias: ["Martes", "Jueves"],
            horarioInicio: "14:00",
            horarioFin: "18:00",
          },
          {
            codigo: "03-0800",
            dias: ["Miércoles", "Viernes"],
            horarioInicio: "08:00",
            horarioFin: "12:00",
          },
        ],
      },
      {
        idMateria: 2,
        codigoMateria: "PRG101",
        nombreMateria: "Programación I",
        codigoOferta: "3365",
        horasSemanales: 4,
        comisiones: [
          {
            codigo: "02-2900",
            dias: ["Lunes", "Martes"],
            horarioInicio: "19:00",
            horarioFin: "23:00",
          },
          {
            codigo: "01-4300",
            dias: ["Miércoles", "Jueves"],
            horarioInicio: "19:00",
            horarioFin: "23:00",
          },
        ],
      },
      {
        idMateria: 3,
        codigoMateria: "ING101",
        nombreMateria: "Introducción a la Ingeniería",
        codigoOferta: "3401",
        horasSemanales: 3,
        comisiones: [
          {
            codigo: "01-1000",
            dias: ["Viernes"],
            horarioInicio: "10:00",
            horarioFin: "13:00",
          },
          {
            codigo: "02-1600",
            dias: ["Sábado"],
            horarioInicio: "16:00",
            horarioFin: "19:00",
          },
        ],
      },
      {
        idMateria: 4,
        codigoMateria: "MAT102",
        nombreMateria: "Matemática II",
        codigoOferta: "3322",
        horasSemanales: 6,
        comisiones: [
          {
            codigo: "01-0800",
            dias: ["Lunes", "Miércoles"],
            horarioInicio: "08:00",
            horarioFin: "12:00",
          },
          {
            codigo: "02-1900",
            dias: ["Martes", "Jueves"],
            horarioInicio: "19:00",
            horarioFin: "23:00",
          },
        ],
      },
      {
        idMateria: 5,
        codigoMateria: "PRG102",
        nombreMateria: "Programación II",
        codigoOferta: "3366",
        horasSemanales: 6,
        comisiones: [
          {
            codigo: "01-1400",
            dias: ["Lunes", "Miércoles", "Viernes"],
            horarioInicio: "14:00",
            horarioFin: "16:00",
          },
          {
            codigo: "02-1900",
            dias: ["Martes", "Jueves"],
            horarioInicio: "19:00",
            horarioFin: "22:00",
          },
        ],
      },
      {
        idMateria: 6,
        codigoMateria: "FIS101",
        nombreMateria: "Física I",
        codigoOferta: "3501",
        horasSemanales: 8,
        comisiones: [
          {
            codigo: "01-0800",
            dias: ["Lunes", "Martes", "Miércoles", "Jueves"],
            horarioInicio: "08:00",
            horarioFin: "10:00",
          },
          {
            codigo: "02-1900",
            dias: ["Lunes", "Miércoles"],
            horarioInicio: "19:00",
            horarioFin: "23:00",
          },
        ],
      },
    ],
  },
  {
    idPlan: 2,
    nombreCarrera: "Licenciatura en Informática",
    anio: 2022,
    materias: [
      {
        idMateria: 101,
        codigoMateria: "MAT101",
        nombreMateria: "Matemática Discreta",
        codigoOferta: "4101",
        horasSemanales: 4,
        comisiones: [
          {
            codigo: "01-1000",
            dias: ["Martes", "Jueves"],
            horarioInicio: "10:00",
            horarioFin: "12:00",
          },
          {
            codigo: "02-1800",
            dias: ["Lunes", "Miércoles"],
            horarioInicio: "18:00",
            horarioFin: "20:00",
          },
        ],
      },
      {
        idMateria: 102,
        codigoMateria: "PRG101",
        nombreMateria: "Fundamentos de Programación",
        codigoOferta: "4201",
        horasSemanales: 6,
        comisiones: [
          {
            codigo: "01-1400",
            dias: ["Lunes", "Miércoles", "Viernes"],
            horarioInicio: "14:00",
            horarioFin: "16:00",
          },
        ],
      },
    ],
  },
]

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

  const formatearHorario = (comision: Comision) => {
    const diasTexto = comision.dias.join(", ")
    return `${diasTexto} de ${comision.horarioInicio} a ${comision.horarioFin}`
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
      const estadoMateria = estadosMateriasUsuario[materia.idMateria] || "Pendiente"

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
                          <span className="font-mono">Código: {materia.codigoOferta}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {materia.horasSemanales && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {materia.horasSemanales}h
                          </Badge>
                        )}
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
                          key={comision.codigo}
                          className="bg-gray-50 dark:bg-gray-800 border-l-4 border-l-blue-500"
                        >
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">
                                Comisión {comision.codigo}
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {comision.dias.length} día{comision.dias.length > 1 ? "s" : ""}
                              </Badge>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                              <MapPin className="h-3 w-3" />
                              <span>{formatearHorario(comision)}</span>
                            </div>

                            {/* Días individuales */}
                            <div className="flex flex-wrap gap-1 mt-2">
                              {comision.dias.map((dia) => (
                                <Badge key={dia} variant="secondary" className="text-xs">
                                  {dia}
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
