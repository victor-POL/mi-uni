import { useState, useEffect } from 'react'
import type { ApiResponse } from '@/models/api/api.model'
import type { PlanEstudioAPIResponse, PlanEstudioDetalleAPIResponse } from '@/models/api/planes-estudio.model'
import type { PlanDeEstudioDetalle, PlanEstudio } from '@/models/plan-estudio.model'
import type { EstadoMateriaPlanEstudio } from '@/models/materias.model'

interface UsePlanesEstudioOptions {
  planId: number | null
  usuarioId?: number | null
  autoFetch?: boolean
}

/**
 * Hook para obtener el detalle de un paln de estudio
 * @param options - Opciones del hook
 * @param options.planId - ID del plan de estudio a obtener su detalle
 * @param options.usuarioId - ID del usuario (opcional) para obtener el progreso
 * @param options.autoFetch - Si el hook debe hacer fetch automáticamente
 * @returns Hook con el plan de estudio, loading, loading, error y método de refetch
 */
export function useDetallePlanEstudio(options: UsePlanesEstudioOptions = { planId: null, autoFetch: true }) {
  const [detallePlan, setDetallePlan] = useState<PlanDeEstudioDetalle | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPlanes = async () => {
    setLoading(true)
    setError(null)

    try {
      if (!options.planId) {
        throw new Error('Se requiere un planId para obtener información detallada')
      }

      let url = `/api/planes-estudio/${options.planId}`
      if (options.usuarioId) {
        url += `?usuarioId=${options.usuarioId}`
      }
      
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: ApiResponse<PlanEstudioDetalleAPIResponse> = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch data')
      }

      const detalleFormatted: PlanDeEstudioDetalle = {
        idPlan: result.data.plan_id,
        nombreCarrera: result.data.nombre_carrera,
        anio: result.data.anio,
        materias: result.data.materias.map((materia) => ({
          codigoMateria: materia.codigo_materia,
          nombreMateria: materia.nombre_materia,
          tipo: materia.tipo as 'cursable' | 'electiva',
          anioCursada: materia.anio_cursada,
          cuatrimestreCursada: materia.cuatrimestre_cursada,
          horasSemanales: materia.horas_semanales,
          listaCorrelativas: materia.lista_correlativas.map((correlativa) => ({
            codigoMateria: correlativa.codigo_materia,
            nombreMateria: correlativa.nombre_materia,
          })),
          opcionesElectivas: [],
          estado: materia.estado_materia_usuario as EstadoMateriaPlanEstudio | null,
        })),
        estadisticas: {
          totalMaterias: result.data.estadisticas.total_materias,
          horasTotales: result.data.estadisticas.horas_totales,
          duracion: result.data.estadisticas.duracion_plan,
          materiasSinCorrelativas: result.data.estadisticas.materias_sin_correlativas,
        },
      }

      setDetallePlan(detalleFormatted)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
      setError(errorMessage)
      console.error('Error fetching plan detalle:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (options.autoFetch && options.planId) {
      // Limpiar el plan anterior cuando cambia el planId
      setDetallePlan(null)
      setError(null)
      fetchPlanes()
    }
  }, [options.planId, options.usuarioId, options.autoFetch])

  return {
    detallePlan,
    loading,
    error,
    refetch: fetchPlanes,
  }
}

interface UsePlanesBasicosOptions {
  autoFetch?: boolean
}

/**
 * Hook para obtener listado de planes de estudio
 * @param options - Opciones del hook
 * @param options.autoFetch - Si se debe hacer fetch automáticamente al montar el hook
 * @return Hook con la lista de planes, loading, error y métodos de refetch
 */
export function usePlanesEstudio(options: UsePlanesBasicosOptions = {}) {
  const [planes, setPlanes] = useState<PlanEstudio[] | null>(null)
  const [loading, setLoading] = useState(true)
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
  }
}

/**
 * Hook específico para obtener listado básico de todos los planes
 * @returns Hook con lista básica de planes, loading, error y métodos de refetch
 */
export function useAllPlanes() {
  return usePlanesEstudio({ autoFetch: true })
}
