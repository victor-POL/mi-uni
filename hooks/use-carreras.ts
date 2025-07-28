import { useState, useEffect } from 'react'
import type { ApiResponse } from '@/models/api/api.model'
import type {
  CarreraUsuarioConEstadisticasAPIResponse,
  CarreraUsuarioDisponibleAPIResponse,
} from '@/models/api/carreras.model'
import type { CarreraResumen, Carrera } from '@/models/mis-carreras.model'
import { adaptCarrerasUsuariosConEstadisticasAPIResponse } from '@/adapters/carreras.adapter'

interface UseCarerrasOptions {
  userID?: number
  autoFetch?: boolean
}

/**
 * Hook para obtener las carreras del usuario con estadísticas
 * @param options - Opciones del hook
 * @param options.userID - ID del usuario para obtener sus carreras
 * @param options.autoFetch - Si se debe hacer fetch automáticamente al montar el hook
 * @returns Hook con las carreras del usuario, loading, error y métodos de refetch
 */
export function useCarrerasUsuario(options: UseCarerrasOptions = {}) {
  const [carreras, setCarreras] = useState<CarreraResumen[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCarreras = async () => {
    setLoading(true)
    setError(null)

    try {
      if (!options.userID) {
        throw new Error('Se requiere un userID para obtener las carreras del usuario')
      }

      const url = `/api/user/carreras/resumen?usuarioId=${options.userID}`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: ApiResponse<CarreraUsuarioConEstadisticasAPIResponse[]> = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch data')
      }

      const formattedCarreras: CarreraResumen[] = adaptCarrerasUsuariosConEstadisticasAPIResponse(result.data)

      setCarreras(formattedCarreras)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
      setError(errorMessage)
      console.error('Error fetching carreras del usuario:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (options.autoFetch !== false && options.userID) {
      fetchCarreras()
    }
  }, [options.userID, options.autoFetch])

  return {
    carreras,
    loading,
    error,
    refetch: fetchCarreras,
  }
}

interface UseCarrerasDisponiblesUsuarioOptions {
  userID: number | undefined
  autoFetch?: boolean
}

/**
 * Hook para obtener las carreras disponibles para agregar al usuario
 * @param options - Opciones del hook
 * @param options.userID - ID del usuario para obtener sus carreras disponibles
 * @param options.autoFetch - Si se debe hacer fetch automáticamente al montar el hook
 * @returns Hook con las carreras, loading, error y métodos de refetch
 */
export const useCarrerasDisponiblesUsuario = (options: UseCarrerasDisponiblesUsuarioOptions) => {
  const [carreras, setCarreras] = useState<Carrera[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCarreras = async () => {
    setLoading(true)
    setError(null)

    try {
      if (!options.userID) {
        throw new Error('Se requiere un userID para obtener las carreras disponibles')
      }

      const url = `/api/user/carreras/disponibles?usuarioId=${options.userID}`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: ApiResponse<CarreraUsuarioDisponibleAPIResponse[]> = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch data')
      }

      const formattedCarreras: Carrera[] = result.data.map((carrera: any) => ({
        idCarrera: carrera.carrera_id,
        nombreCarrera: carrera.nombre_carrera,
      }))

      setCarreras(formattedCarreras)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
      setError(errorMessage)
      console.error('Error fetching nuevas carreras del usuario:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (options.autoFetch && options.userID) {
      fetchCarreras()
    } else if (options.autoFetch === false) {
      setCarreras(null)
      setError(null)
      setLoading(false)
    }
  }, [options.userID, options.autoFetch])

  return {
    carreras,
    loading,
    error,
    refetch: fetchCarreras,
  }
}
