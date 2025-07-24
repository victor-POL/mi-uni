'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Clock, Filter, Search, X, User } from 'lucide-react'
import { AppLayout } from '@/components/AppLayout'
import { planesDeEstudio } from '@/data/planes-estudio.data'
import { getNombreCuatrimestre } from '@/utils/utils'
import { Input } from '@/components/ui/input'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'
import type { MateriaPlanEstudio, EstadoMateriaPlanEstudio } from '@/models/materias.model'
import type { PlanDeEstudioDetalle } from '@/models/plan-estudio.model'
import { Separator } from '@/components/ui/separator'
import { usePlanesSummary } from '@/hooks/use-planes-estudio'

interface PlanesEstudioFilters {
  year: string
  semester: string
  search: string
  status: string
  hours: string
  showStatus: boolean
  showCorrelatives: boolean
  searchCorrelativa: string
}

const initialPlanFilters: PlanesEstudioFilters = {
  year: '0',
  semester: '0',
  search: '',
  status: '0',
  hours: '',
  showStatus: true,
  showCorrelatives: true,
  searchCorrelativa: '',
}

export default function PlanesEstudioPage() {
  // Hook de autenticación
  const { user, isUserInitialized } = useAuth()

  // Hook para obtener planes disponibles (solo summary)
  const { planes: planesDisponibles, loading: isLoadingPlanes, fetchPlanById } = usePlanesSummary()

  // Estados para el plan seleccionado
  const [selectedPlanId, setSelectedPlanId] = useState<string>('')
  const [planConsultado, setPlanConsultado] = useState<PlanDeEstudioDetalle | null>(null)
  const [materiaResaltada, setMateriaResaltada] = useState<string | null>(null)

  // Loading state para detalles del plan
  const [isLoadingPlanDetails, setIsLoadingPlanDetails] = useState(false)

  // Filter states - will be synchronized with URL params via useEffect
  const [filtersPlan, setFiltersPlan] = useState(initialPlanFilters)

  // Local UI state for showing/hiding filters section
  const [showFilters, setShowFilters] = useState<boolean>(false)

  // Helper para verificar si el usuario está logueado
  const isLoggedIn = user !== null && isUserInitialized

  const handleSelectedPlanIdChange = (value: string) => {
    setSelectedPlanId(value)
  }

  // Wrapper functions to update both state and URL
  const handleFilterYearChange = (value: string) => {
    setFiltersPlan((prev) => ({ ...prev, year: value }))
  }

  const handleFilterCuatrimestreChange = (value: string) => {
    setFiltersPlan((prev) => ({ ...prev, semester: value }))
  }

  const handleSearchTermChange = (value: string) => {
    setFiltersPlan((prev) => ({ ...prev, search: value }))
  }

  const handleFilterCorrelativaChange = (value: string) => {
    setFiltersPlan((prev) => ({ ...prev, searchCorrelativa: value }))
  }

  const handleFilterStatusChange = (value: string) => {
    if (!isLoggedIn) return // No permitir cambios si no está logueado
    setFiltersPlan((prev) => ({ ...prev, status: value }))
  }

  const handleFilterHoursChange = (value: string) => {
    setFiltersPlan((prev) => ({ ...prev, hours: value }))
  }

  const handleShowMateriaStatusChange = (value: boolean) => {
    if (!isLoggedIn) return
    setFiltersPlan((prev) => ({ ...prev, showStatus: value }))
  }

  const handleShowCorrelativesChange = (value: boolean) => {
    setFiltersPlan((prev) => ({ ...prev, showCorrelatives: value }))
  }

  // Función para obtener el plan completo con todas las materias usando el hook
  const fetchPlanDetallado = async (planId: string) => {
    try {
      setIsLoadingPlanDetails(true)

      const usuarioIdToPass = isLoggedIn && user?.dbId && user.dbId > 0 ? user.dbId : undefined

      const planData = await fetchPlanById(parseInt(planId), usuarioIdToPass)
      setPlanConsultado(planData)

      return planData
    } catch (error) {
      console.error('Error fetching plan details:', error)
      // Fallback a datos estáticos si hay error
      const plan = planesDeEstudio.find((p) => p.idPlan.toString() === planId)
      setPlanConsultado(plan || null)
      return plan || null
    } finally {
      setIsLoadingPlanDetails(false)
    }
  }

  const handleSubmitPlan = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (selectedPlanId) {
      setIsLoadingPlanDetails(true)

      try {
        await fetchPlanDetallado(selectedPlanId)

        setIsLoadingPlanDetails(false)
        setFiltersPlan(initialPlanFilters)
      } catch (error) {
        console.error('Error loading plan:', error)
        setIsLoadingPlanDetails(false)
      }
    }
  }

  // Función para obtener el nombre de la materia por ID
  const getNombreMateriaById = (codigoMateria: string): string => {
    if (!planConsultado) return ''
    const materia = planConsultado.materias.find((m) => m.codigoMateria === codigoMateria)
    return materia ? `${materia.codigoMateria} - ${materia.nombreMateria}` : `Código: ${codigoMateria}`
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

  const handleClearAllFilters = () => {
    setFiltersPlan(initialPlanFilters)
  }

  const allYears = useMemo(() => {
    if (!planConsultado) return []
    return [...new Set(planConsultado.materias.map((m) => m.anioCursada))].sort((a, b) => a - b)
  }, [planConsultado])

  const allStatuses: EstadoMateriaPlanEstudio[] = ['Pendiente', 'En Curso', 'En Final', 'Aprobada', 'Regularizada']

  const filteredMaterias = useMemo(() => {
    if (!planConsultado) return []

    let currentMaterias = planConsultado.materias

    // Filter by year
    if (filtersPlan.year !== initialPlanFilters.year) {
      currentMaterias = currentMaterias.filter((materia) => materia.anioCursada.toString() === filtersPlan.year)
    }

    // Filter by cuatrimestre
    if (filtersPlan.semester !== initialPlanFilters.semester) {
      if (filtersPlan.semester === 'anual') {
        currentMaterias = currentMaterias.filter((materia) => materia.cuatrimestreCursada === 0)
      } else {
        currentMaterias = currentMaterias.filter(
          (materia) => materia.cuatrimestreCursada.toString() === filtersPlan.semester
        )
      }
    }

    // Filter by search term (name or code)
    if (filtersPlan.search) {
      const lowerCaseSearchTerm = filtersPlan.search.toLowerCase()
      currentMaterias = currentMaterias.filter(
        (materia) =>
          materia.nombreMateria.toLowerCase().includes(lowerCaseSearchTerm) ||
          materia.codigoMateria.toLowerCase().includes(lowerCaseSearchTerm)
      )
    }

    // Filter by status (solo si está logueado)
    if (filtersPlan.status !== initialPlanFilters.status && isLoggedIn) {
      currentMaterias = currentMaterias.filter((materia) => materia.estado === filtersPlan.status)
    }

    // Filter by hours
    if (filtersPlan.hours) {
      const hours = Number.parseInt(filtersPlan.hours)
      if (!Number.isNaN(hours)) {
        currentMaterias = currentMaterias.filter((materia) => materia.horasSemanales === hours)
      }
    }

    // Filter by correlative search - dynamic filtering
    if (filtersPlan.searchCorrelativa) {
      const lowerCaseCorrelativeSearch = filtersPlan.searchCorrelativa.toLowerCase()

      // Find the correlative materia being searched
      const foundCorrelativeMateria = planConsultado.materias.find(
        (materia) =>
          materia.nombreMateria.toLowerCase().includes(lowerCaseCorrelativeSearch) ||
          materia.codigoMateria.toLowerCase().includes(lowerCaseCorrelativeSearch)
      )

      if (foundCorrelativeMateria) {
        // Filter to show only materias that have this correlative
        currentMaterias = currentMaterias.filter((materia) =>
          materia.listaCorrelativas.includes(foundCorrelativeMateria.codigoMateria)
        )
      } else {
        // No correlative found, show empty results
        currentMaterias = []
      }
    }

    return currentMaterias
  }, [planConsultado, filtersPlan, isLoggedIn])

  const materiasAgrupadas = useMemo(() => agruparMaterias(filteredMaterias), [filteredMaterias])

  // Check if any filters are active
  const cantidadFiltrosActivos = useMemo(() => {
    return [
      filtersPlan.year !== initialPlanFilters.year,
      filtersPlan.semester !== initialPlanFilters.semester,
      filtersPlan.search !== initialPlanFilters.search,
      filtersPlan.status !== initialPlanFilters.status,
      filtersPlan.hours !== initialPlanFilters.hours,
      !isLoggedIn ? false : filtersPlan.showStatus !== initialPlanFilters.showStatus,
      filtersPlan.showCorrelatives !== initialPlanFilters.showCorrelatives,
      filtersPlan.searchCorrelativa !== initialPlanFilters.searchCorrelativa,
    ].filter(Boolean).length
  }, [filtersPlan, isLoggedIn])

  const hasActiveFilters = useMemo(() => cantidadFiltrosActivos > 0, [cantidadFiltrosActivos])

  const navegarACorrelativa = (codigoMateria: string) => {
    setMateriaResaltada(codigoMateria)
    const element = document.getElementById(`materia-${codigoMateria}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      setTimeout(() => setMateriaResaltada(null), 3000)
    }
  }

  const getStatusBadgeColor = (status: EstadoMateriaPlanEstudio) => {
    switch (status) {
      case 'Aprobada':
        return 'bg-green-100 text-green-800'
      case 'En Final':
        return 'bg-purple-100 text-purple-800'
      case 'En Curso':
        return 'bg-blue-100 text-blue-800'
      case 'Pendiente':
        return 'bg-red-100 text-red-800'
      case 'Regularizada':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Generate default open values for Accordions
  const defaultOpenYears = useMemo(() => {
    if (!planConsultado) return []
    return Object.keys(materiasAgrupadas).map((anio) => `anio-${anio}`)
  }, [materiasAgrupadas, planConsultado])

  const defaultOpenCuatrimestres = useMemo(() => {
    if (!planConsultado) return []
    const cuatrimestresToOpen: string[] = []
    Object.keys(materiasAgrupadas).forEach((anio) => {
      Object.keys(materiasAgrupadas[Number(anio)]).forEach((cuatrimestre) => {
        cuatrimestresToOpen.push(`cuatrimestre-${anio}-${cuatrimestre}`)
      })
    })
    return cuatrimestresToOpen
  }, [materiasAgrupadas, planConsultado])

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
                Luego de consultar un plan, podrás filtrar las materias por año, cuatrimestre, nombre, estado u horas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Fila 1  - Label y Select*/}
              <div className="grid gap-2">
                <div>
                  <Label htmlFor="plan-select" className="block text-sm font-medium text-gray-700 mb-2">
                    Plan de Estudio
                  </Label>
                  <Select value={selectedPlanId} onValueChange={handleSelectedPlanIdChange} disabled={isLoadingPlanes}>
                    <SelectTrigger className="bg-white border-gray-300">
                      <SelectValue
                        placeholder={isLoadingPlanes ? 'Cargando planes...' : 'Selecciona un plan de estudio'}
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-300">
                      {isLoadingPlanes ? (
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
                    disabled={!selectedPlanId || selectedPlanId === '' || isLoadingPlanes || isLoadingPlanDetails}
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
                    {[0, 1, 2].map((cuatrimestre) => (
                      <div key={cuatrimestre} className="space-y-4">
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
        {planConsultado && !isLoadingPlanDetails && (
          <div className="space-y-6">
            {/* Estadísticas del Plan */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900">{`${planConsultado.nombreCarrera} - Año ${planConsultado.anio}`}</CardTitle>
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
                    disabled={planConsultado === null}
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
                      <Label htmlFor="search-term" className="block text-sm font-medium text-gray-700 mb-2">
                        Buscar Materia
                      </Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="search-term"
                          placeholder="Nombre o código"
                          value={filtersPlan.search}
                          onChange={(e) => handleSearchTermChange(e.target.value)}
                          className="pl-9 bg-white border-gray-300"
                        />
                        {filtersPlan.search && (
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
                    <Label htmlFor="filter-year" className="block text-sm font-medium text-gray-700 mb-2">
                      Año
                    </Label>
                    <Select value={filtersPlan.year} onValueChange={handleFilterYearChange}>
                      <SelectTrigger id="filter-year" className="bg-white border-gray-300">
                        <SelectValue placeholder="Todos los años" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-300">
                        <SelectItem value="0">Todos los años</SelectItem>
                        {allYears.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}° Año
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Filter by Cuatrimestre */}
                  <div>
                    <Label htmlFor="filter-cuatrimestre" className="block text-sm font-medium text-gray-700 mb-2">
                      Cuatrimestre
                    </Label>
                    <Select value={filtersPlan.semester} onValueChange={handleFilterCuatrimestreChange}>
                      <SelectTrigger id="filter-cuatrimestre" className="bg-white border-gray-300">
                        <SelectValue placeholder="Todos los cuatrimestres" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-300">
                        <SelectItem value="0">Todos los cuatrimestres</SelectItem>
                        <SelectItem value="anual">Anual</SelectItem>
                        <SelectItem value="1">1° Cuatrimestre</SelectItem>
                        <SelectItem value="2">2° Cuatrimestre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Filter by Hours */}
                  <div>
                    <Label htmlFor="filter-hours" className="block text-sm font-medium text-gray-700 mb-2">
                      Horas Semanales
                    </Label>
                    <Input
                      id="filter-hours"
                      type="number"
                      placeholder="Ej: 4"
                      value={filtersPlan.hours}
                      onChange={(e) => handleFilterHoursChange(e.target.value)}
                      className="bg-white border-gray-300"
                    />
                  </div>

                  {/* Fila - Filtros Correlativa */}
                  <div className="col-span-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Search by Name/Code Correlativa*/}
                    <div className="col-span-1">
                      <Label htmlFor="search-correlativa" className="block text-sm font-medium text-gray-700 mb-2">
                        Buscar Correlativa
                      </Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="search-correlativa"
                          placeholder="Nombre o código de la materia correlativa"
                          value={filtersPlan.searchCorrelativa}
                          onChange={(e) => handleFilterCorrelativaChange(e.target.value)}
                          className="pl-9 bg-white border-gray-300"
                        />
                        {filtersPlan.searchCorrelativa && (
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
                          checked={filtersPlan.showCorrelatives}
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
                      <Label htmlFor="filter-status" className="block text-sm font-medium text-gray-700 mb-2">
                        Estado
                        {!isLoggedIn && (
                          <div className="flex items-center gap-1 mt-1">
                            <User className="h-3 w-3 text-amber-600" />
                            <span className="text-xs text-amber-600">Inicia sesión para filtrar por estado</span>
                          </div>
                        )}
                      </Label>
                      <Select
                        value={filtersPlan.status}
                        onValueChange={handleFilterStatusChange}
                        disabled={!isLoggedIn}
                      >
                        <SelectTrigger id="filter-status" className="bg-white border-gray-300">
                          <SelectValue placeholder={!isLoggedIn ? 'Requiere autenticación' : 'Todos los estados'} />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-300">
                          <SelectItem value="0">Todos los estados</SelectItem>
                          {allStatuses.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Toggle Show Materia Status */}
                    <div className="col-span-1 flex flex-col justify-end">
                      <div className="flex items-center space-x-2 h-10">
                        <Switch
                          id="show-status"
                          checked={filtersPlan.showStatus && isLoggedIn}
                          onCheckedChange={handleShowMateriaStatusChange}
                          disabled={!isLoggedIn}
                        />
                        <Label htmlFor="show-status" className="text-gray-700">
                          Mostrar Estado de Materia
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Materias por Año y Cuatrimestre */}
            <Accordion type="multiple" className="w-full" defaultValue={defaultOpenYears}>
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
                        <Accordion type="multiple" className="w-full" defaultValue={defaultOpenCuatrimestres}>
                          {Object.keys(materiasAgrupadas[anio])
                            .map(Number)
                            .sort((a, b) => a - b)
                            .map((cuatrimestre) => (
                              <AccordionItem
                                key={`${anio}-${cuatrimestre}`}
                                value={`cuatrimestre-${anio}-${cuatrimestre}`}
                                className="border-none"
                              >
                                <AccordionTrigger className="flex items-center gap-2 text-lg font-semibold text-gray-800 hover:no-underline">
                                  <div className="h-6 w-1 bg-green-500 rounded"></div>
                                  {getNombreCuatrimestre(cuatrimestre)}
                                  {/* Removed redundant ChevronDown */}
                                </AccordionTrigger>
                                <AccordionContent className="pl-4">
                                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {materiasAgrupadas[anio][cuatrimestre].map((materia) => {
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
                                                {filtersPlan.showStatus && isLoggedIn && materia.estado && (
                                                  <Badge className={`text-xs ${getStatusBadgeColor(materia.estado)}`}>
                                                    {materia.estado}
                                                  </Badge>
                                                )}
                                              </div>
                                            </div>
                                          </CardHeader>
                                          <CardContent className="pt-0">
                                            {/* Correlativas */}
                                            {filtersPlan.showCorrelatives && materia.listaCorrelativas.length > 0 && (
                                              <div>
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">
                                                  Correlativas:
                                                </h4>
                                                <div className="space-y-1">
                                                  {materia.listaCorrelativas.map((codigoCorrelativa) => (
                                                    <Button
                                                      key={codigoCorrelativa}
                                                      variant="outline"
                                                      size="sm"
                                                      onClick={() => navegarACorrelativa(codigoCorrelativa)}
                                                      className="text-left break-words whitespace-normal text-xs bg-gray-100 hover:bg-blue-100 border-gray-300 px-2 py-1 h-auto"
                                                    >
                                                      {getNombreMateriaById(codigoCorrelativa)}
                                                    </Button>
                                                  ))}
                                                </div>
                                              </div>
                                            )}
                                            {filtersPlan.showCorrelatives && materia.listaCorrelativas.length === 0 && (
                                              <div className="text-xs text-gray-500 italic">Sin correlativas</div>
                                            )}
                                            {!filtersPlan.showCorrelatives && (
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
