import {
  adaptCarrerasUsuarioDBToAPIResponse,
  adaptEstadisticaCarreraDBToAPIResponse,
} from '@/adapters/carreras.adapter'
import { query } from '@/connection'
import type {
  CarreraEstadisticasAPIResponse,
  CarreraUsuarioAPIResponse,
} from '@/models/api/carreras.model'
import type {
  MateriaEnCurso,
  MateriaHistorial,
  EstadisticasMateriasEnCurso,
  EstadisticasHistorial,
} from '@/models/carrera-detalle.model'
import type {
  CarreraDB,
  CarreraEstadisticaCursandoDB,
  CarreraEstadisticasDB,
  CarreraUsuarioDB,
  MateriaDelPlanDB,
} from '@/models/database/carreras.model'

export interface EstadoMateriaUsuario {
  materia_id: number
  codigo_materia: string
  nombre_materia: string
  tipo: string
  horas_semanales: number
  anio_cursada_plan: number
  cuatrimestre_plan: number
  estado: string
  nota: number | null
  anio_cursada_real: number | null
  cuatrimestre_real: number | null
  fecha_actualizacion: Date
}

/**
 * Obtiene un listado de todas las carreras (solo información basica: carrera_id, nombre_carrera)
 * @returns Promise<CarreraDB[]> - Lista de carreras disponibles
 */
export async function obtenerCarreras(): Promise<CarreraDB[]> {
  try {
    const carrerasResult = await query(`
      SELECT 
        carrera.id      as carrera_id, 
        carrera.nombre  as carrera_nombre
      FROM prod.carrera 
      ORDER BY 
        carrera.nombre ASC
    `)

    const carrerasDB: CarreraDB[] = carrerasResult.rows as unknown as CarreraDB[]

    return carrerasDB
  } catch (error) {
    console.error('Error obteniendo carreras:', error)
    throw new Error('No se pudieron obtener las carreras')
  }
}

/**
 * Obtiene un listado de todas las carreras del usuario
 * @param usuarioId - ID del usuario
 * @returns Promise<CarreraUsuarioAPIResponse[]> - Promise con array de carreras del usuario
 */
export async function obtenerCarrerasUsuario(usuarioId: number): Promise<CarreraUsuarioAPIResponse[]> {
  try {
    const result = await query(
      `SELECT 
              usuario_plan_estudio.usuario_id, 
              usuario_plan_estudio.plan_estudio_id, 
              plan_estudio.carrera_id, 
              plan_estudio.anio,
              carrera.nombre as carrera_nombre
       FROM prod.usuario_plan_estudio
       JOIN prod.plan_estudio    ON usuario_plan_estudio.plan_estudio_id = plan_estudio.id
       JOIN prod.carrera         ON plan_estudio.carrera_id = carrera.id
       WHERE usuario_plan_estudio.usuario_id = $1
       ORDER BY 
              carrera.nombre    ASC, 
              plan_estudio.anio DESC`,
      [usuarioId]
    )

    const rowsCarreras: CarreraUsuarioDB[] = result.rows as unknown as CarreraUsuarioDB[]

    const carreras: CarreraUsuarioAPIResponse[] = adaptCarrerasUsuarioDBToAPIResponse(rowsCarreras)

    return carreras
  } catch (error) {
    console.error('Error DB carreras usuario')
    throw error
  }
}

/**
 * Obtiene un listado de todas las carreras (solo información basica: carrera_id, nombre_carrera) disponibles para que un usuario agregue a su perfil
 * @param usuarioId - ID del usuario
 * @returns Promise<CarreraDB[]> - Lista de carreras disponibles
 */
export async function obtenerCarrerasDisponiblesParaUsuario(usuarioId: number): Promise<CarreraDB[]> {
  try {
    const carrerasResult = await query(
      `SELECT DISTINCT
              carrera.id      as carrera_id, 
              carrera.nombre  as carrera_nombre
       FROM prod.carrera 
       WHERE carrera.id NOT IN (
         SELECT DISTINCT plan_estudio.carrera_id
         FROM prod.usuario_plan_estudio
         JOIN prod.plan_estudio ON usuario_plan_estudio.plan_estudio_id = plan_estudio.id
         WHERE usuario_plan_estudio.usuario_id = $1
       )
       ORDER BY carrera.nombre ASC`,
      [usuarioId]
    )

    const carrerasDB: CarreraDB[] = carrerasResult.rows as unknown as CarreraDB[]

    return carrerasDB
  } catch (error) {
    console.error('Error obteniendo carreras disponibles para usuario:', error)
    throw new Error('No se pudieron obtener las carreras disponibles para el usuario')
  }
}

