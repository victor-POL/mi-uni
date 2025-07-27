import { useState, useEffect } from 'react'
import type { PlanEstudio } from '@/models/plan-estudio.model'
import type { PlanEstudioAPIResponse } from '@/models/api/planes-estudio.model'

interface UsePlanesCarreraOptions {
  carreraId?: number | null
  autoFetch?: boolean
}

/**
 * Hook para obtener los planes de estudio de una carrera específica
 * @param options - Opciones del hook
 * @param options.carreraId - ID de la carrera para obtener sus planes
 * @param options.autoFetch - Si el hook debe hacer fetch automáticamente
 * @returns Hook con los planes de la carrera, loading y error
 */
export function usePlanesCarrera(options: UsePlanesCarreraOptions = {}) {
  const [planes, setPlanes] = useState<PlanEstudio[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPlanes = async () => {
    if (!options.carreraId) {
      setPlanes(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/carreras/${options.carreraId}/planes`)

      if (!response.ok) {
        throw new Error('Error cargando planes de estudio')
      }

      const data = await response.json()
      const listadoPlanesResponse: PlanEstudioAPIResponse[] = data

      const formattedPlanes: PlanEstudio[] = listadoPlanesResponse.map((plan) => ({
        idPlan: plan.plan_id,
        anio: plan.anio,
        nombreCarrera: plan.nombre_carrera,
      }))

      setPlanes(formattedPlanes)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error cargando planes de estudio'
      setError(errorMessage)
      console.error('Error fetching planes de carrera:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (options.autoFetch && options.carreraId) {
      fetchPlanes()
    } else {
      setPlanes(null)
      setError(null)
      setLoading(false)
    }
  }, [options.carreraId, options.autoFetch])

  return {
    planes,
    loading,
    error,
    refetch: fetchPlanes,
  }
}
