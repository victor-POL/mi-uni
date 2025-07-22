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
        notaPrimerParcial: row.nota_primer_parcial ? parseFloat(row.nota_primer_parcial) : undefined,
        notaSegundoParcial: row.nota_segundo_parcial ? parseFloat(row.nota_segundo_parcial) : undefined,
        notaRecuperatorioPrimerParcial: row.nota_recuperatorio_primer_parcial ? parseFloat(row.nota_recuperatorio_primer_parcial) : undefined,
        notaRecuperatorioSegundoParcial: row.nota_recuperatorio_segundo_parcial ? parseFloat(row.nota_recuperatorio_segundo_parcial) : undefined,
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

    // Verificar que el usuario tenga un año académico establecido
    const tieneAnioAcademico = await query(
      `SELECT 1 FROM prod.usuario_anio_academico WHERE usuario_id = $1`,
      [usuarioId]
    )
    
    if (tieneAnioAcademico.rows.length === 0) {
      throw new Error('Debe establecer un año académico antes de agregar materias')
    }
    
    // Verificar que no esté ya cursando la materia
    const yaEstaEnCurso = await query(
      'SELECT 1 FROM prod.usuario_materia_cursada WHERE usuario_id = $1 AND plan_estudio_id = $2 AND materia_id = $3',
      [usuarioId, datos.planEstudioId, datos.materiaId]
    )
    
    if (yaEstaEnCurso.rows.length > 0) {
      throw new Error('Ya está cursando esta materia')
    }
    
    // Insertar la materia en curso
    await query(
      `INSERT INTO prod.usuario_materia_cursada 
       (usuario_id, plan_estudio_id, materia_id, fecha_actualizacion)
       VALUES ($1, $2, $3, NOW())`,
      [usuarioId, datos.planEstudioId, datos.materiaId]
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
  } catch (error) {
    console.error('Error actualizando notas de materia en curso:', error)
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

// Obtener estadísticas de materias en curso
export async function obtenerEstadisticasMateriasEnCurso(usuarioId: number): Promise<EstadisticasMateriasEnCurso> {
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
