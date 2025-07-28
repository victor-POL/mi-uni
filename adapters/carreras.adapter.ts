import type {
  CarreraEstadisticasAPIResponse,
  CarreraUsuarioAPIResponse,
  CarreraUsuarioConEstadisticasAPIResponse,
  CarreraUsuarioDisponibleAPIResponse,
} from '@/models/api/carreras.model'
import type { CarreraEstadisticasDB, CarreraUsuarioDB } from '@/models/database/carreras.model'
import type { Carrera, CarreraResumen } from '@/models/mis-carreras.model'

/**
 * Adapta la respuesta de la API /api/user/carreras/resumen?usuarioId=${options.userID} al modelo local CarreraResumen
 * @param carreras - CarreraUsuarioConEstadisticasAPIResponse[] - Lista de carreras del usuario con estadísticas desde la API
 * @returns CarreraResumen[] - Lista de carreras adaptada al modelo local
 */
export const adaptCarrerasUsuariosConEstadisticasAPIResponse = (
  carreras: CarreraUsuarioConEstadisticasAPIResponse[]
): CarreraResumen[] => {
  return carreras.map((carrera) => ({
    nombre: carrera.nombre_carrera,
    estado: carrera.estado as string,
    progreso: carrera.progreso,
    materiasAprobadas: carrera.materias_aprobadas,
    materiasTotal: carrera.materias_total,
    promedioGeneral: carrera.promedio_general,
    añoIngreso: carrera.anio_ingreso,
    añoEstimadoEgreso: carrera.anio_estimado_ingreso,
    planEstudioId: carrera.plan_estudio_id,
    planEstudioAnio: carrera.plan_estudio_anio,
  }))
}


/**
 * Adapta la respuesta de la API /api/user/carreras/disponibles?usuarioId=${options.userID} al modelo local Carrera
 * @param carreras - CarreraUsuarioDisponibleAPIResponse[] - Lista de carreras disponibles del usuario desde la API
 * @returns Carrera[] - Lista de carreras adaptada al modelo local
 */
export const adaptCarrerasDisponiblesUsuarioAPIResponse = (carreras: CarreraUsuarioDisponibleAPIResponse[]): Carrera[] => {
  return carreras.map((carrera) => ({
    idCarrera: carrera.carrera_id,
    nombreCarrera: carrera.nombre_carrera,
  }))
}

/**
 * Adapta la respuesta de la DB CarreraUsuarioDB al modelo API CarreraUsuarioAPIResponse
 * @param carreras - CarreraUsuarioDB[] - Lista de carreras del usuario desde la DB
 * @returns CarreraUsuarioAPIResponse[] - Lista de carreras adaptada al modelo API
 */
export const adaptCarrerasUsuarioDBToAPIResponse = (carreras: CarreraUsuarioDB[]): CarreraUsuarioAPIResponse[] => {
  return carreras.map((carrera) => ({
    usuario_id: carrera.usuario_id,
    plan_estudio_id: carrera.plan_estudio_id,
    carrera_id: carrera.carrera_id,
    anio: carrera.anio,
    carrera_nombre: carrera.carrera_nombre,
  }))
}

/**
 * Adapta la respuesta de la DB CarreraEstadisticasDB al modelo API CarreraEstadisticasAPIResponse
 * @param planEstudioID - ID del plan de estudio
 * @param estadisticasCarrera - Estadísticas de carrera desde la base de datos
 * @param materiasEnCurso - Número de materias en curso
 * @returns CarreraEstadisticasAPIResponse - Estadísticas adaptadas al modelo API
 */
export const adaptEstadisticaCarreraDBToAPIResponse = (
  planEstudioID: number,
  estadisticasCarrera: CarreraEstadisticasDB,
  materiasEnCurso: number
): CarreraEstadisticasAPIResponse => {
  const totalMaterias = estadisticasCarrera.total_materias_plan
  const materiasAprobadas = estadisticasCarrera.materias_aprobadas

  return {
    plan_estudio_id: planEstudioID,
    total_materias: estadisticasCarrera.total_materias_plan,
    materias_aprobadas: estadisticasCarrera.materias_aprobadas,
    materias_en_curso: materiasEnCurso,
    materias_en_final: estadisticasCarrera.materias_en_final,
    materias_pendientes: estadisticasCarrera.materias_pendientes,
    promedio_general: estadisticasCarrera.promedio_general ? estadisticasCarrera.promedio_general : null,
    porcentaje_progreso: totalMaterias > 0 ? Math.round((materiasAprobadas / totalMaterias) * 100) : 0,
  }
}

/**
 * Une la carrera del usuario con sus estadísticas en un objeto CarreraUsuarioConEstadisticasAPIResponse
 * @param carrera - CarreraUsuarioAPIResponse - Carrera del usuario
 * @param estadisticas - CarreraEstadisticasAPIResponse - Estadísticas de la carrera
 * @returns CarreraUsuarioConEstadisticasAPIResponse - Objeto que combina carrera y estadísticas
 */
export const joinEstadisticaToCarreraAPIResponse = (
  carrera: CarreraUsuarioAPIResponse,
  estadisticas: CarreraEstadisticasAPIResponse
): CarreraUsuarioConEstadisticasAPIResponse => {
  return {
    plan_estudio_id: carrera.plan_estudio_id,
    plan_estudio_anio: carrera.anio,
    nombre_carrera: carrera.carrera_nombre,
    estado: estadisticas.porcentaje_progreso === 100 ? 'Completada' : 'En Curso',
    progreso: estadisticas.porcentaje_progreso,
    materias_aprobadas: estadisticas.materias_aprobadas,
    materias_total: estadisticas.total_materias,
    promedio_general: estadisticas.promedio_general || 0,
    anio_ingreso: carrera.anio, // TODO: Agregar fecha real de ingreso del usuario
    anio_estimado_ingreso: carrera.anio + 5, // TODO: Calcular basado en progreso real
  }
}
