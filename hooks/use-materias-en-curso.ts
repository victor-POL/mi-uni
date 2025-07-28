import type { EstadisticasMateriasEnCurso } from '@/models/carrera-detalle.model'
import type { MateriaCursadaPorCarrera } from '@/models/materias-cursada.model'
import { useEffect, useState } from 'react'

interface UseCarerrasOptions {
  userId?: number
  autoFetch?: boolean
  esNuevo?: boolean
}

export const useMateriasEnCurso = (options: UseCarerrasOptions = { autoFetch: true }) => {
  const [infoMateriasEnCurso, setInfoMateriasEnCurso] = useState<{
    materiasPorCarrera: MateriaCursadaPorCarrera[]
    estadisticas: EstadisticasMateriasEnCurso
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cargarMateriasPorCarrera = async () => {
    setLoading(true)
    setError(null)

    if (!options.userId) {
      setError('Se requiere un userId para cargar las materias en curso')
      return
    }

    try {
      const url = `/api/materias-en-curso?usuarioId=${options.userId}`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setInfoMateriasEnCurso(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
      setError(errorMessage)
      console.error('Error fetching materias en curso del usuario:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log('🔍 useMateriasEnCurso - Evaluando condiciones:', {
      autoFetch: options.autoFetch,
      userId: options.userId,
      esNuevo: options.esNuevo,
      shouldFetch: options.autoFetch && options.userId && options.esNuevo === false
    })
    
    if (options.autoFetch && options.userId && options.esNuevo === false) {
      console.log('✅ useMateriasEnCurso - Ejecutando llamada a API')
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
