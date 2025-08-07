import type { PlanEstudioDB, PlanEstudioDetalleDB } from '@/models/database/planes-estudio.model'

import type { PlanEstudioAPIResponse, PlanEstudioDetalleAPIResponse } from '@/models/api/planes-estudio.model'

import type { PlanDeEstudioDetalle, PlanEstudio } from '@/models/plan-estudio.model'
import type { EstadoMateriaPlanEstudio } from '@/models/materias.model'

import { getGenericErrorMessage, getErrorType, ErrorType } from '@/utils/error.util'

/* --------------- PAGE PLANES ESTUDIO - INICIO LISTADO PLANES -------------- */
export const adaptPlanEstudioDBToAPIResponse = (planEstudioDB: PlanEstudioDB[]): PlanEstudioAPIResponse[] => {
  return planEstudioDB.map((plan) => ({
    plan_id: plan.plan_id,
    nombre_carrera: plan.nombre_carrera,
    anio: plan.anio,
  }))
}

/**
 * Adapta la respuesta de la API /api/planes-estudio al modelo local PlanEstudio
 * @param planes - PlanEstudioAPIResponse[] - Lista de planes de estudio desde la API
 * @returns PlanEstudio[] - Lista de planes adaptada al modelo local
 */
export const adaptPlanesEstudioAPIResponseToLocal = (planes: PlanEstudioAPIResponse[]): PlanEstudio[] => {
  return planes.map((plan) => ({
    idPlan: plan.plan_id,
    nombreCarrera: plan.nombre_carrera,
    anio: plan.anio,
  }))
}

/* --------------- PAGE PLANES ESTUDIO - CONSULTA DETALLE PLAN -------------- */
export const adaptDetallePlanDBToAPIResponse = (planDetalleDB: PlanEstudioDetalleDB): PlanEstudioDetalleAPIResponse => {
  return {
    plan_id: planDetalleDB.plan_id,
    nombre_carrera: planDetalleDB.nombre_carrera,
    anio: planDetalleDB.anio,
    estadisticas: {
      total_materias: planDetalleDB.estadisticas.total_materias,
      horas_totales: planDetalleDB.estadisticas.horas_totales,
      duracion_plan: planDetalleDB.estadisticas.duracion_plan,
      materias_sin_correlativas: planDetalleDB.estadisticas.materias_sin_correlativas,
    },
    materias: planDetalleDB.materias.map((materia) => ({
      codigo_materia: materia.codigo_materia,
      nombre_materia: materia.nombre_materia,
      anio_cursada: materia.anio_cursada,
      cuatrimestre_cursada: materia.cuatrimestre,
      horas_semanales: materia.horas_semanales,
      tipo: materia.tipo,
      estado_materia_usuario: materia.estado_materia_usuario,
      lista_correlativas: materia.lista_correlativas.map((correlativa) => ({
        codigo_materia: correlativa.codigo_materia,
        nombre_materia: correlativa.nombre_materia,
      })),
    })),
  }
}

/**
 * Adapta la respuesta de la API /api/planes-estudio/${options.planId} al modelo local PlanDeEstudioDetalle
 * @param detallePlanAPIResponse - PlanEstudioDetalleAPIResponse - Detalle del plan de estudio desde la API
 * @returns PlanDeEstudioDetalle - Detalle del plan de estudio adaptado al modelo local
 */
export const adaptDetallePlanAPIResponseToLocal = (
  detallePlanAPIResponse: PlanEstudioDetalleAPIResponse
): PlanDeEstudioDetalle => {
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
    materias: detallePlanAPIResponse.materias.map((materia) => ({
      codigoMateria: materia.codigo_materia,
      nombreMateria: materia.nombre_materia,
      anioCursada: materia.anio_cursada,
      cuatrimestreCursada: materia.cuatrimestre_cursada,
      horasSemanales: materia.horas_semanales,
      tipo: materia.tipo as 'cursable' | 'electiva',
      estado: (materia.estado_materia_usuario as EstadoMateriaPlanEstudio) ?? null,
      listaCorrelativas: materia.lista_correlativas.map((correlativa: any) => ({
        codigoMateria: correlativa.codigo_materia,
        nombreMateria: correlativa.nombre_materia,
      })),
    })),
  }
}

/* ---------------------------------- UTILS --------------------------------- */
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
