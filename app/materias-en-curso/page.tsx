'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BookOpen, Clock, Edit, Check, AlertCircle, Plus, GraduationCap } from 'lucide-react'
import { AppLayout } from '@/components/AppLayout'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import type {
  CondicionCursadaMateriaEnCurso,
  MateriaEnCurso,
  ResultadoCursadaMateriaEnCurso,
} from '@/models/materias.model'
import type { PlanDeEstudioMateriasEnCurso } from '@/models/plan-estudio.model'
import { getNombreCuatrimestre } from '@/utils/utils'
import { planesDeEstudioMateriasEnCurso } from '@/data/materias-en-curso.data'

interface FormResultadoCursada {
  codigoMateria: string
  resultadoCursada: ResultadoCursadaMateriaEnCurso
  nota: number
}

interface FormNuevaMateriaEnCurso {
  codigoMateria: string
  nombreMateria: string
  anioCursando: number
  cuatrimestreCursando: number
}

export default function MateriasEnCursoPage() {
  const [selectedPlanId, setSelectedPlanId] = useState<string>('')
  const [planConsultado, setPlanConsultado] = useState<PlanDeEstudioMateriasEnCurso | null>(null)
  const [materiasEnCurso, setMateriasEnCurso] = useState<MateriaEnCurso[]>([])
  const [dialogEditarAbierto, setDialogEditarAbierto] = useState(false)
  const [dialogAgregarAbierto, setDialogAgregarAbierto] = useState(false)
  const [materiaEditando, setMateriaEditando] = useState<MateriaEnCurso | null>(null)
  const [formDataResultado, setFormDataResultado] = useState<Partial<FormResultadoCursada>>({})
  const [formDataNuevaMateria, setFormDataNuevaMateria] = useState<Partial<FormNuevaMateriaEnCurso>>({})

  const handleConsultar = () => {
    if (selectedPlanId) {
      const plan = planesDeEstudioMateriasEnCurso.find((p) => p.idPlan.toString() === selectedPlanId)
      setPlanConsultado(plan || null)
      if (plan) {
        setMateriasEnCurso(plan.materiasEnCurso)
      }
    }
  }

  const handleEditarMateria = (codigoMateria: string) => {
    const materia = materiasEnCurso.find((m) => m.codigoMateria === codigoMateria)
    if (materia) {
      setMateriaEditando(materia)
      setFormDataResultado(materia)
      setDialogEditarAbierto(true)
    }
  }

  const handleGuardarMateria = () => {
    if (
      materiaEditando &&
      formDataResultado.codigoMateria &&
      formDataResultado.resultadoCursada &&
      formDataResultado.nota
    ) {
      setDialogEditarAbierto(false)
      setMateriaEditando(null)
      setFormDataResultado({})
    }
  }

  const handleAgregarMateria = () => {
    if (
      formDataNuevaMateria.codigoMateria &&
      formDataNuevaMateria.anioCursando &&
      formDataNuevaMateria.cuatrimestreCursando &&
      formDataNuevaMateria.nombreMateria
    ) {
      setDialogAgregarAbierto(false)
      setFormDataNuevaMateria({})
    }
  }

  const getMateriasDisponiblesParaAgregar = () => {
    if (!planConsultado) return []
    const codigosMateriasEnCurso = materiasEnCurso.map((m) => m.codigoMateria)
    return planConsultado.materiasDisponibles.filter((m) => !codigosMateriasEnCurso.includes(m.codigoMateria))
  }

  const getCondicionCursadaBadge = (estado: CondicionCursadaMateriaEnCurso) => {
    const colors = {
      'Para promocion/regularizar': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'Para regularizar': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    }

    return (
      <Badge className={colors[estado]}>
        {estado === 'Para promocion/regularizar' && <Check className="h-4 w-4 mr-1" />}
        {estado === 'Para regularizar' && <AlertCircle className="h-4 w-4 mr-1" />}
        {estado}
      </Badge>
    )
  }

  const getNotaMinimaPorResultadoCursada = (resultado: ResultadoCursadaMateriaEnCurso): number => {
    switch (resultado) {
      case 'Promocionada':
        return 7
      case 'Regularizada':
        return 4
      case 'Desaprobada':
        return 1
      default:
        return 0
    }
  }

  const getNotaMaximaPorResultadoCursada = (resultado: ResultadoCursadaMateriaEnCurso): number => {
    switch (resultado) {
      case 'Promocionada':
        return 10
      case 'Regularizada':
        return 6
      case 'Desaprobada':
        return 3
      default:
        return 0
    }
  }

  const mostrarInputNota = (resultado: ResultadoCursadaMateriaEnCurso): boolean => {
    return resultado === 'Promocionada' || resultado === 'Regularizada'
  }

  const agruparMateriasPorPeriodo = () => {
    const agrupadas: { [key: string]: MateriaEnCurso[] } = {}

    materiasEnCurso.forEach((materia) => {
      const clave = `${materia.anioCursando}-${getNombreCuatrimestre(materia.cuatrimestreCursando)}`
      if (!agrupadas[clave]) {
        agrupadas[clave] = []
      }
      agrupadas[clave].push(materia)
    })

    return agrupadas
  }

  const materiasAgrupadas = agruparMateriasPorPeriodo()

  return (
    <ProtectedRoute>
      <AppLayout title="Materias En Curso">
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
                    {planesDeEstudioMateriasEnCurso.map((plan) => (
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
                const [anio, cuatrimestre] = periodo.split('-')
                return (
                  <div key={periodo} className="space-y-4">
                    {/* Título del Período */}
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-1 bg-blue-600 rounded"></div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {anio} - {cuatrimestre}
                      </h2>
                    </div>

                    {/* Materias del Período */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {materiasAgrupadas[periodo].map((materia) => (
                        <Card key={materia.codigoMateria} className="relative">
                          <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
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
                              {getCondicionCursadaBadge(materia.condicionCursada)}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditarMateria(materia.codigoMateria)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
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
              {`${materiaEditando?.codigoMateria} - ${materiaEditando?.nombreMateria}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Resultado Cursada</Label>
              <Select
                value={formDataResultado.resultadoCursada || ''}
                onValueChange={(value: ResultadoCursadaMateriaEnCurso) =>
                  setFormDataResultado({ ...formDataResultado, resultadoCursada: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {materiaEditando?.condicionCursada === 'Para promocion/regularizar' && (
                    <SelectItem value="Promocionada">Promocionada</SelectItem>
                  )}
                  <SelectItem value="Regularizada">Regularizada</SelectItem>
                  <SelectItem value="Desaprobada">Desaprobada</SelectItem>
                  <SelectItem value="Ausente">Ausente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formDataResultado.resultadoCursada && mostrarInputNota(formDataResultado.resultadoCursada) && (
              <div>
                <Label>Nota</Label>
                <Input
                  type="number"
                  min={getNotaMinimaPorResultadoCursada(formDataResultado.resultadoCursada)}
                  max={getNotaMaximaPorResultadoCursada(formDataResultado.resultadoCursada)}
                  value={formDataResultado.nota || ''}
                  onChange={(e) =>
                    setFormDataResultado({ ...formDataResultado, nota: Number.parseInt(e.target.value) })
                  }
                />
                <div className="text-xs text-gray-500 mt-1">
                  {`Nota de ${getNotaMinimaPorResultadoCursada(formDataResultado.resultadoCursada)} a ${getNotaMaximaPorResultadoCursada(formDataResultado.resultadoCursada)}`}
                </div>
              </div>
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
                value={formDataNuevaMateria.codigoMateria?.toString() || ''}
                onValueChange={(value) => {
                  const materia = planConsultado?.materiasDisponibles.find((m) => m.codigoMateria.toString() === value)
                  if (materia) {
                    setFormDataNuevaMateria({
                      ...formDataNuevaMateria,
                      codigoMateria: materia.codigoMateria,
                      nombreMateria: materia.nombreMateria,
                    })
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una materia" />
                </SelectTrigger>
                <SelectContent>
                  {getMateriasDisponiblesParaAgregar().map((materia) => (
                    <SelectItem key={materia.codigoMateria} value={materia.codigoMateria.toString()}>
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
                  value={formDataNuevaMateria.anioCursando || ''}
                  onChange={(e) =>
                    setFormDataNuevaMateria({ ...formDataNuevaMateria, anioCursando: Number.parseInt(e.target.value) })
                  }
                />
              </div>
              <div>
                <Label>Cuatrimestre</Label>
                <Select
                  value={formDataNuevaMateria.cuatrimestreCursando?.toString() || ''}
                  onValueChange={(value) =>
                    setFormDataNuevaMateria({ ...formDataNuevaMateria, cuatrimestreCursando: Number.parseInt(value) })
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
      </AppLayout>
    </ProtectedRoute>
  )
}
