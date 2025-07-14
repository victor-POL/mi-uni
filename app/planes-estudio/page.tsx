"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, LogOut, BookOpen, Clock, Users } from "lucide-react"

// Tipos de datos
interface MateriaPlanEstudio {
  idMateria: number
  codigoMateria: string
  nombreMateria: string
  anioCursada: number
  cuatrimestreCursada: number
  listaCorrelativas: number[]
  horasSemanales?: number
}

interface PlanDeEstudio {
  idPlan: number
  nombreCarrera: string
  anio: number
  materias: MateriaPlanEstudio[]
}

// Datos de ejemplo
const planesDeEstudio: PlanDeEstudio[] = [
  {
    idPlan: 1,
    nombreCarrera: "Ingeniería en Sistemas",
    anio: 2023,
    materias: [
      // Primer Año
      {
        idMateria: 1,
        codigoMateria: "MAT101",
        nombreMateria: "Matemática I",
        anioCursada: 1,
        cuatrimestreCursada: 1,
        listaCorrelativas: [],
        horasSemanales: 6,
      },
      {
        idMateria: 2,
        codigoMateria: "PRG101",
        nombreMateria: "Programación I",
        anioCursada: 1,
        cuatrimestreCursada: 1,
        listaCorrelativas: [],
        horasSemanales: 4,
      },
      {
        idMateria: 3,
        codigoMateria: "ING101",
        nombreMateria: "Introducción a la Ingeniería",
        anioCursada: 1,
        cuatrimestreCursada: 1,
        listaCorrelativas: [],
        horasSemanales: 3,
      },
      {
        idMateria: 4,
        codigoMateria: "MAT102",
        nombreMateria: "Matemática II",
        anioCursada: 1,
        cuatrimestreCursada: 2,
        listaCorrelativas: [1],
        horasSemanales: 6,
      },
      {
        idMateria: 5,
        codigoMateria: "PRG102",
        nombreMateria: "Programación II",
        anioCursada: 1,
        cuatrimestreCursada: 2,
        listaCorrelativas: [2],
        horasSemanales: 6,
      },
      {
        idMateria: 6,
        codigoMateria: "FIS101",
        nombreMateria: "Física I",
        anioCursada: 1,
        cuatrimestreCursada: 2,
        listaCorrelativas: [1],
        horasSemanales: 8,
      },
      // Segundo Año
      {
        idMateria: 7,
        codigoMateria: "MAT201",
        nombreMateria: "Matemática III",
        anioCursada: 2,
        cuatrimestreCursada: 1,
        listaCorrelativas: [4],
        horasSemanales: 6,
      },
      {
        idMateria: 8,
        codigoMateria: "EST201",
        nombreMateria: "Estructuras de Datos",
        anioCursada: 2,
        cuatrimestreCursada: 1,
        listaCorrelativas: [5],
        horasSemanales: 6,
      },
      {
        idMateria: 9,
        codigoMateria: "FIS201",
        nombreMateria: "Física II",
        anioCursada: 2,
        cuatrimestreCursada: 1,
        listaCorrelativas: [6, 4],
        horasSemanales: 8,
      },
      {
        idMateria: 10,
        codigoMateria: "MAT202",
        nombreMateria: "Matemática IV",
        anioCursada: 2,
        cuatrimestreCursada: 2,
        listaCorrelativas: [7],
        horasSemanales: 6,
      },
      {
        idMateria: 11,
        codigoMateria: "ALG201",
        nombreMateria: "Algoritmos y Complejidad",
        anioCursada: 2,
        cuatrimestreCursada: 2,
        listaCorrelativas: [8],
        horasSemanales: 6,
      },
      {
        idMateria: 12,
        codigoMateria: "ARQ201",
        nombreMateria: "Arquitectura de Computadoras",
        anioCursada: 2,
        cuatrimestreCursada: 2,
        listaCorrelativas: [5],
        horasSemanales: 6,
      },
      // Tercer Año
      {
        idMateria: 13,
        codigoMateria: "BD301",
        nombreMateria: "Base de Datos",
        anioCursada: 3,
        cuatrimestreCursada: 1,
        listaCorrelativas: [11],
        horasSemanales: 6,
      },
      {
        idMateria: 14,
        codigoMateria: "SO301",
        nombreMateria: "Sistemas Operativos",
        anioCursada: 3,
        cuatrimestreCursada: 1,
        listaCorrelativas: [12],
        horasSemanales: 6,
      },
      {
        idMateria: 15,
        codigoMateria: "RED301",
        nombreMateria: "Redes de Computadoras",
        anioCursada: 3,
        cuatrimestreCursada: 2,
        listaCorrelativas: [14],
        horasSemanales: 6,
      },
    ],
  },
  {
    idPlan: 2,
    nombreCarrera: "Licenciatura en Informática",
    anio: 2022,
    materias: [
      // Primer Año
      {
        idMateria: 101,
        codigoMateria: "MAT101",
        nombreMateria: "Matemática Discreta",
        anioCursada: 1,
        cuatrimestreCursada: 1,
        listaCorrelativas: [],
        horasSemanales: 4,
      },
      {
        idMateria: 102,
        codigoMateria: "PRG101",
        nombreMateria: "Fundamentos de Programación",
        anioCursada: 1,
        cuatrimestreCursada: 1,
        listaCorrelativas: [],
        horasSemanales: 6,
      },
      {
        idMateria: 103,
        codigoMateria: "LOG101",
        nombreMateria: "Lógica y Algoritmos",
        anioCursada: 1,
        cuatrimestreCursada: 2,
        listaCorrelativas: [101, 102],
        horasSemanales: 4,
      },
      {
        idMateria: 104,
        codigoMateria: "EST101",
        nombreMateria: "Estadística",
        anioCursada: 1,
        cuatrimestreCursada: 2,
        listaCorrelativas: [101],
        horasSemanales: 4,
      },
      // Segundo Año
      {
        idMateria: 105,
        codigoMateria: "PRG201",
        nombreMateria: "Programación Orientada a Objetos",
        anioCursada: 2,
        cuatrimestreCursada: 1,
        listaCorrelativas: [103],
        horasSemanales: 6,
      },
      {
        idMateria: 106,
        codigoMateria: "BD201",
        nombreMateria: "Introducción a Bases de Datos",
        anioCursada: 2,
        cuatrimestreCursada: 2,
        listaCorrelativas: [105],
        horasSemanales: 6,
      },
    ],
  },
  {
    idPlan: 3,
    nombreCarrera: "Ingeniería Industrial",
    anio: 2023,
    materias: [
      // Primer Año
      {
        idMateria: 201,
        codigoMateria: "MAT101",
        nombreMateria: "Análisis Matemático I",
        anioCursada: 1,
        cuatrimestreCursada: 1,
        listaCorrelativas: [],
        horasSemanales: 6,
      },
      {
        idMateria: 202,
        codigoMateria: "FIS101",
        nombreMateria: "Física I",
        anioCursada: 1,
        cuatrimestreCursada: 1,
        listaCorrelativas: [],
        horasSemanales: 6,
      },
      {
        idMateria: 203,
        codigoMateria: "QUI101",
        nombreMateria: "Química General",
        anioCursada: 1,
        cuatrimestreCursada: 2,
        listaCorrelativas: [],
        horasSemanales: 6,
      },
      {
        idMateria: 204,
        codigoMateria: "MAT102",
        nombreMateria: "Análisis Matemático II",
        anioCursada: 1,
        cuatrimestreCursada: 2,
        listaCorrelativas: [201],
        horasSemanales: 6,
      },
    ],
  },
]

