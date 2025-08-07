import { query } from '@/lib/database/connection'

import type {
  CarreraDB,
  CarreraEstadisticasDB,
  CarreraUsuarioDB,
  MateriaDelPlanDB,
} from '@/models/database/carreras.model'

import type {
  MateriaHistoriaAcademica,
  EstadisticasMateriasEnCurso,
  EstadisticasHistoriaAcademica,
} from '@/models/carrera-detalle.model'

/**
 * Obtiene un listado de todas las carreras del usuario que el usuario agregó a su perfil
 * @param usuarioId - ID del usuario
 * @returns Promise con array de carreras del usuario
 */
export async function getCarreras(usuarioId: number): Promise<CarreraUsuarioDB[]> {
  try {
    const estadisticasResQuery = await query(
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

    const carrerrasDB: CarreraUsuarioDB[] = estadisticasResQuery.rows as unknown as CarreraUsuarioDB[]

    return carrerrasDB
  } catch (error) {
    console.error('Error obteniendo carreras del usuario:', error)
    throw new Error('No se pudieron obtener las carreras asociadas al usuario')
  }
}

/**
 * Obtiene un listado de todas las carreras (solo información basica: carrera_id, nombre_carrera) disponibles para que un usuario agregue a su perfil
 * @param usuarioId - ID del usuario
 * @returns Promise con array de carreras disponibles para el usuario
 */
export async function getCarrerasDisponibles(usuarioId: number): Promise<CarreraDB[]> {
  try {
    const estadisticasResQuery = await query(
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

    const carrerasDB: CarreraDB[] = estadisticasResQuery.rows as unknown as CarreraDB[]

    return carrerasDB
  } catch (error) {
    console.error('Error obteniendo carreras disponibles para usuario:', error)
    throw new Error('No se pudieron obtener las carreras disponibles para el usuario')
  }
}

/**
 * Inserta una carrera al usuario
 * @param usuarioId - ID del usuario
 * @param planEstudioId - ID del plan de estudio a agregar
 */
export async function insertCarrera(usuarioId: number, planEstudioId: number): Promise<void> {
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
      const estadisticasResQuery = await query(
        `SELECT plan_materia.materia_id 
         FROM prod.plan_materia 
         WHERE plan_materia.plan_estudio_id = $1`,
        [planEstudioId]
      )

      const materiasPlan: MateriaDelPlanDB[] = estadisticasResQuery.rows as unknown as MateriaDelPlanDB[]

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
export async function eliminarCarrera(usuarioId: number, planEstudioId: number): Promise<void> {
  try {
    const estadisticasResQuery = await query(
      'DELETE FROM prod.usuario_plan_estudio WHERE usuario_id = $1 AND plan_estudio_id = $2',
      [usuarioId, planEstudioId]
    )

    if (estadisticasResQuery.rowCount === 0) {
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

/**
 * Obtiene estadisticas de progreso del usuario en un plan de estudio
 * @param usuarioId - ID del usuario
 * @param planEstudioId - ID del plan de estudio
 * @returns Promise con estadísticas de progreso
 */
export async function getEstadisticasProgreso(
  usuarioId: number,
  planEstudioId: number
): Promise<CarreraEstadisticasDB> {
  try {
    const estadisticasResQuery = await query(
      `SELECT
          usuario_materia_estado.plan_estudio_id,
         (SELECT COUNT(*) FROM prod.plan_materia WHERE plan_estudio_id = $2)      as total_materias_plan,
         COUNT(CASE WHEN usuario_materia_estado.estado = 'Aprobada' THEN 1 END)   as materias_aprobadas,
         COUNT(CASE WHEN usuario_materia_estado.estado = 'En Final' THEN 1 END)   as materias_en_final,
         COUNT(CASE WHEN usuario_materia_estado.estado = 'Pendiente' THEN 1 END)  as materias_pendientes,
         AVG(CASE WHEN usuario_materia_estado.nota IS NOT NULL AND usuario_materia_estado.estado = 'Aprobada' THEN usuario_materia_estado.nota END) as promedio_general
       FROM prod.usuario_materia_estado
       WHERE usuario_materia_estado.usuario_id = $1 AND usuario_materia_estado.plan_estudio_id = $2
       GROUP BY usuario_materia_estado.plan_estudio_id`,
      [usuarioId, planEstudioId]
    )

    const estadisticaCarrera: CarreraEstadisticasDB = estadisticasResQuery.rows[0] as unknown as CarreraEstadisticasDB

    // print type of of every field
    console.log('Tipo de estadisticaCarrera:', {
      planEstudioId: typeof estadisticaCarrera.plan_estudio_id,
      totalMateriasPlan: typeof estadisticaCarrera.total_materias_plan,
      materiasAprobadas: typeof estadisticaCarrera.materias_aprobadas,
      materiasEnFinal: typeof estadisticaCarrera.materias_en_final,
      materiasPendientes: typeof estadisticaCarrera.materias_pendientes,
      promedioGeneral: typeof estadisticaCarrera.promedio_general,
    })

    // preint valores
    console.log('Valores de estadisticaCarrera:', {
      planEstudioId: estadisticaCarrera.plan_estudio_id,
      totalMateriasPlan: estadisticaCarrera.total_materias_plan,
      materiasAprobadas: estadisticaCarrera.materias_aprobadas,
      materiasEnFinal: estadisticaCarrera.materias_en_final,
      materiasPendientes: estadisticaCarrera.materias_pendientes,
      promedioGeneral: estadisticaCarrera.promedio_general,
    })

    return estadisticaCarrera
  } catch (error) {
    console.error('Error obteniendo estadísticas de progreso:', error)
    throw new Error('No se pudieron obtener las estadísticas de progreso')
  }
}

/**
 * Obtiene la historia académica del usuario en un plan de estudio
 * @param usuarioId - ID del usuario
 * @param planEstudioId - ID del plan de estudio
 * @returns Promise con la historia academica del usuario en el plan de estudio
 */
export async function getHistoriaAcademica(
  usuarioId: number,
  planEstudioId: number
): Promise<MateriaHistoriaAcademica[]> {
  try {
    // Consultar todas las materias del usuario (incluyendo las en curso)
    const estadisticasResQuery = await query(
      `SELECT 
         ume.materia_id as id,
         m.codigo_materia as codigo,
         m.nombre_materia as nombre,
         pm.anio_cursada as anio,
         pm.cuatrimestre,
         ume.nota,
         ume.anio_academico as anio_cursada,
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

    return estadisticasResQuery.rows.map((row: any) => ({
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
    console.error('Error obteniendo historia academica:', error)
    throw new Error('No se pudo obtener el historia academica')
  }
}

/**
 * Obtiene las estadisticas de las materias en curso del usuario en un plan de estudio
 * @param usuarioId
 * @param planEstudioId
 * @returns
 */
export async function getEstadisticasMateriasEnCurso(
  usuarioId: number,
  planEstudioId: number
): Promise<EstadisticasMateriasEnCurso> {
  try {
    const estadisticasResQuery = await query(
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

    const stats = estadisticasResQuery.rows[0]
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

/**
 * Obtiene estadísticas de la historia academica del usuario en un plan de estudio
 * @param usuarioId - ID del usuario
 * @param planEstudioId - ID del plan de estudio
 * @returns Promise con las estadísticas de la historia académica del usuario
 */
export async function getEstadisticasHistoriaAcademica(
  usuarioId: number,
  planEstudioId: number
): Promise<EstadisticasHistoriaAcademica> {
  try {
    // Obtener estadísticas completas incluyendo materias en curso
    const estadisticasResQuery = await query(
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
    const totalestadisticasResQuery = await query(
      `SELECT COUNT(*) as total_materias_plan
       FROM prod.plan_materia 
       WHERE plan_estudio_id = $1`,
      [planEstudioId]
    )

    const stats = estadisticasResQuery.rows[0]
    const statsTotal = totalestadisticasResQuery.rows[0]

    return {
      totalMaterias: parseInt(statsTotal.total_materias_plan) || 0,
      materiasAprobadas: parseInt(stats.materias_aprobadas) || 0,
      materiasPendientes: parseInt(stats.materias_pendientes) || 0,
      materiasEnFinal: parseInt(stats.materias_en_final) || 0,
      materiasEnCurso: parseInt(stats.materias_en_curso) || 0,
      promedioGeneral: stats.promedio_general || undefined,
    }
  } catch (error) {
    console.error('Error obteniendo estadísticas de la historia academica:', error)
    throw new Error('No se pudieron obtener las estadísticas de la historia academica')
  }
}
