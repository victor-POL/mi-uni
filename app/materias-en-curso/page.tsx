"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, LogOut, BookOpen, Clock, Edit, Check, AlertCircle, Plus, GraduationCap } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

// Tipos de datos (reutilizando los mismos)
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

type EstadoMateria = "Pendiente" | "Cursando" | "En Final" | "Aprobada"
type TipoNota = "Por Promocion" | "Por Final"

interface MateriaEnCurso {
  idMateria: number
  codigoMateria: string
  nombreMateria: string
  horasSemanales?: number
  anioCursando: number
  cuatrimestreCursando: number
  estado: EstadoMateria
  nota?: number
  tipoNota?: TipoNota
  anioAprobacion?: number
  cuatrimestreAprobacion?: number
  turnoExamen?: string
}

// Datos de ejemplo
const planesDeEstudio: PlanDeEstudio[] = [
  {
    idPlan: 1,
    nombreCarrera: "Ingeniería en Sistemas",
    anio: 2023,
    materias: [
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
    ],
  },
]

const turnosExamen = ["Febrero", "Marzo", "Julio", "Agosto", "Octubre", "Diciembre"]

export default function MateriasEnCursoPage() {
  const [selectedPlanId, setSelectedPlanId] = useState<string>("")
  const [planConsultado, setPlanConsultado] = useState<PlanDeEstudio | null>(null)
  const [materiasEnCurso, setMateriasEnCurso] = useState<MateriaEnCurso[]>([])
  const [dialogEditarAbierto, setDialogEditarAbierto] = useState(false)
  const [dialogAgregarAbierto, setDialogAgregarAbierto] = useState(false)
  const [materiaEditando, setMateriaEditando] = useState<number | null>(null)
  const [formData, setFormData] = useState<Partial<MateriaEnCurso>>({})

  const handleConsultar = () => {
    if (selectedPlanId) {
      const plan = planesDeEstudio.find((p) => p.idPlan.toString() === selectedPlanId)
      setPlanConsultado(plan || null)
      // Inicializar con algunas materias de ejemplo en curso
      if (plan) {
        const materiasEjemplo: MateriaEnCurso[] = [
          {
            idMateria: 1,
            codigoMateria: "MAT101",
            nombreMateria: "Matemática I",
            horasSemanales: 6,
            anioCursando: 2024,
            cuatrimestreCursando: 1,
            estado: "Cursando",
          },
          {
            idMateria: 2,
            codigoMateria: "PRG101",
            nombreMateria: "Programación I",
            horasSemanales: 4,
            anioCursando: 2024,
            cuatrimestreCursando: 1,
            estado: "Cursando",
          },
          {
            idMateria: 4,
            codigoMateria: "MAT102",
            nombreMateria: "Matemática II",
            horasSemanales: 6,
            anioCursando: 2024,
            cuatrimestreCursando: 2,
            estado: "En Final",
          },
        ]
        setMateriasEnCurso(materiasEjemplo)
      }
    }
  }

  const handleLogout = () => {
    window.location.href = "/"
  }

  const handleEditarMateria = (idMateria: number) => {
    const materia = materiasEnCurso.find((m) => m.idMateria === idMateria)
    if (materia) {
      setMateriaEditando(idMateria)
      setFormData(materia)
      setDialogEditarAbierto(true)
    }
  }

  const handleGuardarMateria = () => {
    if (materiaEditando && formData) {
      setMateriasEnCurso(
        materiasEnCurso.map((materia) =>
          materia.idMateria === materiaEditando
            ? {
                ...materia,
                estado: formData.estado || "Cursando",
                nota: formData.nota,
                tipoNota: formData.tipoNota,
                anioCursando: formData.anioCursando || materia.anioCursando,
                cuatrimestreCursando: formData.cuatrimestreCursando || materia.cuatrimestreCursando,
                anioAprobacion: formData.anioAprobacion,
                cuatrimestreAprobacion: formData.cuatrimestreAprobacion,
                turnoExamen: formData.turnoExamen,
              }
            : materia,
        ),
      )
      setDialogEditarAbierto(false)
      setMateriaEditando(null)
      setFormData({})
    }
  }

  const handleAgregarMateria = () => {
    if (formData.codigoMateria && formData.nombreMateria && formData.anioCursando && formData.cuatrimestreCursando) {
      const nuevaMateria: MateriaEnCurso = {
        idMateria: Date.now(), // ID temporal
        codigoMateria: formData.codigoMateria,
        nombreMateria: formData.nombreMateria,
        horasSemanales: formData.horasSemanales,
        anioCursando: formData.anioCursando,
        cuatrimestreCursando: formData.cuatrimestreCursando,
        estado: "Cursando",
      }
      setMateriasEnCurso([...materiasEnCurso, nuevaMateria])
      setDialogAgregarAbierto(false)
      setFormData({})
    }
  }

  const getMateriasDisponiblesParaAgregar = () => {
    if (!planConsultado) return []
    const idsEnCurso = materiasEnCurso.map((m) => m.idMateria)
    return planConsultado.materias.filter((m) => !idsEnCurso.includes(m.idMateria))
  }

  const getEstadoBadge = (estado: EstadoMateria) => {
    const colors = {
      Pendiente: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
      Cursando: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      "En Final": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      Aprobada: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    }

    return (
      <Badge className={colors[estado]}>
        {estado === "Aprobada" && <Check className="h-3 w-3 mr-1" />}
        {estado === "Cursando" && <Clock className="h-3 w-3 mr-1" />}
        {estado === "En Final" && <AlertCircle className="h-3 w-3 mr-1" />}
        {estado}
      </Badge>
    )
  }

  const agruparMateriasPorPeriodo = () => {
    const agrupadas: { [key: string]: MateriaEnCurso[] } = {}

    materiasEnCurso.forEach((materia) => {
      const clave = `${materia.anioCursando}-${materia.cuatrimestreCursando}`
      if (!agrupadas[clave]) {
        agrupadas[clave] = []
      }
      agrupadas[clave].push(materia)
    })

    return agrupadas
  }

  const materiasAgrupadas = agruparMateriasPorPeriodo()

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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Materias En Curso</h1>
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
            <CardTitle>Gestión de Materias En Curso</CardTitle>
            <CardDescription>Administra las materias que estás cursando actualmente</CardDescription>
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
                    <SelectValue placeholder="Selecciona tu plan de estudio" />
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

        {/* Botón Agregar Materia */}
        {planConsultado && (
          <div className="mb-6">
            <Button onClick={() => setDialogAgregarAbierto(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Agregar Materia
            </Button>
          </div>
        )}

        {/* Materias Agrupadas por Período */}
        {planConsultado && Object.keys(materiasAgrupadas).length > 0 && (
          <div className="space-y-6">
            {Object.keys(materiasAgrupadas)
              .sort()
              .reverse()
              .map((periodo) => {
                const [anio, cuatrimestre] = periodo.split("-")
                return (
                  <div key={periodo} className="space-y-4">
                    {/* Título del Período */}
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-1 bg-blue-600 rounded"></div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {anio} - {cuatrimestre === "1" ? "Primer" : "Segundo"} Cuatrimestre
                      </h2>
                    </div>

                    {/* Materias del Período */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {materiasAgrupadas[periodo].map((materia) => (
                        <Card key={materia.idMateria} className="relative">
                          <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-base">{materia.nombreMateria}</CardTitle>
                                <CardDescription className="font-mono text-sm">{materia.codigoMateria}</CardDescription>
                              </div>
                              {materia.horasSemanales && (
                                <Badge variant="secondary" className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {materia.horasSemanales}h
                                </Badge>
                              )}
                            </div>
                            <div className="flex justify-between items-center">
                              {getEstadoBadge(materia.estado)}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditarMateria(materia.idMateria)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            {/* Información adicional del estado */}
                            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                              {materia.nota && (
                                <div>
                                  Nota: {materia.nota} ({materia.tipoNota})
                                </div>
                              )}
                              {materia.estado === "Aprobada" && materia.anioAprobacion && (
                                <div>
                                  {materia.tipoNota === "Por Promocion"
                                    ? `Promocionada: ${materia.anioAprobacion} - ${materia.cuatrimestreAprobacion}° Cuatrimestre`
                                    : `Aprobada: ${materia.anioAprobacion} - ${materia.turnoExamen}`}
                                </div>
                              )}
                            </div>
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
                  </div>
                )
              })}
          </div>
        )}

        {/* Estado inicial */}
        {!planConsultado && (
          <Card>
            <CardContent className="text-center py-12">
              <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Selecciona tu Plan de Estudio</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Elige tu plan de estudio para gestionar las materias que estás cursando.
              </p>
            </CardContent>
          </Card>
        )}

        {planConsultado && Object.keys(materiasAgrupadas).length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No hay materias en curso</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Agrega las materias que estás cursando actualmente.
              </p>
              <Button onClick={() => setDialogAgregarAbierto(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Agregar Primera Materia
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialog para editar materia */}
      <Dialog open={dialogEditarAbierto} onOpenChange={setDialogEditarAbierto}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Materia</DialogTitle>
            <DialogDescription>
              {materiaEditando && materiasEnCurso.find((m) => m.idMateria === materiaEditando)?.nombreMateria}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Estado */}
            <div>
              <Label>Estado</Label>
              <Select
                value={formData.estado || "Cursando"}
                onValueChange={(value: EstadoMateria) => setFormData({ ...formData, estado: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cursando">Cursando</SelectItem>
                  <SelectItem value="En Final">En Final</SelectItem>
                  <SelectItem value="Aprobada">Aprobada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Campos para Aprobada */}
            {formData.estado === "Aprobada" && (
              <>
                <div>
                  <Label>Tipo de Aprobación</Label>
                  <Select
                    value={formData.tipoNota || ""}
                    onValueChange={(value: TipoNota) => setFormData({ ...formData, tipoNota: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Por Promocion">Por Promoción</SelectItem>
                      <SelectItem value="Por Final">Por Final</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Nota</Label>
                  <Input
                    type="number"
                    min={formData.tipoNota === "Por Promocion" ? 7 : 4}
                    max="10"
                    value={formData.nota || ""}
                    onChange={(e) => setFormData({ ...formData, nota: Number.parseInt(e.target.value) })}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {formData.tipoNota === "Por Promocion" ? "Nota de 7 a 10" : "Nota de 4 a 10"}
                  </div>
                </div>

                {formData.tipoNota === "Por Promocion" && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>Año de Promoción</Label>
                      <Input
                        type="number"
                        min="2020"
                        max="2030"
                        value={formData.anioAprobacion || ""}
                        onChange={(e) => setFormData({ ...formData, anioAprobacion: Number.parseInt(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label>Cuatrimestre</Label>
                      <Select
                        value={formData.cuatrimestreAprobacion?.toString() || ""}
                        onValueChange={(value) =>
                          setFormData({ ...formData, cuatrimestreAprobacion: Number.parseInt(value) })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1° Cuatrimestre</SelectItem>
                          <SelectItem value="2">2° Cuatrimestre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {formData.tipoNota === "Por Final" && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>Año del Final</Label>
                      <Input
                        type="number"
                        min="2020"
                        max="2030"
                        value={formData.anioAprobacion || ""}
                        onChange={(e) => setFormData({ ...formData, anioAprobacion: Number.parseInt(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label>Turno de Examen</Label>
                      <Select
                        value={formData.turnoExamen || ""}
                        onValueChange={(value) => setFormData({ ...formData, turnoExamen: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {turnosExamen.map((turno) => (
                            <SelectItem key={turno} value={turno}>
                              {turno}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="flex gap-2 pt-4">
              <Button onClick={handleGuardarMateria} className="flex-1">
                Guardar
              </Button>
              <Button variant="outline" onClick={() => setDialogEditarAbierto(false)} className="flex-1">
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para agregar materia */}
      <Dialog open={dialogAgregarAbierto} onOpenChange={setDialogAgregarAbierto}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Agregar Materia</DialogTitle>
            <DialogDescription>Agrega una nueva materia que estés cursando</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Seleccionar Materia del Plan</Label>
              <Select
                value={formData.idMateria?.toString() || ""}
                onValueChange={(value) => {
                  const materia = planConsultado?.materias.find((m) => m.idMateria.toString() === value)
                  if (materia) {
                    setFormData({
                      ...formData,
                      idMateria: materia.idMateria,
                      codigoMateria: materia.codigoMateria,
                      nombreMateria: materia.nombreMateria,
                      horasSemanales: materia.horasSemanales,
                    })
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una materia" />
                </SelectTrigger>
                <SelectContent>
                  {getMateriasDisponiblesParaAgregar().map((materia) => (
                    <SelectItem key={materia.idMateria} value={materia.idMateria.toString()}>
                      {materia.codigoMateria} - {materia.nombreMateria}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Año</Label>
                <Input
                  type="number"
                  min="2020"
                  max="2030"
                  value={formData.anioCursando || ""}
                  onChange={(e) => setFormData({ ...formData, anioCursando: Number.parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label>Cuatrimestre</Label>
                <Select
                  value={formData.cuatrimestreCursando?.toString() || ""}
                  onValueChange={(value) => setFormData({ ...formData, cuatrimestreCursando: Number.parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1° Cuatrimestre</SelectItem>
                    <SelectItem value="2">2° Cuatrimestre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleAgregarMateria} className="flex-1">
                Agregar
              </Button>
              <Button variant="outline" onClick={() => setDialogAgregarAbierto(false)} className="flex-1">
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
