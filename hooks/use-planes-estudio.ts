/* ---------------------------------- HOOKS --------------------------------- */
import { useState, useEffect } from 'react'
/* --------------------------------- MODELS --------------------------------- */
import type { ApiResponse } from '@/models/api/api.model'
import type { PlanEstudioAPIResponse, PlanEstudioDetalleAPIResponse } from '@/models/api/planes-estudio.model'
import type { PlanDeEstudioDetalle, PlanEstudio } from '@/models/plan-estudio.model'
/* -------------------------------- ADAPTERS -------------------------------- */
import {
  adaptPlanesEstudioAPIResponseToLocal,
  transformPlanAPIResponseToLocal,
} from '@/adapters/planes-estudio.adapter'

interface UsePlanesEstudioOptions {
  planId: number | null
  usuarioId?: number | null
  autoFetch?: boolean
}

/**
 * Hook para obtener el detalle de un paln de estudio
 * @param options - Opciones del hook
 * @param options.planId - ID del plan de estudio a obtener su detalle
 * @param options.usuarioId - ID del usuario (opcional) para obtener el progreso
 * @param options.autoFetch - Si se debe hacer fetch automáticamente al montar el hook (si cambia su valor se vuelve a hacer fetch)
 * @returns Hook con el detalle del plan de estudio, loading, loading, error y método de refetch
 */
export function useDetallePlanEstudio(options: UsePlanesEstudioOptions = { planId: null, autoFetch: true }) {
  const [detallePlan, setDetallePlan] = useState<PlanDeEstudioDetalle | null>(null)
  const [loading, setLoading] = useState(options.autoFetch)
  const [error, setError] = useState<string | null>(null)

  const fetchPlanes = async () => {
    setLoading(true)
    setError(null)

    try {
      if (!options.planId) {
        throw new Error('Se requiere un planId para obtener información detallada')
      }

      let url = `/api/planes-estudio/${options.planId}`
      if (options.usuarioId) {
        url += `?userId=${options.usuarioId}`
      }

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: ApiResponse<PlanEstudioDetalleAPIResponse> = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch data')
      }

      const detalleFormatted: PlanDeEstudioDetalle = transformPlanAPIResponseToLocal(result.data)

      setDetallePlan(detalleFormatted)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
      setError(errorMessage)
      console.error('Error fetching plan detalle:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (options.autoFetch && options.planId) {
      // Limpiar el plan anterior cuando cambia el planId
      setDetallePlan(null)
      setError(null)

      fetchPlanes()
    }
  }, [options.planId, options.usuarioId, options.autoFetch])

  return {
    detallePlan,
    loading,
    error,
    refetch: fetchPlanes,
  }
}

interface UsePlanesEstudioListadoOptions {
  carreraId?: number | null
  autoFetch?: boolean
}

/**
 * Hook para obtener listado de planes de estudio
 * @param options - Opciones del hook
 * @param options.carreraId - ID de la carrera (opcional). Si se proporciona, obtiene planes de esa carrera específica
 * @param options.autoFetch - Si se debe hacer fetch automáticamente al montar el hook (si cambia su valor se vuelve a hacer fetch) * @return Hook con la lista de planes, loading, error y métodos de refetch
 */
export function usePlanesEstudio(options: UsePlanesEstudioListadoOptions = {}) {
  const [planes, setPlanes] = useState<PlanEstudio[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPlanes = async () => {
    setLoading(true)
    setError(null)

    try {
      // Construir URL según si se especifica carreraId o no
      const url = options.carreraId ? `/api/planes-estudio?carreraId=${options.carreraId}` : '/api/planes-estudio'

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: ApiResponse<PlanEstudioAPIResponse[]> = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch data')
      }

      const formattedPlanes: PlanEstudio[] = adaptPlanesEstudioAPIResponseToLocal(result.data)

      setPlanes(formattedPlanes)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
      setError(errorMessage)
      console.error('Error fetching planes:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (options.autoFetch && (options.carreraId || !options.carreraId)) {
      fetchPlanes()
    }
  }, [options.carreraId, options.autoFetch])

  return {
    planes,
    loading,
    error,
    refetch: fetchPlanes,
  }
}

/**
 * Hook específico para obtener listado básico de todos los planes
 * Hara autofetch automáticamente
 * @returns Hook con lista básica de planes, loading, error y métodos de refetch
 */
export function useAllPlanes() {
  return usePlanesEstudio({ carreraId: null, autoFetch: true })
}

/**
 * Hook específico para obtener listado de planes de estudio de una carrera específica
 * @param carreraId - ID de la carrera para obtener sus planes
 * @param autoFetch - Si el hook debe hacer fetch automáticamente (por defecto true)
 * @return Hook con la lista de planes, loading, error y métodos de refetch
 */
export function usePlanesCarrera(carreraId: number | null, autoFetch: boolean = true) {
  return usePlanesEstudio({ carreraId, autoFetch })
}