/**
 * Agrega una carrera al usuario
 * @param usuarioId - ID del usuario
 * @param planEstudioId - ID del plan de estudio a agregar
 */
export async function agregarCarreraUsuario(usuarioId: number, planEstudioId: number): Promise<void> {
  try {
    const planAsociadoAUsuario = await query(
      'SELECT 1 FROM prod.usuario_plan_estudio WHERE usuario_id = $1 AND plan_estudio_id = $2',
      [usuarioId, planEstudioId]
    )

    if (planAsociadoAUsuario.rows.length > 0) {
      throw new Error('Ya estás anotado en esta carera y plan de estudio')
    }

    // Iniciar transacción para asegurar consistencia
    await query('BEGIN', [])

    try {
      // 1. Insertar la relación usuario-plan
      await query('INSERT INTO prod.usuario_plan_estudio (usuario_id, plan_estudio_id) VALUES ($1, $2)', [
        usuarioId,
        planEstudioId,
      ])

      // 2. Obtener todas las materias del plan de estudio
      const materiasPlanResult = await query(
        `SELECT plan_materia.materia_id 
         FROM prod.plan_materia 
         WHERE plan_materia.plan_estudio_id = $1`,
        [planEstudioId]
      )

      const materiasPlan: MateriaDelPlanDB[] = materiasPlanResult.rows as unknown as MateriaDelPlanDB[]

      // 3. Crear registros de estado inicial para todas las materias
      if (materiasPlan.length > 0) {
        // Insertar cada materia con estado 'Pendiente'
        for (const materia of materiasPlan) {
          await query(
            `INSERT INTO prod.usuario_materia_estado 
             (usuario_id, plan_estudio_id, materia_id, estado, anio_academico, cuatrimestre, nota)
             VALUES ($1, $2, $3, 'Pendiente', NULL, NULL, NULL)`,
            [usuarioId, planEstudioId, materia.materia_id]
          )
        }
      } else {
        throw new Error(
          'El plan de estudio no tiene materias asociadas. Por favor, espere a que se carguen las materias o contacte a soporte.'
        )
      }

      // Confirmar transacción
      await query('COMMIT', [])
    } catch (error) {
      // Rollback en caso de error
      await query('ROLLBACK', [])
      throw error
    }
  } catch (error) {
    console.error('Error agregando carrera al usuario:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('No se pudo agregar la carrera')
  }
}

/**
 *  Elimina una carrera del usuario
 * @param usuarioId - ID del usuario
 * @param planEstudioId - ID del plan de estudio
 */
export async function eliminarCarreraUsuario(usuarioId: number, planEstudioId: number): Promise<void> {
  try {
    const result = await query('DELETE FROM prod.usuario_plan_estudio WHERE usuario_id = $1 AND plan_estudio_id = $2', [
      usuarioId,
      planEstudioId,
    ])

    if (result.rowCount === 0) {
      throw new Error('No se encontró la carrera para eliminar')
    }
  } catch (error) {
    console.error('Error eliminando carrera del usuario:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('No se pudo eliminar la carrera')
  }
}

// Obtener progreso de materias del usuario en un plan específico
export async function obtenerProgresoUsuarioPlan(
  usuarioId: number,
  planEstudioId: number
): Promise<EstadoMateriaUsuario[]> {
  try {
    const result = await query(
      `SELECT 
         ume.materia_id,
         m.codigo_materia,
         m.nombre_materia,
         m.tipo,
         m.horas_semanales,
         pm.anio_cursada as anio_cursada_plan,
         pm.cuatrimestre as cuatrimestre_plan,
         ume.estado,
         ume.nota,
         ume.anio_cursada as anio_cursada_real,
         ume.cuatrimestre as cuatrimestre_real,
         ume.fecha_actualizacion
       FROM prod.usuario_materia_estado ume
       JOIN prod.materia m ON ume.materia_id = m.id
       JOIN prod.plan_materia pm ON ume.plan_estudio_id = pm.plan_estudio_id AND ume.materia_id = pm.materia_id
       WHERE ume.usuario_id = $1 AND ume.plan_estudio_id = $2
       ORDER BY pm.anio_cursada, pm.cuatrimestre, m.nombre_materia`,
      [usuarioId, planEstudioId]
    )
    return result.rows as unknown as EstadoMateriaUsuario[]
  } catch (error) {
    console.error('Error obteniendo progreso del usuario:', error)
    throw new Error('No se pudo obtener el progreso del usuario')
  }
}

/**
 * Obtiene estadisticas de progreso del usuario en un plan de estudio
 * @param usuarioId - ID del usuario
 * @param planEstudioId - ID del plan de estudio
 * @returns Promise<CarreraEstadisticasAPIResponse> - Promise con estadísticas de progreso
 */
export async function obtenerEstadisticasProgreso(
  usuarioId: number,
  planEstudioId: number
): Promise<CarreraEstadisticasAPIResponse> {
  try {
    const estadisticasResult = await query(
      `SELECT 
         (SELECT COUNT(*) FROM prod.plan_materia WHERE plan_estudio_id = $2)      as total_materias_plan,
         COUNT(CASE WHEN usuario_materia_estado.estado = 'Aprobada' THEN 1 END)   as materias_aprobadas,
         COUNT(CASE WHEN usuario_materia_estado.estado = 'En Final' THEN 1 END)   as materias_en_final,
         COUNT(CASE WHEN usuario_materia_estado.estado = 'Pendiente' THEN 1 END)  as materias_pendientes,
         AVG(CASE WHEN usuario_materia_estado.nota IS NOT NULL THEN usuario_materia_estado.nota END) as promedio_general
       FROM prod.usuario_materia_estado
       WHERE usuario_materia_estado.usuario_id = $1 AND usuario_materia_estado.plan_estudio_id = $2`,
      [usuarioId, planEstudioId]
    )

    const estadisticaCarrera: CarreraEstadisticasDB = estadisticasResult.rows[0] as unknown as CarreraEstadisticasDB

    // Para "En Curso" consultamos la tabla usuario_materia_estado
    const cursandoResult = await query(
      `SELECT 
          COUNT(DISTINCT materia_id) as materias_en_curso
       FROM prod.usuario_materia_estado
       WHERE 
          usuario_materia_estado.usuario_id = $1 
          AND usuario_materia_estado.plan_estudio_id = $2 
          AND usuario_materia_estado.estado = 'Cursando'`,
      [usuarioId, planEstudioId]
    )

    const estadisticaEnCurso: CarreraEstadisticaCursandoDB = cursandoResult
      .rows[0] as unknown as CarreraEstadisticaCursandoDB

    const estadisticasCompletaCarrera: CarreraEstadisticasAPIResponse = adaptEstadisticaCarreraDBToAPIResponse(
      planEstudioId,
      estadisticaCarrera,
      estadisticaEnCurso.materias_en_curso
    )

    return estadisticasCompletaCarrera
  } catch (error) {
    console.error('Error obteniendo estadísticas de progreso:', error)
    throw new Error('No se pudieron obtener las estadísticas de progreso')
  }
}

// Obtener materias en curso para un usuario y plan de estudio
export async function obtenerMateriasEnCurso(usuarioId: number, planEstudioId: number): Promise<MateriaEnCurso[]> {
  try {
    const result = await query(
      `SELECT 
         ume.materia_id as id,
         m.codigo_materia as codigo,
         m.nombre_materia as nombre,
         pm.anio_cursada as anio,
         pm.cuatrimestre,
         ume.anio_cursada as anio_cursada,
         ume.cuatrimestre as cuatrimestre_cursada,
         umc.nota_primer_parcial as nota_primer_parcial,
         umc.nota_segundo_parcial as nota_segundo_parcial,
         umc.nota_recuperatorio_primer_parcial as nota_recuperatorio_primero,
         umc.nota_recuperatorio_segundo_parcial as nota_recuperatorio_segundo,
         ume.fecha_actualizacion,
         m.horas_semanales,
         m.tipo
       FROM prod.usuario_materia_estado ume
       LEFT JOIN prod.usuario_materia_cursada umc ON ume.usuario_id = umc.usuario_id 
                                                  AND ume.plan_estudio_id = umc.plan_estudio_id 
                                                  AND ume.materia_id = umc.materia_id
       JOIN prod.materia m ON ume.materia_id = m.id
       JOIN prod.plan_materia pm ON ume.plan_estudio_id = pm.plan_estudio_id 
                                 AND ume.materia_id = pm.materia_id
       WHERE ume.usuario_id = $1 AND ume.plan_estudio_id = $2 AND ume.estado = 'Cursando'
       ORDER BY ume.anio_cursada DESC, ume.cuatrimestre DESC, m.nombre_materia`,
      [usuarioId, planEstudioId]
    )

    return result.rows.map((row: any) => ({
      id: row.id,
      codigo: row.codigo,
      nombre: row.nombre,
      anio: row.anio,
      cuatrimestre: row.cuatrimestre,
      anioCursada: row.anio_cursada,
      cuatrimestreCursada: row.cuatrimestre_cursada,
      notaPrimerParcial: row.nota_primer_parcial || undefined,
      notaSegundoParcial: row.nota_segundo_parcial || undefined,
      notaRecuperatorioPrimero: row.nota_recuperatorio_primero || undefined,
      notaRecuperatorioSegundo: row.nota_recuperatorio_segundo || undefined,
      fechaActualizacion: new Date(row.fecha_actualizacion),
      horasSemanales: row.horas_semanales,
      tipo: row.tipo as 'cursable' | 'electiva',
    }))
  } catch (error) {
    console.error('Error obteniendo materias en curso:', error)
    throw new Error('No se pudieron obtener las materias en curso')
  }
}

// Obtener historial académico para un usuario y plan de estudio
export async function obtenerHistorialAcademico(usuarioId: number, planEstudioId: number): Promise<MateriaHistorial[]> {
  try {
    // Consultar todas las materias del usuario (incluyendo las en curso)
    const result = await query(
      `SELECT 
         ume.materia_id as id,
         m.codigo_materia as codigo,
         m.nombre_materia as nombre,
         pm.anio_cursada as anio,
         pm.cuatrimestre,
         ume.nota,
         ume.anio_cursada as anio_cursada,
         ume.cuatrimestre as cuatrimestre_cursada,
         ume.estado,
         ume.fecha_actualizacion,
         m.horas_semanales,
         m.tipo
       FROM prod.usuario_materia_estado ume
       JOIN prod.materia m ON ume.materia_id = m.id
       JOIN prod.plan_materia pm ON ume.plan_estudio_id = pm.plan_estudio_id 
                                 AND ume.materia_id = pm.materia_id
       WHERE ume.usuario_id = $1 AND ume.plan_estudio_id = $2
       ORDER BY 
         CASE ume.estado
           WHEN 'Aprobada' THEN 1
           WHEN 'En Final' THEN 2
           WHEN 'Cursando' THEN 3
           WHEN 'Pendiente' THEN 4
           ELSE 5
         END,
         pm.anio_cursada, pm.cuatrimestre, m.nombre_materia`,
      [usuarioId, planEstudioId]
    )

    return result.rows.map((row: any) => ({
      id: row.id,
      codigo: row.codigo,
      nombre: row.nombre,
      anio: row.anio,
      cuatrimestre: row.cuatrimestre,
      nota: row.nota || undefined,
      anioCursada: row.anio_cursada,
      cuatrimestreCursada: row.cuatrimestre_cursada,
      estado: row.estado as 'Aprobada' | 'Pendiente' | 'En Final' | 'Cursando',
      fechaActualizacion: new Date(row.fecha_actualizacion),
      horasSemanales: row.horas_semanales,
      tipo: row.tipo as 'cursable' | 'electiva',
    }))
  } catch (error) {
    console.error('Error obteniendo historial académico:', error)
    throw new Error('No se pudo obtener el historial académico')
  }
}

// Obtener estadísticas de materias en curso
export async function obtenerEstadisticasMateriasEnCurso(
  usuarioId: number,
  planEstudioId: number
): Promise<EstadisticasMateriasEnCurso> {
  try {
    const result = await query(
      `SELECT 
         COUNT(*) as total_materias,
         COUNT(CASE WHEN ume.cuatrimestre = 0 THEN 1 END) as materias_anual,
         COUNT(CASE WHEN ume.cuatrimestre = 1 THEN 1 END) as materias_primero,
         COUNT(CASE WHEN ume.cuatrimestre = 2 THEN 1 END) as materias_segundo,
         AVG(
           CASE 
             WHEN umc.nota_primer_parcial IS NOT NULL OR umc.nota_segundo_parcial IS NOT NULL 
             THEN (COALESCE(umc.nota_primer_parcial, 0) + COALESCE(umc.nota_segundo_parcial, 0)) / 2.0
             ELSE NULL
           END
         ) as promedio_parciales,
         COUNT(
           CASE 
             WHEN umc.nota_primer_parcial IS NOT NULL OR umc.nota_segundo_parcial IS NOT NULL 
             THEN 1 
           END
         ) as materias_con_parciales
       FROM prod.usuario_materia_estado ume
       LEFT JOIN prod.usuario_materia_cursada umc ON ume.usuario_id = umc.usuario_id 
                                                  AND ume.plan_estudio_id = umc.plan_estudio_id 
                                                  AND ume.materia_id = umc.materia_id
       WHERE ume.usuario_id = $1 AND ume.plan_estudio_id = $2 AND ume.estado = 'Cursando'`,
      [usuarioId, planEstudioId]
    )

    const stats = result.rows[0] as any
    return {
      totalMaterias: parseInt(stats.total_materias) || 0,
      materiasAnual: parseInt(stats.materias_anual) || 0,
      materiasPrimero: parseInt(stats.materias_primero) || 0,
      materiasSegundo: parseInt(stats.materias_segundo) || 0,
      promedioNotasParciales: stats.promedio_parciales ? parseFloat(stats.promedio_parciales) : undefined,
      materiasConParciales: parseInt(stats.materias_con_parciales) || 0,
    }
  } catch (error) {
    console.error('Error obteniendo estadísticas de materias en curso:', error)
    throw new Error('No se pudieron obtener las estadísticas de materias en curso')
  }
}

// Obtener estadísticas del historial académico
export async function obtenerEstadisticasHistorial(
  usuarioId: number,
  planEstudioId: number
): Promise<EstadisticasHistorial> {
  try {
    // Obtener estadísticas completas incluyendo materias en curso
    const result = await query(
      `SELECT 
         COUNT(CASE WHEN ume.estado = 'Aprobada' THEN 1 END) as materias_aprobadas,
         COUNT(CASE WHEN ume.estado = 'Pendiente' THEN 1 END) as materias_pendientes,
         COUNT(CASE WHEN ume.estado = 'En Final' THEN 1 END) as materias_en_final,
         COUNT(CASE WHEN ume.estado = 'Cursando' THEN 1 END) as materias_en_curso,
         AVG(CASE WHEN ume.estado = 'Aprobada' AND ume.nota IS NOT NULL THEN ume.nota END) as promedio_general
       FROM prod.usuario_materia_estado ume
       WHERE ume.usuario_id = $1 AND ume.plan_estudio_id = $2`,
      [usuarioId, planEstudioId]
    )

    // Obtener total de materias en el plan
    const resultTotal = await query(
      `SELECT COUNT(*) as total_materias_plan
       FROM prod.plan_materia 
       WHERE plan_estudio_id = $1`,
      [planEstudioId]
    )

    const stats = result.rows[0] as any
    const statsTotal = resultTotal.rows[0] as any

    return {
      totalMaterias: parseInt(statsTotal.total_materias_plan) || 0,
      materiasAprobadas: parseInt(stats.materias_aprobadas) || 0,
      materiasPendientes: parseInt(stats.materias_pendientes) || 0,
      materiasEnFinal: parseInt(stats.materias_en_final) || 0,
      materiasEnCurso: parseInt(stats.materias_en_curso) || 0,
      promedioGeneral: stats.promedio_general || undefined,
    }
  } catch (error) {
    console.error('Error obteniendo estadísticas del historial:', error)
    throw new Error('No se pudieron obtener las estadísticas del historial')
  }
}
