import { useState, useEffect } from 'react'
import type { PlanDeEstudioDetalle, PlanEstudio } from '@/models/plan-estudio.model'
import type { PlanEstudioAPIResponse, PlanEstudioDetalleAPIResponse } from '@/models/api/planes-estudio.model'
import type { ApiResponse } from '@/models/api/api.model'

interface UsePlanesEstudioOptions {
  planId?: number
  autoFetch?: boolean
}

interface UsePlanesBasicosOptions {
  autoFetch?: boolean
}

/**
 * Hook para obtener el detalle de un paln de estudio
 * @param options - Opciones del hook
 * @param options.planId - ID del plan de estudio a obtener
 * @param options.autoFetch - Si se debe hacer fetch automáticamente al montar el hook
 * @returns Hook con el plan de estudio, loading, error y métodos de refetch
 */
export function useDetallePlanEstudio(options: UsePlanesEstudioOptions = {}) {
  const [detallePlan, setDetallePlan] = useState<PlanDeEstudioDetalle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPlanes = async () => {
    setLoading(true)
    setError(null)

    try {
      if (!options.planId) {
        throw new Error('Se requiere un planId para obtener información detallada')
      }

      const url = `/api/planes-estudio/${options.planId}`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: ApiResponse<PlanDeEstudioDetalle> = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch data')
      }

      // Siempre es un plan específico, convertir a array para consistencia
      setDetallePlan(result.data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
      setError(errorMessage)
      console.error('Error fetching plan detalle:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (options.autoFetch !== false && options.planId) {
      fetchPlanes()
    }
  }, [options.planId, options.autoFetch])

  return {
    detallePlan,
    loading,
    error,
    refetch: fetchPlanes,
  }
}

/**
 * Hook para obtener listado de planes de estudio
 * @param options - Opciones del hook
 * @param options.autoFetch - Si se debe hacer fetch automáticamente al montar el hook
 * @return Hook con la lista de planes, loading, error y métodos de refetch
 */
export function usePlanesEstudio(options: UsePlanesBasicosOptions = {}) {
  const [planes, setPlanes] = useState<PlanEstudio[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPlanes = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/planes-estudio')

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: ApiResponse<PlanEstudioAPIResponse[]> = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch data')
      }

      // Transformar de API response a modelo interno
      const planesData: PlanEstudio[] = result.data.map((plan) => ({
        idPlan: plan.plan_id,
        nombreCarrera: plan.nombre_carrera,
        anio: plan.anio,
      }))

      setPlanes(planesData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
      setError(errorMessage)
      console.error('Error fetching planes básicos:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (options.autoFetch !== false) {
      fetchPlanes()
    }
  }, [options.autoFetch])

  return {
    planes,
    loading,
    error,
    refetch: fetchPlanes
  }
}

/**
 * Hook específico para obtener un plan por ID con información detallada
 * @param planId - ID del plan de estudio a obtener
 * @returns Hook con el plan específico, loading, error y métodos de refetch
 */
export function usePlanById(planId: number) {
  return useDetallePlanEstudio({ planId, autoFetch: true })
}

/**
 * Hook específico para obtener listado básico de todos los planes
 * @returns Hook con lista básica de planes, loading, error y métodos de refetch
 */
export function useAllPlanes() {
  return usePlanesEstudio({ autoFetch: true })
}

/**
 * Helper para hacer fetch manual de un plan específico
 * @param planId - ID del plan de estudio
 * @param usuarioId - ID del usuario (opcional) para obtener el progreso
 * @returns Promise con los datos del plan
 */
export async function fetchPlanById(planId: number, usuarioId?: number): Promise<PlanEstudioDetalleAPIResponse> {
  try {
    let url = `/api/planes-estudio/${planId}`
    if (usuarioId) {
      url += `?usuarioId=${usuarioId}`
    }

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<PlanEstudioDetalleAPIResponse> = await response.json()
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch plan')
    }

    return result.data
  } catch (error) {
    console.error('Error fetching plan by ID:', error)
    throw error
  }
}
