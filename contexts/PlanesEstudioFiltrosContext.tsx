'use client'

import { createContext, useContext, useMemo } from 'react'
import { usePlanesEstudioFiltros } from '@/hooks/use-planes-estudio-filtros'
import type { PlanDeEstudioDetalle } from '@/models/plan-estudio.model'
import type { ReactNode } from 'react'

interface PlanesEstudioFiltrosContextType {
  isLoggedIn: boolean
  showFilters: boolean
  setShowFilters: (show: boolean) => void
  filtersPlan: {
    nombreMateria: string
    anioCursada: string
    cuatrimestreCursada: string
    horasSemanales: string
    nombreCorrelativa: string
    estadoMateriaUsuario: string
    showCorrelativasMateria: boolean
    showEstadoMateriaUsuario: boolean
  }
  filtroEstadoHabilitado: boolean
  aniosDisponiblesFiltro: number[]
  estadosMateriasDisponiblesFiltro: string[]
  materiasAgrupadas: Record<number, Record<number, any[]>>
  cantidadFiltrosActivos: number
  hasActiveFilters: boolean
  handleFilterYearChange: (value: string) => void
  handleFilterCuatrimestreChange: (value: string) => void
  handleSearchTermChange: (value: string) => void
  handleFilterCorrelativaChange: (value: string) => void
  handleFilterStatusChange: (value: string) => void
  handleFilterHoursChange: (value: string) => void
  handleShowMateriaStatusChange: (checked: boolean) => void
  handleShowCorrelativesChange: (checked: boolean) => void
  handleClearAllFilters: () => void
  resetFilters: () => void
  initialPlanFilters: {
    anioCursada: string
    cuatrimestreCursada: string
    estadoMateriaUsuario: string
  }
}

const PlanesEstudioFiltrosContext = createContext<PlanesEstudioFiltrosContextType | undefined>(undefined)

interface PlanesEstudioFiltrosProviderProps {
  plan: PlanDeEstudioDetalle | null
  isLoggedIn: boolean
  children: ReactNode
}

export function PlanesEstudioFiltrosProvider({
  plan,
  isLoggedIn,
  children,
}: Readonly<PlanesEstudioFiltrosProviderProps>) {
  const filtrosData = usePlanesEstudioFiltros({
    detallePlanConsultado: plan,
    isLoggedIn,
  })

  const contextValue: PlanesEstudioFiltrosContextType = useMemo(
    () => ({
      isLoggedIn,
      ...filtrosData,
    }),
    [isLoggedIn, filtrosData]
  )

  return <PlanesEstudioFiltrosContext.Provider value={contextValue}>{children}</PlanesEstudioFiltrosContext.Provider>
}

export function usePlanesEstudioFiltrosContext() {
  const context = useContext(PlanesEstudioFiltrosContext)
  if (context === undefined) {
    throw new Error('usePlanesEstudioFiltrosContext debe ser usado dentro de un PlanesEstudioFiltrosProvider')
  }
  return context
}
