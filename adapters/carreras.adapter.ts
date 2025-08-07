import type { CarreraDB, CarreraEstadisticasDB, CarreraUsuarioDB } from '@/models/database/carreras.model'

import type {
  CarreraUsuarioConEstadisticasAPIResponse,
  CarreraUsuarioDisponibleAPIResponse,
} from '@/models/api/carreras.model'

import type { Carrera, CarreraResumen } from '@/models/mis-carreras.model'

/* ------------------- PAGE MIS CARRERAS - INICIO CARRERAS ------------------ */
/**
 * Adapta la respuesta de la API /api/user/carreras?userId=${options.userID} al modelo local CarreraResumen
 * @param carreras - CarreraUsuarioConEstadisticasAPIResponse[] - Lista de carreras del usuario con estadísticas desde la API
 * @returns CarreraResumen[] - Lista de carreras adaptada al modelo local
 */
export const adaptCarrerasUsuariosConEstadisticasAPIResponseToLocal = (
  carreras: CarreraUsuarioConEstadisticasAPIResponse[]
): CarreraResumen[] => {
  return carreras.map((carrera) => ({
    nombre: carrera.nombre_carrera,
    estado: carrera.estado as string,
    progreso: carrera.progreso,
    materiasAprobadas: carrera.materias_aprobadas,
    materiasTotal: carrera.materias_total,
    promedioGeneral: carrera.promedio_general,
    planEstudioId: carrera.plan_estudio_id,
    planEstudioAnio: carrera.plan_estudio_anio,
  }))
}

/**
 * Une la carrera del usuario con sus estadísticas en un objeto CarreraUsuarioConEstadisticasAPIResponse
 * @param carrera - CarreraUsuarioAPIResponse - Carrera del usuario
 * @param estadisticas - CarreraEstadisticasDB - Estadísticas de la carrera
 * @returns CarreraUsuarioConEstadisticasAPIResponse - Objeto que combina carrera y estadísticas
 */
export const joinEstadisticaToCarreraAPIResponse = (
  carrera: CarreraUsuarioDB,
  estadisticas: CarreraEstadisticasDB
): CarreraUsuarioConEstadisticasAPIResponse => {
  const materiasAprobadasCasted: number = parseInt(estadisticas.materias_aprobadas, 10)
  const totalMateriasPlanCasted: number = parseInt(estadisticas.total_materias_plan, 10)

  const porcentajeProgreso: number = (materiasAprobadasCasted * 100) / totalMateriasPlanCasted
  const porcentajeProgresoFixed: number = parseFloat(porcentajeProgreso.toFixed(2))

  const promedio: number = parseFloat(estadisticas.promedio_general)
  const promedioFixed: number = parseFloat(promedio.toFixed(2))

  return {
    plan_estudio_id: carrera.plan_estudio_id,
    plan_estudio_anio: carrera.anio,
    nombre_carrera: carrera.carrera_nombre,
    estado: porcentajeProgreso === 100 ? 'Completada' : 'En Curso',
    progreso: porcentajeProgresoFixed,
    materias_aprobadas: materiasAprobadasCasted,
    materias_total: totalMateriasPlanCasted,
    promedio_general: promedioFixed,
  }
}

/* --------------- PAGE MIS CARRERAS - AGREGAR CARRERA USUARIO -------------- */
/**
 * Adapta la respuesta de la base de datos CarreraDB a CarreraUsuarioAPIResponse
 * @param carreras - CarreraDB[] - Lista de carreras desde la base de datos
 * @returns
 */
export const adaptCarrerasDisponiblesUsuarioDBToAPIResponse = (
  carreras: CarreraDB[]
): CarreraUsuarioDisponibleAPIResponse[] => {
  return carreras.map((carrera) => ({
    carrera_id: carrera.carrera_id,
    nombre_carrera: carrera.carrera_nombre,
  }))
}

/**
 * Adapta la respuesta de la API /api/user/carreras/disponibles?userId=${options.userID} al modelo local Carrera
 * @param carreras - CarreraUsuarioDisponibleAPIResponse[] - Lista de carreras disponibles del usuario desde la API
 * @returns Carrera[] - Lista de carreras adaptada al modelo local
 */
export const adaptCarrerasDisponiblesUsuarioAPIResponseToLocal = (
  carreras: CarreraUsuarioDisponibleAPIResponse[]
): Carrera[] => {
  return carreras.map((carrera) => ({
    idCarrera: carrera.carrera_id,
    nombreCarrera: carrera.nombre_carrera,
  }))
}
