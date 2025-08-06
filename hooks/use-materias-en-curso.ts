import {
  adaptEstadisticasMateriasEnCursoAPIResponseToLocal,
  adaptMateriasPorCarreraCursadaAPIResponseToLocal,
} from '@/adapters/materias-cursada.adapter'
import type { ApiResponse } from '@/models/api/api.model'
import type { MateriasEnCursoAPIResponse } from '@/models/api/materias-cursada.model'
import type { MateriasEnCurso } from '@/models/materias-cursada.model'
import { useEffect, useState } from 'react'

interface UseCarerrasOptions {
  userId?: number
  autoFetch?: boolean
  esNuevo?: boolean
}

export const useMateriasEnCurso = (options: UseCarerrasOptions = { autoFetch: true }) => {
  const [infoMateriasEnCurso, setInfoMateriasEnCurso] = useState<MateriasEnCurso | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const cargarMateriasPorCarrera = async () => {
    setLoading(true)
    setError(null)

    if (!options.userId) {
      setError('Se requiere un userId para cargar las materias en curso')
      return
    }

    try {
      const url = `/api/user/materias-en-curso?userId=${options.userId}`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: ApiResponse<MateriasEnCursoAPIResponse> = await response.json()

      const formattedMaterias: MateriasEnCurso = {
        materiasPorCarrera: adaptMateriasPorCarreraCursadaAPIResponseToLocal(result.data.materias_por_carrera),
        estadisticasCursada: adaptEstadisticasMateriasEnCursoAPIResponseToLocal(result.data.estadisticas_cursada),
      }

      setInfoMateriasEnCurso(formattedMaterias)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
      setError(errorMessage)
      console.error('Error fetching materias en curso del usuario:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (options.autoFetch && options.userId && options.esNuevo === false) {
      cargarMateriasPorCarrera()
    }
  }, [options.userId, options.autoFetch, options.esNuevo])

  return {
    infoMateriasEnCurso,
    loading,
    error,
    refetch: cargarMateriasPorCarrera,
  }
}
