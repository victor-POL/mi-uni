import { query } from '@/lib/database/connection'

import type {
  EstadisticasMateriasEnCursoDB,
  MateriaCursadaDisponibleDB,
  MateriaEnCursoUsuarioDB,
} from '@/models/database/materias-cursada.model'

import type { ActualizarNotasMateriaEnCurso } from '@/models/materias-cursada.model'

/**
 * Obtiene un listado de materias en curso del usuario desde la base de datos
 * @param usuarioId - ID del usuario para obtener sus materias en curso
 * @returns Promise con array de materias en curso del usuario
 */
export async function getMateriasEnCurso(usuarioId: number): Promise<MateriaEnCursoUsuarioDB[]> {
  try {
    const result = await query(
      `SELECT 
         umc.usuario_id,
         umc.plan_estudio_id,
         umc.materia_id,
         umc.nota_primer_parcial,
         umc.nota_segundo_parcial,
         umc.nota_recuperatorio_primer_parcial,
         umc.nota_recuperatorio_segundo_parcial,
         umc.fecha_actualizacion,
         m.codigo_materia,
         m.nombre_materia,
         m.tipo,
         m.horas_semanales,
         pm.anio_cursada as anio_en_plan,
         pm.cuatrimestre as cuatrimestre_en_plan,
         c.id as carrera_id,
         c.nombre as carrera_nombre,
         pe.anio as plan_anio
       FROM prod.usuario_materia_cursada umc
       JOIN prod.materia m ON umc.materia_id = m.id
       JOIN prod.plan_materia pm ON umc.plan_estudio_id = pm.plan_estudio_id 
                                 AND umc.materia_id = pm.materia_id
       JOIN prod.plan_estudio pe ON umc.plan_estudio_id = pe.id
       JOIN prod.carrera c ON pe.carrera_id = c.id
       WHERE umc.usuario_id = $1
       ORDER BY c.nombre, pe.anio DESC, pm.anio_cursada, pm.cuatrimestre, m.nombre_materia`,
      [usuarioId]
    )

    const materiasEnCursoDB: MateriaEnCursoUsuarioDB[] = result.rows as unknown as MateriaEnCursoUsuarioDB[]

    return materiasEnCursoDB
  } catch (error) {
    console.error('Error obteniendo materias en curso por carrera:', error)
    throw new Error('No se pudieron obtener las materias en curso')
  }
}

/**
 * Obtiene un listado de las materias disponibles que tiene un usuario para agregar a sus materias en curso
 * @param usuarioId - ID del usuario para obtener sus planes de estudio
 * @param planEstudioId - ID del plan de estudio específico a obtener
 * @returns Promise con array de materias disponibles para agregar a materias en curso
 */
export async function getMateriasEnCursoDisponibles(
  usuarioId: number,
  planEstudioId: number
): Promise<MateriaCursadaDisponibleDB[]> {
  try {
    const result = await query(
      `SELECT 
         m.id,
         m.codigo_materia,
         m.nombre_materia,
         m.tipo,
         m.horas_semanales,
         pm.anio_cursada,
         pm.cuatrimestre
       FROM prod.plan_materia pm
       JOIN prod.materia m ON pm.materia_id = m.id
       WHERE pm.plan_estudio_id = $1
         AND NOT EXISTS (
           SELECT 1 FROM prod.usuario_materia_estado ume 
           WHERE ume.usuario_id = $2 
             AND ume.plan_estudio_id = $1 
             AND ume.materia_id = m.id
             AND ume.estado IN ('Cursando', 'Aprobada')
         )
       ORDER BY pm.anio_cursada, pm.cuatrimestre, m.nombre_materia`,
      [planEstudioId, usuarioId]
    )

    const materiasDisponibles = result.rows as unknown as MateriaCursadaDisponibleDB[]

    return materiasDisponibles
  } catch (error) {
    console.error('Error obteniendo materias disponibles:', error)
    throw new Error('No se pudieron obtener las materias disponibles')
  }
}

/**
 * Inserta una nueva materia en curso para el usuario
 * @param usuarioId - ID del usuario
 * @param planEstudioId - ID del plan de estudio al que pertenece la materia
 * @param materiaId - ID de la materia a agregar
 */
