/* ---------------------------------- HOOKS --------------------------------- */
import { useState, useEffect } from 'react'
/* --------------------------------- MODELS --------------------------------- */
import type { ApiResponse } from '@/models/api/api.model'
import type {
  AnioAcademicoUsuarioAPIResponse,
  AnioAcademicoVigenteAPIResponse,
} from '@/models/api/materias-cursada.model'
import type { UsuarioAnioAcademico, AnioAcademicoVigente } from '@/models/materias-cursada.model'
import {
  adaptAnioAcademicoUsuarioAPIResponseToLocal,
  adaptAnioAcademicoVigenteAPIResponseToLocal,
} from '@/adapters/materias-en-curso.adapter'

interface UseCarerrasOptions {
  userId?: number
  autoFetch?: boolean
}

export function useAnioAcademico(options: UseCarerrasOptions = { autoFetch: true }) {
  const [anioAcademico, setAnioAcademico] = useState<UsuarioAnioAcademico | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const obtenerAnioAcademicoVigenteUsuario = async () => {
    setLoading(true)
    setError(null)
    try {
      if (!options.userId) {
        throw new Error('Se requiere un userId para obtener el año académico')
      }

      const url = `/api/user/anio-academico?userId=${options.userId}`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: ApiResponse<AnioAcademicoUsuarioAPIResponse> = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch data')
      }

      const formattedAnioUsuario: UsuarioAnioAcademico = adaptAnioAcademicoUsuarioAPIResponseToLocal(result.data)

      setAnioAcademico(formattedAnioUsuario)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Establece el año academico del usuario en funcion al año vigente cargado en el sistema
   * @returns true si se estableció exitosamente el año académico, false en caso contrario
   */
  const establecerAnioAcademicoVigente = async () => {
    if (!options.userId) return false

    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/user/anio-academico', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario_id: options.userId,
        }),
      })

      if (!response.ok) {
        throw new Error('Error estableciendo año académico vigente')
      }

      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      return false
    } finally {
      setLoading(false)
    }
  }

  /**
   * Desestablece el año académico del usuario, eliminando la relación con el año académico vigente
   * @returns true si se desestableció exitosamente el año académico, false en caso contrario
   */
  const desestablecerAnioAcademico = async () => {
    if (!options.userId) return false

    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/user/anio-academico?userId=${options.userId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Error desestableciendo año académico')
      }

      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      return false
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (options.autoFetch && options.userId) {
      obtenerAnioAcademicoVigenteUsuario()
    }
  }, [options.autoFetch, options.userId])

  return {
    anioAcademico: anioAcademico === null ? null : anioAcademico.anioAcademico,
    esNuevo: anioAcademico === null ? false : anioAcademico.esNuevo, // Si no hay datos, asumimos que es nuevo
    fechaActualizacion: anioAcademico === null ? null : anioAcademico.fechaActualizacion,
    loading,
    error,
    establecerAnioAcademicoVigente,
    desestablecerAnioAcademico,
    refrescar: obtenerAnioAcademicoVigenteUsuario,
  }
}

export const useAnioAcademicoUsuario = (usuarioId: number) => {
  const {
    anioAcademico,
    esNuevo,
    fechaActualizacion,
    loading,
    error,
    establecerAnioAcademicoVigente,
    desestablecerAnioAcademico,
    refrescar,
  } = useAnioAcademico({
    userId: usuarioId,
    autoFetch: true,
  })

  return {
    anioAcademico,
    esNuevo,
    fechaActualizacion,
    loading,
    error,
    establecerAnioAcademicoVigente,
    desestablecerAnioAcademico,
    refrescar,
  }
}

interface UseAnioAcademicoVigenteOptions {
  autoFetch?: boolean
}

/**
 * Hook para obtener el año académico vigente del sistema
 * @param options - Opciones del hook
 * @param options.autoFetch - Si el hook debe hacer fetch automáticamente
 * @returns Hook con el año académico vigente, loading, error y método de refetch
 */
export function useAnioAcademicoVigente(options: UseAnioAcademicoVigenteOptions) {
  const [anioVigente, setAnioVigente] = useState<AnioAcademicoVigente | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const obtenerAnioVigente = async () => {
    setLoading(true)
    setError(null)
    try {
      const url = '/api/anio-academico'
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: ApiResponse<AnioAcademicoVigenteAPIResponse> = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch data')
      }

      const formattedAnioVigente: AnioAcademicoVigente = adaptAnioAcademicoVigenteAPIResponseToLocal(result.data)

      setAnioVigente(formattedAnioVigente)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      console.error('Error fetching año académico vigente:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (options.autoFetch) {
      obtenerAnioVigente()
    }
  }, [options.autoFetch])

  return {
    anioVigente,
    loading,
    error,
    refetch: obtenerAnioVigente,
  }
}
