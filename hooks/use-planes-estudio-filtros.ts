import { useState, useMemo, useEffect } from 'react'
import type { MateriaPlanEstudio, EstadoMateriaPlanEstudio } from '@/models/materias.model'
import type { PlanDeEstudioDetalle } from '@/models/plan-estudio.model'

export interface PlanesEstudioFilters {
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

interface UsePlanesEstudioFiltrosProps {
  detallePlanConsultado: PlanDeEstudioDetalle | null
  isLoggedIn: boolean
}

export function usePlanesEstudioFiltros({ detallePlanConsultado, isLoggedIn }: UsePlanesEstudioFiltrosProps) {
  // Estado de filtros
  const [filtersPlan, setFiltersPlan] = useState(initialPlanFilters)
  const [showFilters, setShowFilters] = useState<boolean>(false)
  const [filtroEstadoHabilitado, setFiltroEstadoHabilitado] = useState<boolean>(false)

  // Estados disponibles para filtrar
  const estadosMateriasDisponiblesFiltro: EstadoMateriaPlanEstudio[] = ['Pendiente', 'En Curso', 'En Final', 'Aprobada']

  // Años disponibles para filtrar
  const aniosDisponiblesFiltro = useMemo(() => {
    if (!detallePlanConsultado) return []
    return [...new Set(detallePlanConsultado.materias.map((m) => m.anioCursada))].sort((a, b) => a - b)
  }, [detallePlanConsultado])

  // Efecto para manejar la habilitación del filtro de estado
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

  // Materias filtradas
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
        materia.nombreMateria.toLowerCase().includes(lowerCaseSearchTerm)
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
  }, [detallePlanConsultado, filtersPlan, filtroEstadoHabilitado])

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
  }, [filtersPlan, filtroEstadoHabilitado])

  // Ver si hay filtros activos
  const hasActiveFilters = useMemo(() => cantidadFiltrosActivos > 0, [cantidadFiltrosActivos])

  // Función para agrupar materias por año y cuatrimestre
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

  // Materias agrupadas
  const materiasAgrupadas = useMemo(() => agruparMaterias(materiasPlanEstudioFiltradas), [materiasPlanEstudioFiltradas])

  // Handlers para cambios en filtros
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

  // Función para resetear filtros cuando cambia el plan
  const resetFilters = () => {
    setFiltersPlan(initialPlanFilters)
  }

  return {
    // Estado
    filtersPlan,
    showFilters,
    setShowFilters,
    filtroEstadoHabilitado,

    // Datos computados
    aniosDisponiblesFiltro,
    estadosMateriasDisponiblesFiltro,
    materiasPlanEstudioFiltradas,
    materiasAgrupadas,
    cantidadFiltrosActivos,
    hasActiveFilters,

    // Handlers
    handleFilterYearChange,
    handleFilterCuatrimestreChange,
    handleSearchTermChange,
    handleFilterCorrelativaChange,
    handleFilterStatusChange,
    handleFilterHoursChange,
    handleShowMateriaStatusChange,
    handleShowCorrelativesChange,
    handleClearAllFilters,
    resetFilters,

    // Constantes
    initialPlanFilters,
  }
}
