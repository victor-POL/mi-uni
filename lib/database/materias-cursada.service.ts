import { query } from '@/connection'
import type { 
  MateriaCursada, 
  MateriaCursadaPorCarrera, 
  NuevaMateriaEnCurso, 
  ActualizarNotasMateriaEnCurso,
  EstadisticasMateriasEnCurso 
} from '@/models/materias-cursada.model'

// Obtener materias en curso agrupadas por carrera
export async function obtenerMateriasEnCursoPorCarrera(usuarioId: number): Promise<MateriaCursadaPorCarrera[]> {
  try {
    const result = await query(
      `SELECT 
         ume.usuario_id,
         ume.plan_estudio_id,
         ume.materia_id,
         ume.anio_cursada,
         ume.cuatrimestre,
         umc.nota_primer_parcial,
         umc.nota_segundo_parcial,
         umc.nota_recuperatorio_primer_parcial,
         umc.nota_recuperatorio_segundo_parcial,
         ume.fecha_actualizacion,
         m.codigo_materia,
         m.nombre_materia,
         m.tipo,
         m.horas_semanales,
         pm.anio_cursada as anio_en_plan,
         pm.cuatrimestre as cuatrimestre_en_plan,
         c.id as carrera_id,
         c.nombre as carrera_nombre,
         pe.anio as plan_anio
       FROM prod.usuario_materia_estado ume
       LEFT JOIN prod.usuario_materia_cursada umc ON ume.usuario_id = umc.usuario_id 
                                                  AND ume.plan_estudio_id = umc.plan_estudio_id 
                                                  AND ume.materia_id = umc.materia_id
       JOIN prod.materia m ON ume.materia_id = m.id
       JOIN prod.plan_materia pm ON ume.plan_estudio_id = pm.plan_estudio_id 
                                 AND ume.materia_id = pm.materia_id
       JOIN prod.plan_estudio pe ON ume.plan_estudio_id = pe.id
       JOIN prod.carrera c ON pe.carrera_id = c.id
       WHERE ume.usuario_id = $1 AND ume.estado = 'Cursando'
       ORDER BY c.nombre, pe.anio DESC, pm.anio_cursada, pm.cuatrimestre, m.nombre_materia`,
      [usuarioId]
    )

    // Agrupar por carrera
    const materiasPorCarrera = new Map<string, MateriaCursadaPorCarrera>()
    
    result.rows.forEach((row: any) => {
      const carreraKey = `${row.carrera_id}-${row.plan_estudio_id}`
      
      if (!materiasPorCarrera.has(carreraKey)) {
        materiasPorCarrera.set(carreraKey, {
          carreraId: row.carrera_id,
          carreraNombre: row.carrera_nombre,
          planEstudioId: row.plan_estudio_id,
          planAnio: row.plan_anio,
          materias: []
        })
      }
      
      const materia: MateriaCursada = {
        usuarioId: row.usuario_id,
        planEstudioId: row.plan_estudio_id,
        materiaId: row.materia_id,
        anioCursada: row.anio_cursada,
        cuatrimestreCursada: row.cuatrimestre,
        notaPrimerParcial: row.nota_primer_parcial || undefined,
        notaSegundoParcial: row.nota_segundo_parcial || undefined,
        notaRecuperatorioPrimerParcial: row.nota_recuperatorio_primer_parcial || undefined,
        notaRecuperatorioSegundoParcial: row.nota_recuperatorio_segundo_parcial || undefined,
        fechaActualizacion: new Date(row.fecha_actualizacion),
        codigoMateria: row.codigo_materia,
        nombreMateria: row.nombre_materia,
        tipo: row.tipo as 'cursable' | 'electiva',
        horasSemanales: row.horas_semanales,
        anioEnPlan: row.anio_en_plan,
        cuatrimestreEnPlan: row.cuatrimestre_en_plan,
        carreraNombre: row.carrera_nombre,
        planAnio: row.plan_anio
      }
      
      const carreraData = materiasPorCarrera.get(carreraKey)
      if (carreraData) {
        carreraData.materias.push(materia)
      }
    })
    
    return Array.from(materiasPorCarrera.values())
  } catch (error) {
    console.error('Error obteniendo materias en curso por carrera:', error)
    throw new Error('No se pudieron obtener las materias en curso')
  }
}

