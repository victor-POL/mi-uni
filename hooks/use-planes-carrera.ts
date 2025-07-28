import { useState, useEffect } from 'react'
import type { ApiResponse } from '@/models/api/api.model'
import type { PlanEstudioAPIResponse } from '@/models/api/planes-estudio.model'
import type { PlanEstudio } from '@/models/plan-estudio.model'

interface UsePlanesCarreraOptions {
  carreraId: number | null
  autoFetch?: boolean
}

/**
 * Hook para obtener los planes de estudio de una carrera específica
 * @param options - Opciones del hook
 * @param options.carreraId - ID de la carrera para obtener sus planes
 * @param options.autoFetch - Si el hook debe hacer fetch automáticamente
 * @returns Hook con los planes de la carrera, loading, error y método de refetch
 */
export function usePlanesCarrera(options: UsePlanesCarreraOptions = { carreraId: null, autoFetch: true }) {
  const [planes, setPlanes] = useState<PlanEstudio[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPlanes = async () => {
    setLoading(true)
    setError(null)

    try {
      if (!options.carreraId) {
        throw new Error('Se requiere un planId para obtener información detallada')
      }

      const url = `/api/carreras/${options.carreraId}/planes`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: ApiResponse<PlanEstudioAPIResponse[]> = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch data')
      }

      const formattedPlanes: PlanEstudio[] = result.data.map((plan) => ({
        idPlan: plan.plan_id,
        anio: plan.anio,
        nombreCarrera: plan.nombre_carrera,
      }))

      setPlanes(formattedPlanes)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
      setError(errorMessage)
      console.error('Error fetching planes de carrera:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (options.autoFetch && options.carreraId) {
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
