/* ---------------------------------- HOOKS --------------------------------- */
import { useState, useEffect } from 'react'
/* --------------------------------- MODELS --------------------------------- */
import type { ApiResponse } from '@/models/api/api.model'
import type { AnioAcademicoUsuarioAPIResponse } from '@/models/api/materias-cursada.model'
import type { UsuarioAnioAcademico } from '@/models/materias-cursada.model'
import { adaptAnioAcademicoUsuarioAPIResponseToLocal } from '@/adapters/materias-cursada.model'

interface UseCarerrasOptions {
  userId?: number
  autoFetch?: boolean
}

export function useAnioAcademico(options: UseCarerrasOptions = { autoFetch: true }) {
  const [anioAcademico, setAnioAcademico] = useState<UsuarioAnioAcademico | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const obtenerAnioAcademico = async () => {
    setLoading(true)
    setError(null)
    try {
      if (!options.userId) {
        throw new Error('Se requiere un userId para obtener el año académico')
      }

      const url = `/api/anio-academico?userId=${options.userId}`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: ApiResponse<AnioAcademicoUsuarioAPIResponse> = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch data')
      }

      const formattedAnioUsuario: UsuarioAnioAcademico = adaptAnioAcademicoUsuarioAPIResponseToLocal(result.data)

      console.log({ formattedAnioUsuario })

      setAnioAcademico(formattedAnioUsuario)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  const establecerAnioAcademico = async (nuevoAnio: number) => {
    if (!options.userId) return false

    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/anio-academico', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: options.userId,
          anioAcademico: nuevoAnio,
        }),
      })

      if (!response.ok) {
        throw new Error('Error estableciendo año académico')
      }

      await obtenerAnioAcademico() // Refrescar datos
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      return false
    } finally {
      setLoading(false)
    }
  }

  const cambiarAnioAcademico = async (nuevoAnio: number) => {
    if (!options.userId) return false

    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/anio-academico', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: options.userId,
          nuevoAnioAcademico: nuevoAnio,
        }),
      })

      if (!response.ok) {
        throw new Error('Error cambiando año académico')
      }

      await obtenerAnioAcademico() // Refrescar datos
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
      obtenerAnioAcademico()
    }
  }, [options.autoFetch, options.userId])

  return {
    anioAcademico: anioAcademico?.anioAcademico,
    esNuevo: anioAcademico?.esNuevo || false,
    fechaActualizacion: anioAcademico?.fechaActualizacion,
    loading,
    error,
    establecerAnioAcademico,
    cambiarAnioAcademico,
    refrescar: obtenerAnioAcademico,
  }
}
