import { useState, useEffect } from 'react'
import type { Materia } from '@/models/materias.model'
import { MateriaCursadaDisponibleAPIResponse } from '@/models/api/materias-cursada.model'
import { ApiResponse } from '@/models/api/api.model'
import { adaptMateriaCursadaDisponibleAPIResponseToLocal } from '@/adapters/materias-cursada.model'

interface UseMateriasDisponiblesOptions {
  usuarioId: number | null
  planEstudioId: number | null
  autoFetch?: boolean
}

/**
 * Hook para obtener las materias disponibles para agregar en un plan de estudio de un usuario
 * @param options.usuarioId - ID del usuario
 * @param options.planEstudioId - ID del plan de estudio
 * @param options.autoFetch - Si debe hacer fetch automáticamente
 * @returns Hook con la lista de materias disponibles, loading, error y métodos de refetch
 */
export function useMateriasDisponibles(options: UseMateriasDisponiblesOptions) {
  const [materias, setMaterias] = useState<Materia[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMaterias = async () => {
    setLoading(true)
    setError(null)
    try {
      if (!options.usuarioId || !options.planEstudioId) {
        throw new Error('Se requiere usuarioId y planEstudioId para obtener materias')
      }

      const url = `/api/user/materias-en-curso/disponibles?userId=${options.usuarioId}&planEstudioId=${options.planEstudioId}`

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: ApiResponse<MateriaCursadaDisponibleAPIResponse[]> = await response.json()

      const dataFormatted: Materia[] = adaptMateriaCursadaDisponibleAPIResponseToLocal(result.data)

      setMaterias(dataFormatted)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
      setError(errorMessage)
      console.error('Error fetching materias carrera:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (options.autoFetch && options.usuarioId && options.planEstudioId) {
      fetchMaterias()
    }
  }, [options.usuarioId, options.planEstudioId, options.autoFetch])

  return {
    materias,
    loading,
    error,
    refetch: fetchMaterias,
  }
}