export async function insertMateriaEnCurso(usuarioId: number, planEstudioId: number, materiaId: number): Promise<void> {
  try {
    // Verificar que el usuario esté inscrito en el plan
    const usuarioEnPlan = await query(
      'SELECT 1 FROM prod.usuario_plan_estudio WHERE usuario_id = $1 AND plan_estudio_id = $2',
      [usuarioId, planEstudioId]
    )

    if (usuarioEnPlan.rows.length === 0) {
      throw new Error('Usuario no inscrito en este plan de estudio')
    }

    // Verificar que la materia pertenezca al plan
    const materiaEnPlan = await query(
      'SELECT 1 FROM prod.plan_materia WHERE plan_estudio_id = $1 AND materia_id = $2',
      [planEstudioId, materiaId]
    )

    if (materiaEnPlan.rows.length === 0) {
      throw new Error('Materia no pertenece al plan de estudio')
    }

    // Verificar que el usuario tenga un año académico establecido
    const tieneAnioAcademico = await query(`SELECT 1 FROM prod.usuario_anio_academico WHERE usuario_id = $1`, [
      usuarioId,
    ])

    if (tieneAnioAcademico.rows.length === 0) {
      throw new Error('Debe establecer un año académico antes de agregar materias')
    }

    // Verificar que no esté ya cursando la materia
    const yaEstaEnCurso = await query(
      'SELECT 1 FROM prod.usuario_materia_cursada WHERE usuario_id = $1 AND plan_estudio_id = $2 AND materia_id = $3',
      [usuarioId, planEstudioId, materiaId]
    )

    if (yaEstaEnCurso.rows.length > 0) {
      throw new Error('Ya está cursando esta materia')
    }

    // Insertar la materia en curso
    await query(
      `INSERT INTO prod.usuario_materia_cursada 
       (usuario_id, plan_estudio_id, materia_id, fecha_actualizacion)
       VALUES ($1, $2, $3, NOW())`,
      [usuarioId, planEstudioId, materiaId]
    )
  } catch (error) {
    console.error('Error agregando materia en curso:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('No se pudo agregar la materia en curso')
  }
}

/**
 * Actualiza las notas de una materia en curso del usuario
 * @param datos - Datos de la materia en curso a actualizar
 */
export async function updateNotasMateriaEnCurso(datos: ActualizarNotasMateriaEnCurso): Promise<void> {
  try {
    await query(
      `UPDATE prod.usuario_materia_cursada 
       SET nota_primer_parcial = $1,
           nota_segundo_parcial = $2,
           nota_recuperatorio_primer_parcial = $3,
           nota_recuperatorio_segundo_parcial = $4,
           fecha_actualizacion = NOW()
       WHERE usuario_id = $5 
         AND plan_estudio_id = $6 
         AND materia_id = $7`,
      [
        datos.notaPrimerParcial,
        datos.notaSegundoParcial,
        datos.notaRecuperatorioPrimerParcial,
        datos.notaRecuperatorioSegundoParcial,
        datos.usuarioId,
        datos.planEstudioId,
        datos.materiaId,
      ]
    )
  } catch (error) {
    console.error('Error actualizando notas de materia en curso:', error)
    throw new Error('No se pudieron actualizar las notas')
  }
}

/**
 *
 * @param usuarioId - ID del usuario
 * @param planEstudioId - ID del plan de estudio al que pertenece la materia
 * @param materiaId - ID de la materia a eliminar
 */
export async function deleteMateriaEnCurso(usuarioId: number, planEstudioId: number, materiaId: number): Promise<void> {
  try {
    const result = await query(
      `DELETE FROM prod.usuario_materia_cursada 
       WHERE usuario_id = $1 
         AND plan_estudio_id = $2 
         AND materia_id = $3`,
      [usuarioId, planEstudioId, materiaId]
    )

    if (result.rowCount === 0) {
      throw new Error('Materia en curso no encontrada')
    }
  } catch (error) {
    console.error('Error eliminando materia en curso:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('No se pudo eliminar la materia en curso')
  }
}

/**
 * Obtiene estadísticas de las materias en curso del usuario
 * @param usuarioId - ID del usuario para obtener sus estadísticas de materias en curso
 * @returns Promise con las estadísticas de materias en curso del usuario
 */
export async function getEstadisticasMateriasEnCurso(usuarioId: number): Promise<EstadisticasMateriasEnCursoDB> {
  try {
    const result = await query(
      `SELECT 
         COUNT(*) as total_materias,
         COUNT(CASE WHEN pm.cuatrimestre = 0 THEN 1 END) as materias_anual,
         COUNT(CASE WHEN pm.cuatrimestre = 1 THEN 1 END) as materias_primero,
         COUNT(CASE WHEN pm.cuatrimestre = 2 THEN 1 END) as materias_segundo,
         COUNT(CASE WHEN (umc.nota_primer_parcial IS NOT NULL OR umc.nota_segundo_parcial IS NOT NULL) THEN 1 END) as materias_con_parciales,
         AVG(CASE 
           WHEN umc.nota_primer_parcial IS NOT NULL AND umc.nota_segundo_parcial IS NOT NULL 
           THEN (umc.nota_primer_parcial + umc.nota_segundo_parcial) / 2.0
           WHEN umc.nota_primer_parcial IS NOT NULL 
           THEN umc.nota_primer_parcial
           WHEN umc.nota_segundo_parcial IS NOT NULL 
           THEN umc.nota_segundo_parcial
           ELSE NULL
         END) as promedio_parciales
       FROM prod.usuario_materia_cursada umc
       JOIN prod.plan_materia pm ON umc.plan_estudio_id = pm.plan_estudio_id 
                                 AND umc.materia_id = pm.materia_id
       WHERE umc.usuario_id = $1`,
      [usuarioId]
    )

    const estadisticasMaterias = result.rows[0] as unknown as EstadisticasMateriasEnCursoDB

    return estadisticasMaterias
  } catch (error) {
    console.error('Error obteniendo estadísticas de materias en curso:', error)
    throw new Error('No se pudieron obtener las estadísticas')
  }
}
