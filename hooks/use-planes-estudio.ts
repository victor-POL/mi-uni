import { useState, useEffect } from 'react'
import type { PlanDeEstudioDetalle, PlanEstudio } from '@/models/plan-estudio.model'
import type { PlanEstudioAPIResponse, PlanEstudioDetalleAPIResponse } from '@/models/api/planes-estudio.model'

interface ApiResponse<T> {
  success: boolean
  data: T
  count?: number
  error?: string
  message?: string
}

interface UsePlanesEstudioOptions {
  planId?: number
  autoFetch?: boolean
}

interface UsePlanesBasicosOptions {
  autoFetch?: boolean
}

/**
 * Hook para obtener planes de estudio con información detallada
 */
export function usePlanesEstudio(options: UsePlanesEstudioOptions = {}) {
  const [planes, setPlanes] = useState<PlanDeEstudioDetalle[]>([])
  const [loading, setLoading] = useState(false)
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
      setPlanes([result.data])
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
    planes,
    loading,
    error,
    refetch: fetchPlanes,
    getPlan: (id: number) => planes.find((plan) => plan.idPlan === id),
  }
}

/**
 * Hook para obtener listado básico de planes de estudio
 */
export function usePlanesBasicos(options: UsePlanesBasicosOptions = {}) {
  const [planes, setPlanes] = useState<PlanEstudio[]>([])
  const [loading, setLoading] = useState(false)
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
    refetch: fetchPlanes,
    getPlan: (id: number) => planes.find((plan) => plan.idPlan === id),
  }
}

/**
 * Hook específico para obtener un plan por ID con información detallada
 * @param planId - ID del plan de estudio a obtener
 * @returns Hook con el plan específico, loading, error y métodos de refetch
 */
export function usePlanById(planId: number) {
  return usePlanesEstudio({ planId, autoFetch: true })
}

/**
 * Hook específico para obtener listado básico de todos los planes
 * @returns Hook con lista básica de planes, loading, error y métodos de refetch
 */
export function useAllPlanes() {
  return usePlanesBasicos({ autoFetch: true })
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
