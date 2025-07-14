"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, LogOut, BookOpen, Clock, Edit, Check, X, AlertCircle, Trophy } from "lucide-react"

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

type EstadoMateria = "Pendiente" | "Cursando" | "En Final" | "Aprobada"
type TipoNota = "Por Promocion" | "Por Final"

interface EstadoMateriaUsuario {
  idMateria: number
  estado: EstadoMateria
  nota?: number
  tipoNota?: TipoNota
  anioCursado?: number
  cuatrimestreCursado?: number
  anioAprobacion?: number
  cuatrimestreAprobacion?: number
  turnoExamen?: string
}

// Datos de ejemplo (mismos que en planes-estudio)
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
  {
    idPlan: 2,
    nombreCarrera: "Licenciatura en Informática",
    anio: 2022,
    materias: [
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
    ],
  },
]

const turnosExamen = ["Febrero", "Marzo", "Julio", "Agosto", "Octubre", "Diciembre"]

export default function MisCarrerasPage() {
  const [selectedPlanId, setSelectedPlanId] = useState<string>("")
  const [planConsultado, setPlanConsultado] = useState<PlanDeEstudio | null>(null)
  const [estadosMaterias, setEstadosMaterias] = useState<{ [key: number]: EstadoMateriaUsuario }>({})
  const [materiasSeleccionadas, setMateriasSeleccionadas] = useState<number[]>([])
  const [dialogAbierto, setDialogAbierto] = useState(false)
  const [materiaEditando, setMateriaEditando] = useState<number | null>(null)
  const [formData, setFormData] = useState<Partial<EstadoMateriaUsuario>>({})

  const handleConsultar = () => {
    if (selectedPlanId) {
      const plan = planesDeEstudio.find((p) => p.idPlan.toString() === selectedPlanId)
      setPlanConsultado(plan || null)
      setMateriasSeleccionadas([])
      // Inicializar estados como "Pendiente" para todas las materias
      if (plan) {
        const estadosIniciales: { [key: number]: EstadoMateriaUsuario } = {}
        plan.materias.forEach((materia) => {
          estadosIniciales[materia.idMateria] = {
            idMateria: materia.idMateria,
            estado: "Pendiente",
          }
        })
        setEstadosMaterias(estadosIniciales)
      }
    }
  }

  const handleLogout = () => {
    window.location.href = "/"
  }

  const handleSeleccionMateria = (idMateria: number, seleccionada: boolean) => {
    if (seleccionada) {
      setMateriasSeleccionadas([...materiasSeleccionadas, idMateria])
    } else {
      setMateriasSeleccionadas(materiasSeleccionadas.filter((id) => id !== idMateria))
    }
  }

  const handleCambiarEstadoMasivo = (nuevoEstado: EstadoMateria) => {
    const nuevosEstados = { ...estadosMaterias }
    materiasSeleccionadas.forEach((idMateria) => {
      nuevosEstados[idMateria] = {
        ...nuevosEstados[idMateria],
        estado: nuevoEstado,
      }
    })
    setEstadosMaterias(nuevosEstados)
    setMateriasSeleccionadas([])
  }

  const handleEditarMateria = (idMateria: number) => {
    setMateriaEditando(idMateria)
    setFormData(estadosMaterias[idMateria] || { idMateria, estado: "Pendiente" })
    setDialogAbierto(true)
  }

  const handleGuardarMateria = () => {
    if (materiaEditando && formData) {
      setEstadosMaterias({
        ...estadosMaterias,
        [materiaEditando]: {
          idMateria: materiaEditando,
          estado: formData.estado || "Pendiente",
          nota: formData.nota,
          tipoNota: formData.tipoNota,
          anioCursado: formData.anioCursado,
          cuatrimestreCursado: formData.cuatrimestreCursado,
          anioAprobacion: formData.anioAprobacion,
          cuatrimestreAprobacion: formData.cuatrimestreAprobacion,
          turnoExamen: formData.turnoExamen,
        },
      })
      setDialogAbierto(false)
      setMateriaEditando(null)
      setFormData({})
    }
  }

  const getEstadoBadge = (estado: EstadoMateria) => {
    const variants = {
      Pendiente: "secondary",
      Cursando: "default",
      "En Final": "destructive",
      Aprobada: "default",
    } as const

    const colors = {
      Pendiente: "bg-gray-100 text-gray-800",
      Cursando: "bg-blue-100 text-blue-800",
      "En Final": "bg-yellow-100 text-yellow-800",
      Aprobada: "bg-green-100 text-green-800",
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

  const getEstadisticas = () => {
    if (!planConsultado) return null

    const total = planConsultado.materias.length
    const aprobadas = Object.values(estadosMaterias).filter((e) => e.estado === "Aprobada").length
    const cursando = Object.values(estadosMaterias).filter((e) => e.estado === "Cursando").length
    const enFinal = Object.values(estadosMaterias).filter((e) => e.estado === "En Final").length
    const pendientes = total - aprobadas - cursando - enFinal

    const progreso = Math.round((aprobadas / total) * 100)

    return { total, aprobadas, cursando, enFinal, pendientes, progreso }
  }

  const estadisticas = getEstadisticas()

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
              <h1 className="text-2xl font-bold text-gray-900">Mis Carreras</h1>
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
            <CardTitle>Mi Progreso Académico</CardTitle>
            <CardDescription>Selecciona tu plan de estudio para gestionar el progreso de tus materias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1 max-w-md">
                <label htmlFor="plan-select" className="block text-sm font-medium text-gray-700 mb-2">
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

        {/* Estadísticas */}
        {estadisticas && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Progreso General
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center mb-4">
                <div>
                  <div className="text-2xl font-bold text-green-600">{estadisticas.aprobadas}</div>
                  <div className="text-sm text-gray-600">Aprobadas</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{estadisticas.cursando}</div>
                  <div className="text-sm text-gray-600">Cursando</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">{estadisticas.enFinal}</div>
                  <div className="text-sm text-gray-600">En Final</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-600">{estadisticas.pendientes}</div>
                  <div className="text-sm text-gray-600">Pendientes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">{estadisticas.progreso}%</div>
                  <div className="text-sm text-gray-600">Completado</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${estadisticas.progreso}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Acciones Masivas */}
        {materiasSeleccionadas.length > 0 && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="text-sm font-medium">{materiasSeleccionadas.length} materia(s) seleccionada(s):</span>
                <div className="flex gap-2 flex-wrap">
                  <Button size="sm" onClick={() => handleCambiarEstadoMasivo("Pendiente")} variant="outline">
                    Marcar Pendiente
                  </Button>
                  <Button size="sm" onClick={() => handleCambiarEstadoMasivo("Cursando")} variant="outline">
                    Marcar Cursando
                  </Button>
                  <Button size="sm" onClick={() => handleCambiarEstadoMasivo("En Final")} variant="outline">
                    Marcar En Final
                  </Button>
                  <Button size="sm" onClick={() => handleCambiarEstadoMasivo("Aprobada")} variant="outline">
                    Marcar Aprobada
                  </Button>
                </div>
                <Button size="sm" variant="ghost" onClick={() => setMateriasSeleccionadas([])}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lista de Materias */}
        {planConsultado && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {planConsultado.materias.map((materia) => {
              const estadoMateria = estadosMaterias[materia.idMateria]
              return (
                <Card key={materia.idMateria} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={materiasSeleccionadas.includes(materia.idMateria)}
                        onCheckedChange={(checked) => handleSeleccionMateria(materia.idMateria, checked as boolean)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <CardTitle className="text-base">{materia.nombreMateria}</CardTitle>
                            <CardDescription className="font-mono text-sm">{materia.codigoMateria}</CardDescription>
                          </div>
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {materia.horasSemanales}h
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          {getEstadoBadge(estadoMateria?.estado || "Pendiente")}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditarMateria(materia.idMateria)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {/* Información adicional del estado */}
                    {estadoMateria && (
                      <div className="text-xs text-gray-600 space-y-1">
                        {estadoMateria.nota && (
                          <div>
                            Nota: {estadoMateria.nota} ({estadoMateria.tipoNota})
                          </div>
                        )}
                        {estadoMateria.estado === "Cursando" && estadoMateria.anioCursado && (
                          <div>
                            Cursando: {estadoMateria.anioCursado} - {estadoMateria.cuatrimestreCursado}° Cuatrimestre
                          </div>
                        )}
                        {estadoMateria.estado === "En Final" && estadoMateria.anioCursado && (
                          <div>
                            Final desde: {estadoMateria.anioCursado} - {estadoMateria.cuatrimestreCursado}° Cuatrimestre
                          </div>
                        )}
                        {estadoMateria.estado === "Aprobada" && estadoMateria.anioAprobacion && (
                          <div>
                            {estadoMateria.tipoNota === "Por Promocion"
                              ? `Promocionada: ${estadoMateria.anioAprobacion} - ${estadoMateria.cuatrimestreAprobacion}° Cuatrimestre`
                              : `Aprobada: ${estadoMateria.anioAprobacion} - ${estadoMateria.turnoExamen}`}
                          </div>
                        )}
                      </div>
                    )}
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
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Selecciona tu Plan de Estudio</h3>
              <p className="text-gray-600">
                Elige tu plan de estudio para comenzar a gestionar el progreso de tus materias.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialog para editar materia */}
      <Dialog open={dialogAbierto} onOpenChange={setDialogAbierto}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Estado de Materia</DialogTitle>
            <DialogDescription>
              {materiaEditando &&
                planConsultado &&
                planConsultado.materias.find((m) => m.idMateria === materiaEditando)?.nombreMateria}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Estado */}
            <div>
              <Label>Estado</Label>
              <Select
                value={formData.estado || "Pendiente"}
                onValueChange={(value: EstadoMateria) => setFormData({ ...formData, estado: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                  <SelectItem value="Cursando">Cursando</SelectItem>
                  <SelectItem value="En Final">En Final</SelectItem>
                  <SelectItem value="Aprobada">Aprobada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Campos para Cursando */}
            {formData.estado === "Cursando" && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Año</Label>
                    <Input
                      type="number"
                      min="2020"
                      max="2030"
                      value={formData.anioCursado || ""}
                      onChange={(e) => setFormData({ ...formData, anioCursado: Number.parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label>Cuatrimestre</Label>
                    <Select
                      value={formData.cuatrimestreCursado?.toString() || ""}
                      onValueChange={(value) =>
                        setFormData({ ...formData, cuatrimestreCursado: Number.parseInt(value) })
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
              </>
            )}

            {/* Campos para En Final */}
            {formData.estado === "En Final" && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Año que la mandó a final</Label>
                    <Input
                      type="number"
                      min="2020"
                      max="2030"
                      value={formData.anioCursado || ""}
                      onChange={(e) => setFormData({ ...formData, anioCursado: Number.parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label>Cuatrimestre</Label>
                    <Select
                      value={formData.cuatrimestreCursado?.toString() || ""}
                      onValueChange={(value) =>
                        setFormData({ ...formData, cuatrimestreCursado: Number.parseInt(value) })
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
              </>
            )}

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
              <Button variant="outline" onClick={() => setDialogAbierto(false)} className="flex-1">
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
