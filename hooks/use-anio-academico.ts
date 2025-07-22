import { useState, useEffect } from 'react'

interface UsuarioAnioAcademico {
  anioAcademico: number
  fechaActualizacion?: string
  esNuevo: boolean
}

export function useAnioAcademico(usuarioId?: number) {
  const [anioAcademico, setAnioAcademico] = useState<UsuarioAnioAcademico | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const obtenerAnioAcademico = async () => {
    if (!usuarioId) return

    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/anio-academico?usuarioId=${usuarioId}`)
      
      if (!response.ok) {
        throw new Error('Error obteniendo año académico')
      }
      
      const data = await response.json()
      setAnioAcademico(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  const establecerAnioAcademico = async (nuevoAnio: number) => {
    if (!usuarioId) return false

    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/anio-academico', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuarioId,
          anioAcademico: nuevoAnio
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
    if (!usuarioId) return false

    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/anio-academico', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuarioId,
          nuevoAnioAcademico: nuevoAnio
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
    obtenerAnioAcademico()
  }, [usuarioId])

  return {
    anioAcademico: anioAcademico?.anioAcademico,
    esNuevo: anioAcademico?.esNuevo || false,
    fechaActualizacion: anioAcademico?.fechaActualizacion,
    loading,
    error,
    establecerAnioAcademico,
    cambiarAnioAcademico,
    refrescar: obtenerAnioAcademico
  }
}
