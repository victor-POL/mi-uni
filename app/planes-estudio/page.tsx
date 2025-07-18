"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, LogOut, BookOpen, Clock, Filter, Search, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { planesDeEstudio } from "@/data/planes-estudio.data"
import { getNombreCuatrimestre } from "@/utils/utils"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import type { MateriaPlanEstudio, EstadoMateriaPlanEstudio } from "@/models/materias.model"
import type { PlanDeEstudioDetalle } from "@/models/plan-estudio.model"
import { Separator } from "@/components/ui/separator"

export default function PlanesEstudioPage() {
  const [selectedPlanId, setSelectedPlanId] = useState<string>("0")
  const [planConsultado, setPlanConsultado] = useState<PlanDeEstudioDetalle | null>(null)
  const [materiaResaltada, setMateriaResaltada] = useState<string | null>(null)

  // Filter states
  const [filterYear, setFilterYear] = useState<string>("0")
  const [filterCuatrimestre, setFilterCuatrimestre] = useState<string>("0")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [filterStatus, setFilterStatus] = useState<string>("0")
  const [filterHours, setFilterHours] = useState<string>("")
  const [correlativeSearchInput, setCorrelativeSearchInput] = useState<string>("")
  const [correlativeMateriasHabilitadas, setCorrelativeMateriasHabilitadas] = useState<MateriaPlanEstudio[] | null>(
    null,
  )

  // Display toggles
  const [showMateriaStatus, setShowMateriaStatus] = useState<boolean>(true)
  const [showCorrelatives, setShowCorrelatives] = useState<boolean>(true)

  const handleConsultar = () => {
    if (selectedPlanId) {
      const plan = planesDeEstudio.find((p) => p.idPlan.toString() === selectedPlanId)
      setPlanConsultado(plan || null)
      // Reset filters when a new plan is selected
      setFilterYear("0")
      setFilterCuatrimestre("0")
      setSearchTerm("")
      setFilterStatus("0")
      setFilterHours("")
      setCorrelativeSearchInput("")
      setCorrelativeMateriasHabilitadas(null)
    }
  }

  const handleLogout = () => {
    window.location.href = "/"
  }

  // Función para obtener el nombre de la materia por ID
  const getNombreMateriaById = (codigoMateria: string): string => {
    if (!planConsultado) return ""
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

  const handleCorrelativeSearch = () => {
    if (!planConsultado || !correlativeSearchInput) {
      setCorrelativeMateriasHabilitadas(null)
      return
    }

    const lowerCaseCorrelativeSearch = correlativeSearchInput.toLowerCase()
    const foundCorrelativeMateria = planConsultado.materias.find(
      (materia) =>
        materia.nombreMateria.toLowerCase().includes(lowerCaseCorrelativeSearch) ||
        materia.codigoMateria.toLowerCase().includes(lowerCaseCorrelativeSearch),
    )

    if (foundCorrelativeMateria) {
      const habilitadas = planConsultado.materias.filter((materia) =>
        materia.listaCorrelativas.includes(foundCorrelativeMateria.codigoMateria),
      )
      setCorrelativeMateriasHabilitadas(habilitadas)
    } else {
      setCorrelativeMateriasHabilitadas([]) // No correlative found, show empty
    }
  }

  const handleClearCorrelativeSearch = () => {
    setCorrelativeSearchInput("")
    setCorrelativeMateriasHabilitadas(null)
  }

  const allYears = useMemo(() => {
    if (!planConsultado) return []
    return [...new Set(planConsultado.materias.map((m) => m.anioCursada))].sort((a, b) => a - b)
  }, [planConsultado])

  const allStatuses: EstadoMateriaPlanEstudio[] = ["Pendiente", "En Curso", "En Final", "Aprobada", "Regularizada"]

  const filteredMaterias = useMemo(() => {
    if (!planConsultado) return []

    let currentMaterias = planConsultado.materias

    // If correlative search is active and has results, use those.
    // If it's active but has no results (empty array), then show empty.
    // If it's not active (null), then proceed with general filters.
    if (correlativeMateriasHabilitadas !== null) {
      return correlativeMateriasHabilitadas
    }

    // Apply general filters only if correlative search is not active
    // Filter by year
    if (filterYear !== "0") {
      currentMaterias = currentMaterias.filter((materia) => materia.anioCursada.toString() === filterYear)
    }

    // Filter by cuatrimestre
    if (filterCuatrimestre !== "0") {
      currentMaterias = currentMaterias.filter(
        (materia) => materia.cuatrimestreCursada.toString() === filterCuatrimestre,
      )
    }

    // Filter by search term (name or code)
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase()
      currentMaterias = currentMaterias.filter(
        (materia) =>
          materia.nombreMateria.toLowerCase().includes(lowerCaseSearchTerm) ||
          materia.codigoMateria.toLowerCase().includes(lowerCaseSearchTerm),
      )
    }

    // Filter by status
    if (filterStatus !== "0") {
      currentMaterias = currentMaterias.filter((materia) => materia.estado === filterStatus)
    }

    // Filter by hours
    if (filterHours) {
      const hours = Number.parseInt(filterHours)
      if (!isNaN(hours)) {
        currentMaterias = currentMaterias.filter((materia) => materia.horasSemanales === hours)
      }
    }

    return currentMaterias
  }, [
    planConsultado,
    filterYear,
    filterCuatrimestre,
    searchTerm,
    filterStatus,
    filterHours,
    correlativeMateriasHabilitadas,
  ])

  const materiasAgrupadas = useMemo(() => agruparMaterias(filteredMaterias), [filteredMaterias])

  const navegarACorrelativa = (codigoMateria: string) => {
    setMateriaResaltada(codigoMateria)
    const element = document.getElementById(`materia-${codigoMateria}`)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" })
      setTimeout(() => setMateriaResaltada(null), 3000)
    }
  }

  const getStatusBadgeVariant = (status: EstadoMateriaPlanEstudio) => {
    switch (status) {
      case "Aprobada":
        return "default" // Green-ish by default
      case "Regularizada":
        return "secondary" // Gray-ish
      case "En Curso":
        return "outline" // Bordered
      case "En Final":
        return "destructive" // Red-ish
      case "Pendiente":
      default:
        return "default" // Default for pending, can be changed
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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Planes de Estudio</h1>
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
            <CardTitle>Consultar Plan de Estudio</CardTitle>
            <CardDescription>Selecciona un plan de estudio para ver su estructura completa</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1 max-w-md">
                <Label
                  htmlFor="plan-select"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Plan de Estudio
                </Label>
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
              <Button onClick={handleConsultar} disabled={!selectedPlanId || selectedPlanId === "0"} className="px-8">
                Consultar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Filtros y Opciones de Visualización */}
        {planConsultado && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros y Opciones de Visualización
              </CardTitle>
              <CardDescription>
                Filtra las materias por año, cuatrimestre, nombre, estado u horas. También puedes ajustar la
                visualización.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* Filter by Year */}
                <div>
                  <Label
                    htmlFor="filter-year"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Año
                  </Label>
                  <Select value={filterYear} onValueChange={setFilterYear}>
                    <SelectTrigger id="filter-year">
                      <SelectValue placeholder="Todos los años" />
                    </SelectTrigger>
                    <SelectContent>
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
                  <Label
                    htmlFor="filter-cuatrimestre"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Cuatrimestre
                  </Label>
                  <Select value={filterCuatrimestre} onValueChange={setFilterCuatrimestre}>
                    <SelectTrigger id="filter-cuatrimestre">
                      <SelectValue placeholder="Todos los cuatrimestres" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Todos los cuatrimestres</SelectItem>
                      <SelectItem value="1">Primer Cuatrimestre</SelectItem>
                      <SelectItem value="2">Segundo Cuatrimestre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Search by Name/Code */}
                <div>
                  <Label
                    htmlFor="search-term"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Buscar Materia
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="search-term"
                      placeholder="Nombre o código"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                    {searchTerm && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400 hover:bg-transparent"
                        onClick={() => setSearchTerm("")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Filter by Status */}
                <div>
                  <Label
                    htmlFor="filter-status"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Estado
                  </Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger id="filter-status">
                      <SelectValue placeholder="Todos los estados" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Todos los estados</SelectItem>
                      {allStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Filter by Hours */}
                <div>
                  <Label
                    htmlFor="filter-hours"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Horas Semanales
                  </Label>
                  <Input
                    id="filter-hours"
                    type="number"
                    placeholder="Ej: 4"
                    value={filterHours}
                    onChange={(e) => setFilterHours(e.target.value)}
                  />
                </div>

                {/* Toggle Show Materia Status */}
                <div className="flex items-center space-x-2 mt-2">
                  <Switch id="show-status" checked={showMateriaStatus} onCheckedChange={setShowMateriaStatus} />
                  <Label htmlFor="show-status">Mostrar Estado de Materia</Label>
                </div>

                {/* Toggle Show Correlatives */}
                <div className="flex items-center space-x-2 mt-2">
                  <Switch id="show-correlatives" checked={showCorrelatives} onCheckedChange={setShowCorrelatives} />
                  <Label htmlFor="show-correlatives">Mostrar Correlativas</Label>
                </div>
              </div>

              {/* Correlative Search */}
              <div className="mt-6 pt-4 border-t dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Buscar Materias Habilitadas por Correlativa
                </h3>
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <Label
                      htmlFor="correlative-search"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Materia Correlativa
                    </Label>
                    <Input
                      id="correlative-search"
                      placeholder="Nombre o código de la correlativa"
                      value={correlativeSearchInput}
                      onChange={(e) => setCorrelativeSearchInput(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleCorrelativeSearch} disabled={!correlativeSearchInput}>
                    <Search className="h-4 w-4 mr-2" />
                    Buscar Habilitadas
                  </Button>
                  {correlativeMateriasHabilitadas !== null && (
                    <Button variant="outline" onClick={handleClearCorrelativeSearch}>
                      <X className="h-4 w-4 mr-2" />
                      Limpiar
                    </Button>
                  )}
                </div>
                {correlativeMateriasHabilitadas && correlativeMateriasHabilitadas.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    No se encontraron materias habilitadas por la correlativa ingresada o la correlativa no existe.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Resultado del Plan */}
        {planConsultado && (
          <div className="space-y-6">
            {/* Estadísticas del Plan */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{`${planConsultado.nombreCarrera} - Año ${planConsultado.anio}`}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{planConsultado.materias.length}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Materias</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {planConsultado.materias.reduce((sum, m) => sum + (m.horasSemanales || 0), 0)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Horas Totales</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.max(...planConsultado.materias.map((m) => m.anioCursada))}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Años de Duración</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">
                      {planConsultado.materias.filter((m) => m.listaCorrelativas.length === 0).length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Sin Correlativas</div>
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
                    <AccordionItem  value={`anio-${anio}`} className="border-none">
                      <AccordionTrigger className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white hover:no-underline">
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
                                <AccordionTrigger className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-gray-200 hover:no-underline">
                                  <div className="h-6 w-1 bg-green-500 rounded"></div>
                                  {getNombreCuatrimestre(cuatrimestre)}
                                  {/* Removed redundant ChevronDown */}
                                </AccordionTrigger>
                                <AccordionContent className="pl-4">
                                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {materiasAgrupadas[anio][cuatrimestre].map((materia) => (
                                      <Card
                                        key={materia.codigoMateria}
                                        id={`materia-${materia.codigoMateria}`}
                                        className={`border-l-4 border-l-blue-200 transition-all duration-500 ${
                                          materiaResaltada === materia.codigoMateria
                                            ? "ring-2 ring-blue-500 shadow-lg bg-blue-50 dark:bg-blue-900/20"
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
                                            <div className="flex flex-col items-end gap-1">
                                              <Badge variant="secondary" className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {materia.horasSemanales}h
                                              </Badge>
                                              {showMateriaStatus && (
                                                <Badge
                                                  variant={getStatusBadgeVariant(materia.estado)}
                                                  className="text-xs"
                                                >
                                                  {materia.estado}
                                                </Badge>
                                              )}
                                            </div>
                                          </div>
                                        </CardHeader>
                                        <CardContent className="pt-0">
                                          {/* Correlativas */}
                                          {showCorrelatives && materia.listaCorrelativas.length > 0 && (
                                            <div>
                                              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Correlativas:
                                              </h4>
                                              <div className="space-y-1">
                                                {materia.listaCorrelativas.map((codigoCorrelativa) => (
                                                  <Button
                                                    key={codigoCorrelativa}
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => navegarACorrelativa(codigoCorrelativa)}
                                                    className="text-left break-words whitespace-normal text-xs bg-gray-100 hover:bg-blue-100 dark:bg-gray-800 dark:hover:bg-blue-900 px-2 py-1 h-auto"
                                                  >
                                                    {getNombreMateriaById(codigoCorrelativa)}
                                                  </Button>
                                                ))}
                                              </div>
                                            </div>
                                          )}
                                          {showCorrelatives && materia.listaCorrelativas.length === 0 && (
                                            <div className="text-xs text-gray-500 dark:text-gray-400 italic">
                                              Sin correlativas
                                            </div>
                                          )}
                                          {!showCorrelatives && (
                                            <div className="text-xs text-gray-500 dark:text-gray-400 italic">
                                              Correlativas ocultas
                                            </div>
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
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                        </Accordion>
                      </AccordionContent>
                    </AccordionItem>
                    <Separator />
                  </div>
                ))}
            </Accordion>
          </div>
        )}

        {/* Estado inicial */}
        {!planConsultado && (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Selecciona un Plan de Estudio</h3>
              <p className="text-gray-600 dark:text-gray-400">
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
