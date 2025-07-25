'use client'

/* ---------------------------------- HOOKS --------------------------------- */
import { useState, useMemo, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { usePlanesSummary } from '@/hooks/use-planes-estudio'
/* ------------------------------ COMPONENTS UI ----------------------------- */
import { AppLayout } from '@/components/AppLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Clock, Filter, Search, X, User } from 'lucide-react'
/* --------------------------------- MODELS --------------------------------- */
import type { MateriaPlanEstudio, EstadoMateriaPlanEstudio } from '@/models/materias.model'
import type { PlanDeEstudioDetalle } from '@/models/plan-estudio.model'

/* --------------------------------- UTILES --------------------------------- */
import Link from 'next/link'
import { getNombreCuatrimestre } from '@/utils/utils'
import { set } from 'react-hook-form'

interface PlanesEstudioFilters {
  anioCursada: string
  cuatrimestreCursada: string
  nombreMateria: string
  estadoMateriaUsuario: string
  horasSemanales: string
  showEstadoMateriaUsuario: boolean
  showCorrelativasMateria: boolean
  nombreCorrelativa: string
}

const initialPlanFilters: PlanesEstudioFilters = {
  anioCursada: '-1',
  cuatrimestreCursada: '-1',
  nombreMateria: '',
  estadoMateriaUsuario: 'Todos',
  horasSemanales: '',
  showEstadoMateriaUsuario: true,
  showCorrelativasMateria: true,
  nombreCorrelativa: '',
}

export default function PlanesEstudioPage() {
  // Para bloquear o no el filtro de estado de materia según autenticación y mostrar/ocultar dicho estado
  const { user, isUserInitialized } = useAuth()
  const isLoggedIn: boolean = user !== null && isUserInitialized

  // Planes para el input select
  const { planes: planesDisponibles, loading: isLoadingPlanesDisponible, fetchPlanById } = usePlanesSummary()

  // Detalles de planes
  const [detallePlanConsultado, setDetallePlanConsultado] = useState<PlanDeEstudioDetalle | null>(null)
  const [isLoadingPlanDetails, setIsLoadingPlanDetails] = useState<boolean>(false)

  // Auxiliar para ir a la materia resaltada
  const [materiaResaltada, setMateriaResaltada] = useState<string | null>(null)

  // Filtros para el detalle del plan
  const [filtersPlan, setFiltersPlan] = useState(initialPlanFilters)
  const [showFilters, setShowFilters] = useState<boolean>(false)

  // Otros auxiliares
  const { toast } = useToast()
  const [filtroEstadoHabilitado, setFiltroEstadoHabilitado] = useState<boolean>(false)

  // Handlers cambios filtros
  const handleFilterYearChange = (value: string) => {
    setFiltersPlan((prev) => ({ ...prev, anioCursada: value }))
  }

  const handleFilterCuatrimestreChange = (value: string) => {
    setFiltersPlan((prev) => ({ ...prev, cuatrimestreCursada: value }))
  }

  const handleSearchTermChange = (value: string) => {
    setFiltersPlan((prev) => ({ ...prev, nombreMateria: value }))
  }

  const handleFilterCorrelativaChange = (value: string) => {
    setFiltersPlan((prev) => ({ ...prev, nombreCorrelativa: value }))
  }

  const handleFilterStatusChange = (value: string) => {
    if (!isLoggedIn) return // No permitir cambios si no está logueado
    setFiltersPlan((prev) => ({ ...prev, estadoMateriaUsuario: value }))
  }

  const handleFilterHoursChange = (value: string) => {
    setFiltersPlan((prev) => ({ ...prev, horasSemanales: value }))
  }

  const handleShowMateriaStatusChange = (value: boolean) => {
    if (!filtroEstadoHabilitado) return
    setFiltersPlan((prev) => ({ ...prev, showEstadoMateriaUsuario: value }))
  }

  const handleShowCorrelativesChange = (value: boolean) => {
    setFiltersPlan((prev) => ({ ...prev, showCorrelativasMateria: value }))
  }

  // Handler para limpiar todos los filtros
  const handleClearAllFilters = () => {
    setFiltersPlan(initialPlanFilters)
  }

  // Handler para el submit del formu lario de selección de plan
  const handleSubmitPlan = async (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)
    const selectedPlanId = formData.get('plan-select')

    if (typeof selectedPlanId === 'string' && selectedPlanId !== '') {
      setIsLoadingPlanDetails(true)

      try {
        const usuarioIdToPass = isLoggedIn && user?.dbId && user.dbId > 0 ? user.dbId : undefined

        const planData = await fetchPlanById(parseInt(selectedPlanId), usuarioIdToPass)

        setDetallePlanConsultado(planData)

        setFiltersPlan(initialPlanFilters)
      } catch (error) {
        let errorMessage = 'Error desconocido. Por favor, inténtalo más tarde.'

        if (error instanceof Error) {
          if (error.message.includes('fetch') || error.message.includes('network') || error.name === 'NetworkError') {
            errorMessage = 'Error de conexión. Verifica tu conexión a internet e inténtalo nuevamente.'
          } else if (error.message.includes('timeout') || error.name === 'TimeoutError') {
            errorMessage = 'La solicitud tardó demasiado tiempo. Por favor, inténtalo más tarde.'
          } else if (error.message.includes('500') || error.message.includes('server')) {
            errorMessage = 'Error del servidor. Por favor, inténtalo más tarde.'
          } else if (error.message.includes('404') || error.message.includes('not found')) {
            errorMessage = 'Plan de estudio no encontrado. Verifica que el plan seleccionado sea válido.'
          } else if (error.message.length > 0) {
            errorMessage = `Error: ${error.message}`
          }
        }

        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        })
      } finally {
        setIsLoadingPlanDetails(false)
      }
    }
  }

  /* ----------------------------- UTILES FILTROS ----------------------------- */
  useEffect(() => {
    if (isLoggedIn) {
      if (detallePlanConsultado === null) {
        setFiltroEstadoHabilitado(false)
      } else {
        const algunaMateriaConEstadoNulo = detallePlanConsultado.materias.some((m) => m.estado === null)
        if (algunaMateriaConEstadoNulo) {
          setFiltroEstadoHabilitado(false)
          setFiltersPlan((prev) => ({ ...prev, estadoMateriaUsuario: 'Todos' }))
        } else {
          setFiltroEstadoHabilitado(true)
        }
      }
    } else {
      setFiltroEstadoHabilitado(false)
    }
  }, [isLoggedIn, detallePlanConsultado])

  // Años disponibles para filtrar - Teniendo en cuenta la informacion dentro del plan consultado
  const aniosDisponiblesFiltro = useMemo(() => {
    if (!detallePlanConsultado) return []
    return [...new Set(detallePlanConsultado.materias.map((m) => m.anioCursada))].sort((a, b) => a - b)
  }, [detallePlanConsultado])

  // Estados disponibles para filtrar - TODOS EXISTENTES
  const estadosMateriasDisponiblesFiltro: EstadoMateriaPlanEstudio[] = ['Pendiente', 'En Curso', 'En Final', 'Aprobada']

  // Obtener las materias filtradas según los filtros activos
  const materiasPlanEstudioFiltradas = useMemo(() => {
    if (!detallePlanConsultado) return []

    let filteredMaterias = detallePlanConsultado.materias

    // Filter by anioCursada
    if (filtersPlan.anioCursada !== initialPlanFilters.anioCursada) {
      filteredMaterias = filteredMaterias.filter(
        (materia) => materia.anioCursada.toString() === filtersPlan.anioCursada
      )
    }

    // Filter by cuatrimestreCursada
    if (filtersPlan.cuatrimestreCursada !== initialPlanFilters.cuatrimestreCursada) {
      filteredMaterias = filteredMaterias.filter(
        (materia) => materia.cuatrimestreCursada.toString() === filtersPlan.cuatrimestreCursada
      )
    }

    // Filter by nombreMateria
    if (filtersPlan.nombreMateria) {
      const lowerCaseSearchTerm = filtersPlan.nombreMateria.toLowerCase()
      filteredMaterias = filteredMaterias.filter((materia) =>
        materia.codigoMateria.toLowerCase().includes(lowerCaseSearchTerm)
      )
    }

    // Filter by estadoMateriaUsuario (solo si está logueado y el plan es una carrera del usuario)
    if (filtersPlan.estadoMateriaUsuario !== initialPlanFilters.estadoMateriaUsuario && filtroEstadoHabilitado) {
      filteredMaterias = filteredMaterias.filter((materia) => materia.estado === filtersPlan.estadoMateriaUsuario)
    }

    // Filter by horasSemanales
    if (filtersPlan.horasSemanales) {
      const horasSemanales = Number.parseInt(filtersPlan.horasSemanales)
      if (!Number.isNaN(horasSemanales)) {
        filteredMaterias = filteredMaterias.filter((materia) => materia.horasSemanales === horasSemanales)
      }
    }

    // Filter by correlative nombreMateria
    if (filtersPlan.nombreCorrelativa) {
      const lowerCaseCorrelativeSearch = filtersPlan.nombreCorrelativa.toLowerCase()

      // Busco la correlativa por el nombre de dicha materia
      const foundCorrelativeMateria = detallePlanConsultado.materias.find((materia) =>
        materia.nombreMateria.toLowerCase().includes(lowerCaseCorrelativeSearch)
      )

      if (foundCorrelativeMateria) {
        // Filter by correlative codigoMateria
        filteredMaterias = filteredMaterias.filter((materia) =>
          materia.listaCorrelativas.some(
            (correlativa) => correlativa.codigoMateria === foundCorrelativeMateria.codigoMateria
          )
        )
      } else {
        // Si no se encuentra la correlativa, no mostrar resultados
        filteredMaterias = []
      }
    }

    return filteredMaterias
  }, [detallePlanConsultado, filtersPlan, isLoggedIn])

  // Cantidad de filtros activos
  const cantidadFiltrosActivos = useMemo(() => {
    return [
      filtersPlan.anioCursada !== initialPlanFilters.anioCursada,
      filtersPlan.cuatrimestreCursada !== initialPlanFilters.cuatrimestreCursada,
      filtersPlan.nombreMateria !== initialPlanFilters.nombreMateria,
      filtersPlan.estadoMateriaUsuario !== initialPlanFilters.estadoMateriaUsuario,
      filtersPlan.horasSemanales !== initialPlanFilters.horasSemanales,
      !filtroEstadoHabilitado
        ? false
        : filtersPlan.showEstadoMateriaUsuario !== initialPlanFilters.showEstadoMateriaUsuario,
      filtersPlan.showCorrelativasMateria !== initialPlanFilters.showCorrelativasMateria,
      filtersPlan.nombreCorrelativa !== initialPlanFilters.nombreCorrelativa,
    ].filter(Boolean).length
  }, [filtersPlan, isLoggedIn])

  // Ver si hay filtros activos
  const hasActiveFilters = useMemo(() => cantidadFiltrosActivos > 0, [cantidadFiltrosActivos])

  /* -------------------------------- UTILES UI ------------------------------- */
  // Función para agrupar materias por año y cuatrimestreCursada - Vista web
  const agruparMaterias = (materias: MateriaPlanEstudio[]) => {
    const agrupadas: { [anio: number]: { [cuatrimestreCursada: number]: MateriaPlanEstudio[] } } = {}

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

  // Listado materias del detalle del plan agrupadas por año y cuatrimestreCursada - Vista web
  const materiasAgrupadas = useMemo(() => agruparMaterias(materiasPlanEstudioFiltradas), [materiasPlanEstudioFiltradas])

  // Util para navegar a una materia resaltada al clickear en una correlativa
  const navegarACorrelativa = (codigoMateria: string) => {
    setMateriaResaltada(codigoMateria)
    const element = document.getElementById(`materia-${codigoMateria}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      setTimeout(() => setMateriaResaltada(null), 3000)
    }
  }

  // Obtener el color del badge según el estado de la materia
  const getStatusBadgeColor = (estadoMateriaUsuario: EstadoMateriaPlanEstudio) => {
    switch (estadoMateriaUsuario) {
      case 'Aprobada':
        return 'bg-green-100 text-green-800'
      case 'En Final':
        return 'bg-purple-100 text-purple-800'
      case 'En Curso':
        return 'bg-blue-100 text-blue-800'
      case 'Pendiente':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Obtener el mensaje de warning segun el estado del loggin o si tiene materias con estado nulo
  const getWarningFilterEstadoMateriaUsuario = () => {
    if (!isLoggedIn) {
      return (
        <div className="flex items-center gap-1 mt-1">
          <User className="h-3 w-3 text-amber-600" />
          <span className="text-xs text-amber-600">Inicia sesión para filtrar por estado</span>
        </div>
      )
    } else if (!filtroEstadoHabilitado) {
      return (
        <div className="flex items-center gap-1 mt-1">
          <User className="h-3 w-3 text-amber-600" />
          <span className="text-xs text-amber-600">
            No se puede filtrar por estado ya que no esta cargada como carrera en tu cuenta
          </span>
        </div>
      )
    }
    return null
  }

  return (
    <AppLayout title="Planes de Estudio">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Planes de Estudio</h1>
            <p className="text-gray-600">
              Consulta todos los planes existentes junto a sus materias, correlativas, horas semanales, etc.
            </p>
          </div>
        </div>

        {/* Selector de Plan */}
        <form onSubmit={handleSubmitPlan}>
          <Card className="mb-8 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Búsqueda</CardTitle>
              <CardDescription className="text-gray-600">
                Luego de consultar un plan, podrás filtrar las materias por año, cuatrimestreCursada, nombre, estado u
                horas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Fila 1  - Label y Select*/}
              <div className="grid gap-2">
                <div>
                  <Label htmlFor="plan-select" className="block text-sm font-medium text-gray-700 mb-2">
                    Plan de Estudio
                  </Label>
                  <Select disabled={isLoadingPlanesDisponible} name="plan-select">
                    <SelectTrigger className="bg-white border-gray-300">
                      <SelectValue
                        placeholder={isLoadingPlanesDisponible ? 'Cargando planes...' : 'Selecciona un plan de estudio'}
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-300">
                      {isLoadingPlanesDisponible ? (
                        <SelectItem value="loading" disabled>
                          Cargando planes de estudio...
                        </SelectItem>
                      ) : (
                        planesDisponibles.map((plan) => (
                          <SelectItem key={plan.idPlan} value={plan.idPlan.toString()}>
                            {plan.nombreCarrera} ({plan.anio})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                {/* Fila 2 - Botones */}
                <div className="flex justify-end gap-2">
                  <Button
                    type="submit"
                    disabled={isLoadingPlanesDisponible || isLoadingPlanDetails}
                    style={{ width: '150px' }}
                  >
                    {isLoadingPlanDetails ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                        Cargando...
                      </>
                    ) : (
                      'Consultar'
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>

        {/* Loading state para plan details */}
        {isLoadingPlanDetails && (
          <div className="space-y-6">
            {/* Skeleton para Estadísticas del Plan */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <div className="h-8 bg-gray-200 rounded animate-pulse w-80"></div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i}>
                      <div className="h-8 bg-gray-200 rounded animate-pulse mb-2 w-16 mx-auto"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-24 mx-auto"></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Skeleton para Materias por Año */}
            {[1, 2, 3].map((anio) => (
              <div key={anio} className="space-y-4">
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-1 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-8 bg-gray-200 rounded animate-pulse w-32"></div>
                    </div>
                  </CardHeader>
                  <CardContent className="pl-4 space-y-4">
                    {[0, 1, 2].map((cuatrimestreCursada) => (
                      <div key={cuatrimestreCursada} className="space-y-4">
                        <div className="flex items-center gap-2 pl-4">
                          <div className="h-6 w-1 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-6 bg-gray-200 rounded animate-pulse w-48"></div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pl-4">
                          {[1, 2, 3, 4, 5, 6].map((materia) => (
                            <Card
                              key={materia}
                              className="border-l-4 border-l-gray-200 bg-white shadow-sm animate-pulse"
                            >
                              <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <div className="h-5 bg-gray-200 rounded w-full mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                                  </div>
                                  <div className="flex flex-col items-end gap-1">
                                    <div className="h-6 bg-gray-200 rounded w-12"></div>
                                    <div className="h-5 bg-gray-200 rounded w-16"></div>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent className="pt-0">
                                <div className="space-y-2">
                                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                                  <div className="space-y-1">
                                    <div className="h-6 bg-gray-200 rounded w-full"></div>
                                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                                  </div>
                                  <div className="h-8 bg-gray-200 rounded w-full mt-3"></div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}

        {/* Resultado del Plan */}
        {detallePlanConsultado && !isLoadingPlanDetails && (
          <div className="space-y-6">
            {/* Estadísticas del Plan */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900">{`${detallePlanConsultado.nombreCarrera} - Año ${detallePlanConsultado.anio}`}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{detallePlanConsultado.materias.length}</div>
                    <div className="text-sm text-gray-600">Total Materias</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {detallePlanConsultado.materias.reduce((sum, m) => sum + (m.horasSemanales || 0), 0)}
                    </div>
                    <div className="text-sm text-gray-600">Horas Totales</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.max(...detallePlanConsultado.materias.map((m) => m.anioCursada))}
                    </div>
                    <div className="text-sm text-gray-600">Años de Duración</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">
                      {detallePlanConsultado.materias.filter((m) => m.listaCorrelativas.length === 0).length}
                    </div>
                    <div className="text-sm text-gray-600">Sin Correlativas</div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  {hasActiveFilters && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClearAllFilters}
                      className="bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Limpiar Todos los Filtros
                    </Button>
                  )}
                  <Button
                    type="button"
                    disabled={detallePlanConsultado === null}
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    style={{ width: '200px' }}
                    className={`bg-white hover:bg-gray-50 border-gray-300 ${hasActiveFilters ? 'text-blue-700 border-blue-300' : 'text-gray-700'}`}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
                    {hasActiveFilters && (
                      <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800">
                        {cantidadFiltrosActivos}
                      </Badge>
                    )}
                  </Button>
                </div>
                <div
                  className={`mt-4 pt-4 grid border-t border-gray-200 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 transition-all duration-300 ${showFilters ? 'block' : 'hidden'}`}
                >
                  {/* Search by Name/Code */}
                  <div className="col-span-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="col-span-1 sm:col-span-2 md:col-span-2">
                      <Label htmlFor="nombreMateria-term" className="block text-sm font-medium text-gray-700 mb-2">
                        Buscar Materia
                      </Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="nombreMateria-term"
                          placeholder="Nombre materia"
                          value={filtersPlan.nombreMateria}
                          onChange={(e) => handleSearchTermChange(e.target.value)}
                          className="pl-9 bg-white border-gray-300"
                        />
                        {filtersPlan.nombreMateria && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400 hover:bg-transparent"
                            onClick={() => handleSearchTermChange('')}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Filter by Year */}
                  <div>
                    <Label htmlFor="filter-anioCursada" className="block text-sm font-medium text-gray-700 mb-2">
                      Año
                    </Label>
                    <Select value={filtersPlan.anioCursada} onValueChange={handleFilterYearChange}>
                      <SelectTrigger id="filter-anioCursada" className="bg-white border-gray-300">
                        <SelectValue placeholder="Todos los años" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-300">
                        <SelectItem value={initialPlanFilters.anioCursada}>Todos los años</SelectItem>
                        {aniosDisponiblesFiltro.map((anioCursada) => (
                          <SelectItem key={anioCursada} value={anioCursada.toString()}>
                            {anioCursada}° Año
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Filter by Cuatrimestre */}
                  <div>
                    <Label
                      htmlFor="filter-cuatrimestreCursada"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Cuatrimestre
                    </Label>
                    <Select value={filtersPlan.cuatrimestreCursada} onValueChange={handleFilterCuatrimestreChange}>
                      <SelectTrigger id="filter-cuatrimestreCursada" className="bg-white border-gray-300">
                        <SelectValue placeholder="Todos los cuatrimestres" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-300">
                        <SelectItem value={initialPlanFilters.cuatrimestreCursada}>Todos los cuatrimestres</SelectItem>
                        <SelectItem value="0">Anual</SelectItem>
                        <SelectItem value="1">1° Cuatrimestre</SelectItem>
                        <SelectItem value="2">2° Cuatrimestre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Filter by Hours */}
                  <div>
                    <Label htmlFor="filter-horasSemanales" className="block text-sm font-medium text-gray-700 mb-2">
                      Horas Semanales
                    </Label>
                    <Input
                      id="filter-horasSemanales"
                      type="number"
                      placeholder="Ej: 4"
                      value={filtersPlan.horasSemanales}
                      onChange={(e) => handleFilterHoursChange(e.target.value)}
                      className="bg-white border-gray-300"
                    />
                  </div>

                  {/* Fila - Filtros Correlativa */}
                  <div className="col-span-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Search by Name/Code Correlativa*/}
                    <div className="col-span-1">
                      <Label
                        htmlFor="nombreMateria-correlativa"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Buscar Correlativa
                      </Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="nombreMateria-correlativa"
                          placeholder="Nombre de la materia correlativa"
                          value={filtersPlan.nombreCorrelativa}
                          onChange={(e) => handleFilterCorrelativaChange(e.target.value)}
                          className="pl-9 bg-white border-gray-300"
                        />
                        {filtersPlan.nombreCorrelativa && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400 hover:bg-transparent"
                            onClick={() => handleFilterCorrelativaChange('')}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Toggle Show Materia Correlativas */}
                    <div className="col-span-1 flex flex-col justify-end">
                      <div className="flex items-center space-x-2 h-10">
                        <Switch
                          id="show-correlatives"
                          checked={filtersPlan.showCorrelativasMateria}
                          onCheckedChange={handleShowCorrelativesChange}
                        />
                        <Label htmlFor="show-correlatives" className="text-gray-700">
                          Mostrar Correlativas
                        </Label>
                      </div>
                    </div>
                  </div>

                  {/* Fila - Filtros Estado Materia */}
                  <div className="col-span-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Filter by Status */}
                    <div className="col-span-1">
                      <Label
                        htmlFor="filter-estadoMateriaUsuario"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Estado
                        {getWarningFilterEstadoMateriaUsuario()}
                      </Label>
                      <Select
                        value={filtersPlan.estadoMateriaUsuario}
                        onValueChange={handleFilterStatusChange}
                        disabled={!filtroEstadoHabilitado}
                      >
                        <SelectTrigger id="filter-estadoMateriaUsuario" className="bg-white border-gray-300">
                          <SelectValue placeholder={!isLoggedIn ? 'Requiere autenticación' : 'Todos los estados'} />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-300">
                          <SelectItem value={initialPlanFilters.estadoMateriaUsuario}>Todos los estados</SelectItem>
                          {estadosMateriasDisponiblesFiltro.map((estadoMateriaUsuario) => (
                            <SelectItem key={estadoMateriaUsuario} value={estadoMateriaUsuario}>
                              {estadoMateriaUsuario}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Toggle Show Materia Status */}
                    <div className="col-span-1 flex flex-col justify-end">
                      <div className="flex items-center space-x-2 h-10">
                        <Switch
                          id="show-estadoMateriaUsuario"
                          checked={filtersPlan.showEstadoMateriaUsuario}
                          onCheckedChange={handleShowMateriaStatusChange}
                          disabled={!filtroEstadoHabilitado}
                        />
                        <Label htmlFor="show-estadoMateriaUsuario" className="text-gray-700">
                          Mostrar Estado de Materia
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Materias por Año y Cuatrimestre */}
            <Accordion type="multiple" className="w-full">
              {Object.keys(materiasAgrupadas)
                .map(Number)
                .sort((a, b) => a - b)
                .map((anio) => (
                  <div key={anio}>
                    <AccordionItem value={`anio-${anio}`} className="border-none">
                      <AccordionTrigger className="flex items-center gap-2 text-2xl font-bold text-gray-900 hover:no-underline">
                        <div className="h-8 w-1 bg-blue-600 rounded"></div>
                        {`${anio}°`} Año
                        {/* Removed redundant ChevronDown */}
                      </AccordionTrigger>
                      <AccordionContent className="pl-4 space-y-4">
                        <Accordion type="multiple" className="w-full">
                          {Object.keys(materiasAgrupadas[anio])
                            .map(Number)
                            .sort((a, b) => a - b)
                            .map((cuatrimestreCursada) => (
                              <AccordionItem
                                key={`${anio}-${cuatrimestreCursada}`}
                                value={`cuatrimestreCursada-${anio}-${cuatrimestreCursada}`}
                                className="border-none"
                              >
                                <AccordionTrigger className="flex items-center gap-2 text-lg font-semibold text-gray-800 hover:no-underline">
                                  <div className="h-6 w-1 bg-green-500 rounded"></div>
                                  {getNombreCuatrimestre(cuatrimestreCursada)}
                                  {/* Removed redundant ChevronDown */}
                                </AccordionTrigger>
                                <AccordionContent className="pl-4">
                                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {materiasAgrupadas[anio][cuatrimestreCursada].map((materia) => {
                                      return (
                                        <Card
                                          key={materia.codigoMateria}
                                          id={`materia-${materia.codigoMateria}`}
                                          className={`border-l-4 border-l-blue-200 transition-all duration-500 bg-white shadow-sm ${
                                            materiaResaltada === materia.codigoMateria
                                              ? 'ring-2 ring-blue-500 shadow-lg bg-blue-50'
                                              : ''
                                          }`}
                                        >
                                          <CardHeader className="pb-3">
                                            <div className="flex justify-between items-start">
                                              <div>
                                                <CardTitle className="text-base text-gray-900">
                                                  {materia.nombreMateria}
                                                </CardTitle>
                                                <CardDescription className="font-mono text-sm text-gray-600">
                                                  {materia.codigoMateria}
                                                </CardDescription>
                                              </div>
                                              <div className="flex flex-col items-end gap-1">
                                                <Badge
                                                  variant="secondary"
                                                  className="flex items-center gap-1 bg-gray-100 text-gray-800"
                                                >
                                                  <Clock className="h-3 w-3" />
                                                  {materia.horasSemanales}h
                                                </Badge>
                                                {filtersPlan.showEstadoMateriaUsuario &&
                                                  isLoggedIn &&
                                                  materia.estado && (
                                                    <Badge className={`text-xs ${getStatusBadgeColor(materia.estado)}`}>
                                                      {materia.estado}
                                                    </Badge>
                                                  )}
                                              </div>
                                            </div>
                                          </CardHeader>
                                          <CardContent className="pt-0">
                                            {/* Correlativas */}
                                            {filtersPlan.showCorrelativasMateria &&
                                              materia.listaCorrelativas.length > 0 && (
                                                <div>
                                                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                                                    Correlativas:
                                                  </h4>
                                                  <div className="space-y-1">
                                                    {materia.listaCorrelativas.map((correlativa) => (
                                                      <Button
                                                        key={correlativa.codigoMateria}
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => navegarACorrelativa(correlativa.codigoMateria)}
                                                        className="text-left break-words whitespace-normal text-xs bg-gray-100 hover:bg-blue-100 border-gray-300 px-2 py-1 h-auto"
                                                      >
                                                        {`${correlativa.codigoMateria} - ${correlativa.nombreMateria}`}
                                                      </Button>
                                                    ))}
                                                  </div>
                                                </div>
                                              )}
                                            {filtersPlan.showCorrelativasMateria &&
                                              materia.listaCorrelativas.length === 0 && (
                                                <div className="text-xs text-gray-500 italic">Sin correlativas</div>
                                              )}
                                            {!filtersPlan.showCorrelativasMateria && (
                                              <div className="text-xs text-gray-500 italic">Correlativas ocultas</div>
                                            )}

                                            {/* Botón Ver Detalles */}
                                            <Link href={`/materias/${materia.codigoMateria}`} className="block mt-3">
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full text-xs bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
                                              >
                                                <BookOpen className="h-3 w-3 mr-1" />
                                                Ver Detalles
                                              </Button>
                                            </Link>
                                          </CardContent>
                                        </Card>
                                      )
                                    })}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                        </Accordion>
                      </AccordionContent>
                    </AccordionItem>
                    <Separator className="bg-gray-200" />
                  </div>
                ))}
            </Accordion>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