// Obtener materias disponibles para agregar a curso (de un plan específico)
export async function obtenerMateriasDisponiblesParaCurso(usuarioId: number, planEstudioId: number) {
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
    
    return result.rows.map((row: any) => ({
      id: row.id,
      codigo: row.codigo_materia,
      nombre: row.nombre_materia,
      tipo: row.tipo,
      horasSemanales: row.horas_semanales,
      anioEnPlan: row.anio_cursada,
      cuatrimestreEnPlan: row.cuatrimestre
    }))
  } catch (error) {
    console.error('Error obteniendo materias disponibles:', error)
    throw new Error('No se pudieron obtener las materias disponibles')
  }
}

// Agregar nueva materia en curso
export async function agregarMateriaEnCurso(usuarioId: number, datos: NuevaMateriaEnCurso): Promise<void> {
  try {
    // Verificar que el usuario esté inscrito en el plan
    const usuarioEnPlan = await query(
      'SELECT 1 FROM prod.usuario_plan_estudio WHERE usuario_id = $1 AND plan_estudio_id = $2',
      [usuarioId, datos.planEstudioId]
    )
    
    if (usuarioEnPlan.rows.length === 0) {
      throw new Error('Usuario no inscrito en este plan de estudio')
    }
    
    // Verificar que la materia pertenezca al plan
    const materiaEnPlan = await query(
      'SELECT 1 FROM prod.plan_materia WHERE plan_estudio_id = $1 AND materia_id = $2',
      [datos.planEstudioId, datos.materiaId]
    )
    
    if (materiaEnPlan.rows.length === 0) {
      throw new Error('Materia no pertenece al plan de estudio')
    }
    
    // Verificar que no esté ya cursando o haya aprobado la materia
    const yaExiste = await query(
      'SELECT estado FROM prod.usuario_materia_estado WHERE usuario_id = $1 AND plan_estudio_id = $2 AND materia_id = $3',
      [usuarioId, datos.planEstudioId, datos.materiaId]
    )
    
    if (yaExiste.rows.length > 0) {
      const estado = (yaExiste.rows[0] as any).estado
      if (estado === 'Cursando') {
        throw new Error('Ya está cursando esta materia')
      } else if (estado === 'Aprobada') {
        throw new Error('Esta materia ya está aprobada')
      }
    }
    
    // Insertar la materia en curso en usuario_materia_estado
    await query(
      `INSERT INTO prod.usuario_materia_estado 
       (usuario_id, plan_estudio_id, materia_id, anio_cursada, cuatrimestre, estado, fecha_actualizacion)
       VALUES ($1, $2, $3, $4, $5, 'Cursando', NOW())`,
      [usuarioId, datos.planEstudioId, datos.materiaId, datos.anioCursada, datos.cuatrimestreCursada]
    )
  } catch (error) {
    console.error('Error agregando materia en curso:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('No se pudo agregar la materia en curso')
  }
}

// Actualizar notas de una materia en curso
export async function actualizarNotasMateriaEnCurso(datos: ActualizarNotasMateriaEnCurso): Promise<void> {
  try {
    // Verificar que la materia esté en curso
    const materiaEnCurso = await query(
      'SELECT 1 FROM prod.usuario_materia_estado WHERE usuario_id = $1 AND plan_estudio_id = $2 AND materia_id = $3 AND estado = $4',
      [datos.usuarioId, datos.planEstudioId, datos.materiaId, 'Cursando']
    )
    
    if (materiaEnCurso.rows.length === 0) {
      throw new Error('La materia no está en curso')
    }
    
    // Insertar o actualizar en usuario_materia_cursada
    const existeRegistro = await query(
      'SELECT 1 FROM prod.usuario_materia_cursada WHERE usuario_id = $1 AND plan_estudio_id = $2 AND materia_id = $3',
      [datos.usuarioId, datos.planEstudioId, datos.materiaId]
    )
    
    if (existeRegistro.rows.length === 0) {
      // Insertar nuevo registro
      await query(
        `INSERT INTO prod.usuario_materia_cursada 
         (usuario_id, plan_estudio_id, materia_id, nota_primer_parcial, nota_segundo_parcial, 
          nota_recuperatorio_primer_parcial, nota_recuperatorio_segundo_parcial, fecha_actualizacion)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
        [
          datos.usuarioId,
          datos.planEstudioId,
          datos.materiaId,
          datos.notaPrimerParcial,
          datos.notaSegundoParcial, 
          datos.notaRecuperatorioPrimerParcial,
          datos.notaRecuperatorioSegundoParcial
        ]
      )
    } else {
      // Actualizar registro existente
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
          datos.materiaId
        ]
      )
    }
  } catch (error) {
    console.error('Error actualizando notas de materia en curso:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('No se pudieron actualizar las notas')
  }
}

// Eliminar materia en curso
export async function eliminarMateriaEnCurso(
  usuarioId: number, 
  planEstudioId: number, 
  materiaId: number
): Promise<void> {
  try {
    // Eliminar de usuario_materia_estado (esto eliminará el estado de 'Cursando')
    const result = await query(
      `DELETE FROM prod.usuario_materia_estado 
       WHERE usuario_id = $1 
         AND plan_estudio_id = $2 
         AND materia_id = $3
         AND estado = 'Cursando'`,
      [usuarioId, planEstudioId, materiaId]
    )
    
    if (result.rowCount === 0) {
      throw new Error('Materia en curso no encontrada')
    }
    
    // También eliminar las notas asociadas en usuario_materia_cursada (opcional)
    await query(
      `DELETE FROM prod.usuario_materia_cursada 
       WHERE usuario_id = $1 
         AND plan_estudio_id = $2 
         AND materia_id = $3`,
      [usuarioId, planEstudioId, materiaId]
    )
  } catch (error) {
    console.error('Error eliminando materia en curso:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('No se pudo eliminar la materia en curso')
  }
}

// Obtener estadísticas de materias en curso
export async function obtenerEstadisticasMateriasEnCurso(usuarioId: number): Promise<EstadisticasMateriasEnCurso> {
  try {
    const result = await query(
      `SELECT 
         COUNT(*) as total_materias,
         COUNT(CASE WHEN ume.cuatrimestre = 0 THEN 1 END) as materias_anual,
         COUNT(CASE WHEN ume.cuatrimestre = 1 THEN 1 END) as materias_primero,
         COUNT(CASE WHEN ume.cuatrimestre = 2 THEN 1 END) as materias_segundo,
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
       FROM prod.usuario_materia_estado ume
       LEFT JOIN prod.usuario_materia_cursada umc ON ume.usuario_id = umc.usuario_id 
                                                  AND ume.plan_estudio_id = umc.plan_estudio_id 
                                                  AND ume.materia_id = umc.materia_id
       WHERE ume.usuario_id = $1 AND ume.estado = 'Cursando'`,
      [usuarioId]
    )
    
    const stats = result.rows[0] as any
    return {
      totalMaterias: parseInt(stats.total_materias) || 0,
      materiasAnual: parseInt(stats.materias_anual) || 0,
      materiasPrimero: parseInt(stats.materias_primero) || 0,
      materiasSegundo: parseInt(stats.materias_segundo) || 0,
      promedioNotasParciales: stats.promedio_parciales ? parseFloat(stats.promedio_parciales) : undefined,
      materiasConParciales: parseInt(stats.materias_con_parciales) || 0
    }
  } catch (error) {
    console.error('Error obteniendo estadísticas de materias en curso:', error)
    throw new Error('No se pudieron obtener las estadísticas')
  }
}