export default function PlanesEstudioPage() {
  const [selectedPlanId, setSelectedPlanId] = useState<string>("")
  const [planConsultado, setPlanConsultado] = useState<PlanDeEstudio | null>(null)
  const [materiaResaltada, setMateriaResaltada] = useState<number | null>(null)

  const handleConsultar = () => {
    if (selectedPlanId) {
      const plan = planesDeEstudio.find((p) => p.idPlan.toString() === selectedPlanId)
      setPlanConsultado(plan || null)
    }
  }

  const handleLogout = () => {
    window.location.href = "/"
  }

  // Función para obtener el nombre de la materia por ID
  const getNombreMateriaById = (id: number): string => {
    if (!planConsultado) return ""
    const materia = planConsultado.materias.find((m) => m.idMateria === id)
    return materia ? `${materia.codigoMateria} - ${materia.nombreMateria}` : `ID: ${id}`
  }

  // Función para agrupar materias por año y cuatrimestre
  const agruparMaterias = (materias: MateriaPlanEstudio[]) => {
    const agrupadas: { [anio: number]: { [cuatrimestre: number]: MateriaPlanEstudio[] } } = {}

    materias.forEach((materia) => {
      if (!agrupadas[materia.anioCursada]) {
        agrupadas[materia.anioCursada] = {}
      }
      if (!agrupadas[materia.anioCursada][materia.cuatrimestreCursada]) {
        agrupadas[materia.anioCursada][materia.cuatrimestreCursada] = []
      }
      agrupadas[materia.anioCursada][materia.cuatrimestreCursada].push(materia)
    })

    return agrupadas
  }

  const materiasAgrupadas = planConsultado ? agruparMaterias(planConsultado.materias) : {}

  const navegarACorrelativa = (idMateria: number) => {
    setMateriaResaltada(idMateria)
    const element = document.getElementById(`materia-${idMateria}`)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" })
      setTimeout(() => setMateriaResaltada(null), 3000)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/materias">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Planes de Estudio</h1>
            </div>
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2 bg-transparent">
              <LogOut className="h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Selector de Plan */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Consultar Plan de Estudio</CardTitle>
            <CardDescription>Selecciona un plan de estudio para ver su estructura completa</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1 max-w-md">
                <label htmlFor="plan-select" className="block text-sm font-medium text-gray-700 mb-2">
                  Plan de Estudio
                </label>
                <Select value={selectedPlanId} onValueChange={setSelectedPlanId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un plan de estudio" />
                  </SelectTrigger>
                  <SelectContent>
                    {planesDeEstudio.map((plan) => (
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

        {/* Resultado del Plan */}
        {planConsultado && (
          <div className="space-y-6">
            {/* Información del Plan */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{planConsultado.nombreCarrera}</CardTitle>
                <CardDescription className="text-lg">
                  Plan de Estudio {planConsultado.anio} - ID: {planConsultado.idPlan}
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Materias por Año y Cuatrimestre */}
            {Object.keys(materiasAgrupadas)
              .map(Number)
              .sort((a, b) => a - b)
              .map((anio) => (
                <div key={anio} className="space-y-4">
                  {/* Título del Año */}
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-1 bg-blue-600 rounded"></div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {anio === 1 ? "Primer" : anio === 2 ? "Segundo" : anio === 3 ? "Tercer" : `${anio}°`} Año
                    </h2>
                  </div>

                  {/* Cuatrimestres del Año */}
                  {Object.keys(materiasAgrupadas[anio])
                    .map(Number)
                    .sort((a, b) => a - b)
                    .map((cuatrimestre) => (
                      <Card key={`${anio}-${cuatrimestre}`} className="ml-4">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <div className="h-6 w-1 bg-green-500 rounded"></div>
                            {cuatrimestre === 1 ? "Primer" : "Segundo"} Cuatrimestre
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {materiasAgrupadas[anio][cuatrimestre].map((materia) => (
                              <Card
                                key={materia.idMateria}
                                id={`materia-${materia.idMateria}`}
                                className={`border-l-4 border-l-blue-200 transition-all duration-500 ${
                                  materiaResaltada === materia.idMateria
                                    ? "ring-2 ring-blue-500 shadow-lg bg-blue-50"
                                    : ""
                                }`}
                              >
                                <CardHeader className="pb-3">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <CardTitle className="text-base">{materia.nombreMateria}</CardTitle>
                                      <CardDescription className="font-mono text-sm">
                                        {materia.codigoMateria}
                                      </CardDescription>
                                    </div>
                                    {materia.horasSemanales && (
                                      <Badge variant="secondary" className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {materia.horasSemanales}h
                                      </Badge>
                                    )}
                                  </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                  {/* Correlativas */}
                                  {materia.listaCorrelativas.length > 0 && (
                                    <div>
                                      <h4 className="text-sm font-medium text-gray-700 mb-2">Correlativas:</h4>
                                      <div className="space-y-1">
                                        {materia.listaCorrelativas.map((correlativaId) => (
                                          <Button
                                            key={correlativaId}
                                            variant="outline"
                                            size="sm"
                                            onClick={() => navegarACorrelativa(correlativaId)}
                                            className="text-xs bg-gray-100 hover:bg-blue-100 px-2 py-1 h-auto"
                                          >
                                            {getNombreMateriaById(correlativaId)}
                                          </Button>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  {materia.listaCorrelativas.length === 0 && (
                                    <div className="text-xs text-gray-500 italic">Sin correlativas</div>
                                  )}

                                  {/* Botón Ver Detalles */}
                                  <Link href={`/materias/${materia.codigoMateria}`} className="block mt-3">
                                    <Button variant="outline" size="sm" className="w-full text-xs bg-transparent">
                                      <BookOpen className="h-3 w-3 mr-1" />
                                      Ver Detalles
                                    </Button>
                                  </Link>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ))}

            {/* Estadísticas del Plan */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Estadísticas del Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{planConsultado.materias.length}</div>
                    <div className="text-sm text-gray-600">Total Materias</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {planConsultado.materias.reduce((sum, m) => sum + (m.horasSemanales || 0), 0)}
                    </div>
                    <div className="text-sm text-gray-600">Horas Totales</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.max(...planConsultado.materias.map((m) => m.anioCursada))}
                    </div>
                    <div className="text-sm text-gray-600">Años de Duración</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">
                      {planConsultado.materias.filter((m) => m.listaCorrelativas.length === 0).length}
                    </div>
                    <div className="text-sm text-gray-600">Sin Correlativas</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Estado inicial */}
        {!planConsultado && (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Selecciona un Plan de Estudio</h3>
              <p className="text-gray-600">
                Elige un plan de estudio del selector de arriba y haz clic en "Consultar" para ver su estructura
                completa.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
