import { useState, useEffect } from 'react'
import type { PlanDeEstudioDetalle } from '@/models/plan-estudio.model'

interface ApiResponse<T> {
  success: boolean
  data: T
  count?: number
  error?: string
  message?: string
}

interface UsePlanesEstudioOptions {
  planId?: number
  carrera?: string
  autoFetch?: boolean
  summaryOnly?: boolean // Nueva opción para obtener solo información básica
}

export function usePlanesEstudio(options: UsePlanesEstudioOptions = {}) {
  const [planes, setPlanes] = useState<PlanDeEstudioDetalle[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPlanes = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams()
      
      if (options.planId) {
        params.append('id', options.planId.toString())
      }
      
      if (options.carrera) {
        params.append('carrera', options.carrera)
      }

      if (options.summaryOnly) {
        params.append('summary', 'true')
      }

      const queryString = params.toString()
      const url = queryString ? `/api/planes-estudio?${queryString}` : '/api/planes-estudio'
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result: ApiResponse<PlanDeEstudioDetalle[] | PlanDeEstudioDetalle> = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch data')
      }
      
      // Si es un plan específico, convertirlo a array
      const planesData = Array.isArray(result.data) ? result.data : [result.data]
      setPlanes(planesData)
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
      setError(errorMessage)
      console.error('Error fetching planes:', err)
    } finally {
      setLoading(false)
    }
  }

  // Auto-fetch cuando el hook se monta si autoFetch es true
  useEffect(() => {
    if (options.autoFetch !== false) {
      fetchPlanes()
    }
  }, [options.planId, options.carrera, options.autoFetch])

  return {
    planes,
    loading,
    error,
    refetch: fetchPlanes,
    // Helper para obtener un plan específico
    getPlan: (id: number) => planes.find(plan => plan.idPlan === id),
    // Helper para hacer fetch manual de un plan específico
    fetchPlanById: async (planId: number) => {
      try {
        const response = await fetch(`/api/planes-estudio?id=${planId}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const result: ApiResponse<PlanDeEstudioDetalle> = await response.json()
        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch plan')
        }
        return result.data
      } catch (error) {
        console.error('Error fetching plan by ID:', error)
        throw error
      }
    }
  }
}

// Hook específico para obtener resumen de planes (para selector)
export function usePlanesSummary() {
  return usePlanesEstudio({ summaryOnly: true, autoFetch: true })
}

// Hook específico para obtener todos los planes
export function useAllPlanes() {
  return usePlanesEstudio({ autoFetch: true })
}

// Hook específico para obtener un plan por ID
export function usePlanById(planId: number) {
  return usePlanesEstudio({ planId, autoFetch: true })
}

// Hook específico para buscar por carrera
export function usePlanesByCarrera(carrera: string) {
  return usePlanesEstudio({ carrera, autoFetch: true })
}
