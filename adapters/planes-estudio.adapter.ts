import type { EstadoMateriaPlanEstudio } from '@/models/materias.model'
import type { PlanDeEstudioDetalle } from '@/models/plan-estudio.model'
import { getGenericErrorMessage, getErrorType, ErrorType } from '@/utils/error.util'

/**
 * Transforma la respuesta de la API al modelo local de PlanDeEstudioDetalle
 * @param detallePlanAPIResponse - Respuesta de la API
 * @returns Plan de estudio transformado al formato local
 */
export const transformPlanAPIResponseToLocal = (detallePlanAPIResponse: any): PlanDeEstudioDetalle => {
  return {
    idPlan: detallePlanAPIResponse.plan_id,
    nombreCarrera: detallePlanAPIResponse.nombre_carrera,
    anio: detallePlanAPIResponse.anio,
    estadisticas: {
      totalMaterias: detallePlanAPIResponse.estadisticas.total_materias,
      horasTotales: detallePlanAPIResponse.estadisticas.horas_totales,
      duracion: detallePlanAPIResponse.estadisticas.duracion_plan,
      materiasSinCorrelativas: detallePlanAPIResponse.estadisticas.materias_sin_correlativas,
    },
    materias: detallePlanAPIResponse.materias.map((materia: any) => ({
      codigoMateria: materia.codigo_materia,
      nombreMateria: materia.nombre_materia,
      anioCursada: materia.anio_cursada,
      cuatrimestreCursada: materia.cuatrimestre_cursada,
      horasSemanales: materia.horas_semanales,
      tipo: materia.tipo as 'cursable' | 'electiva',
      estado: materia.estado_materia_usuario as EstadoMateriaPlanEstudio | null,
      listaCorrelativas: materia.lista_correlativas.map((correlativa: any) => ({
        codigoMateria: correlativa.codigo_materia,
        nombreMateria: correlativa.nombre_materia,
      })),
    })),
  }
}

/**
 * Determina el mensaje de error apropiado para operaciones de planes de estudio
 * @param error - Error capturado
 * @returns Mensaje de error específico para planes de estudio
 */
export const getPlanesEstudioErrorMessage = (error: unknown): string => {
  const errorType = getErrorType(error)
  
  if (errorType === ErrorType.NOT_FOUND) {
    return 'Plan de estudio no encontrado. Verifica que el plan seleccionado sea válido.'
  }
  
  // Para otros tipos de errores, usar el mensaje genérico
  return getGenericErrorMessage(error)
}
