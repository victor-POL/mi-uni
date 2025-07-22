import { query } from '@/connection'
import type { MateriaEnCurso, MateriaHistorial, EstadisticasMateriasEnCurso, EstadisticasHistorial } from '@/models/carrera-detalle.model'

export interface Carrera {
  id: number
  nombre: string
}

export interface PlanEstudio {
  id: number
  carrera_id: number
  anio: number
  carrera_nombre?: string
}

export interface UsuarioPlanEstudio {
  usuario_id: number
  plan_estudio_id: number
  carrera_id: number
  carrera_nombre: string
  anio: number
}

interface MateriaDelPlan {
  materia_id: number
}

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

// Obtener todas las carreras disponibles
export async function obtenerCarreras(): Promise<Carrera[]> {
  try {
    const result = await query('SELECT id, nombre FROM prod.carrera ORDER BY nombre')
    return result.rows as unknown as Carrera[]
  } catch (error) {
    console.error('Error obteniendo carreras:', error)
    throw new Error('No se pudieron obtener las carreras')
  }
}

// Obtener planes de estudio por carrera
export async function obtenerPlanesPorCarrera(carreraId: number): Promise<PlanEstudio[]> {
  try {
    const result = await query(
      `SELECT pe.id, pe.carrera_id, pe.anio, c.nombre as carrera_nombre
       FROM prod.plan_estudio pe
       JOIN prod.carrera c ON pe.carrera_id = c.id
       WHERE pe.carrera_id = $1
       ORDER BY pe.anio DESC`,
      [carreraId]
    )
    return result.rows as unknown as PlanEstudio[]
  } catch (error) {
    console.error('Error obteniendo planes de estudio:', error)
    throw new Error('No se pudieron obtener los planes de estudio')
  }
}

// Obtener carreras del usuario
export async function obtenerCarrerasUsuario(usuarioId: number): Promise<UsuarioPlanEstudio[]> {
  try {
    const result = await query(
      `SELECT ups.usuario_id, ups.plan_estudio_id, 
              pe.carrera_id, c.nombre as carrera_nombre, pe.anio
       FROM prod.usuario_plan_estudio ups
       JOIN prod.plan_estudio pe ON ups.plan_estudio_id = pe.id
       JOIN prod.carrera c ON pe.carrera_id = c.id
       WHERE ups.usuario_id = $1
       ORDER BY c.nombre, pe.anio DESC`,
      [usuarioId]
    )
    return result.rows as unknown as UsuarioPlanEstudio[]
  } catch (error) {
    console.error('Error obteniendo carreras del usuario:', error)
    throw new Error('No se pudieron obtener las carreras del usuario')
  }
}

// Agregar carrera al usuario
export async function agregarCarreraUsuario(usuarioId: number, planEstudioId: number): Promise<void> {
  try {
    // Verificar si ya existe la relación
    const existeResult = await query(
      'SELECT 1 FROM prod.usuario_plan_estudio WHERE usuario_id = $1 AND plan_estudio_id = $2',
      [usuarioId, planEstudioId]
    )

    if (existeResult.rows.length > 0) {
      throw new Error('Ya estás inscrito en este plan de estudio')
    }

    // Iniciar transacción para asegurar consistencia
    await query('BEGIN', [])

    try {
      // 1. Insertar la relación usuario-plan
      await query(
        'INSERT INTO prod.usuario_plan_estudio (usuario_id, plan_estudio_id) VALUES ($1, $2)',
        [usuarioId, planEstudioId]
      )

      // 2. Obtener todas las materias del plan de estudio
      const materiasResult = await query(
        `SELECT pm.materia_id 
         FROM prod.plan_materia pm 
         WHERE pm.plan_estudio_id = $1`,
        [planEstudioId]
      )

      // 3. Crear registros de estado inicial para todas las materias
      if (materiasResult.rows.length > 0) {
        // Insertar cada materia con estado 'Pendiente'
        for (const materia of materiasResult.rows as unknown as MateriaDelPlan[]) {
          await query(
            `INSERT INTO prod.usuario_materia_estado 
             (usuario_id, plan_estudio_id, materia_id, estado, anio_cursada, cuatrimestre, nota)
             VALUES ($1, $2, $3, 'Pendiente', NULL, NULL, NULL)`,
            [usuarioId, planEstudioId, materia.materia_id]
          )
        }
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

// Obtener progreso de materias del usuario en un plan específico
export async function obtenerProgresoUsuarioPlan(usuarioId: number, planEstudioId: number): Promise<EstadoMateriaUsuario[]> {
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

// Obtener estadísticas de progreso del usuario
export async function obtenerEstadisticasProgreso(usuarioId: number, planEstudioId: number) {
  try {
    const result = await query(
      `SELECT 
         (SELECT COUNT(*) FROM prod.plan_materia WHERE plan_estudio_id = $2) as total_materias_plan,
         COUNT(CASE WHEN ume.estado = 'Aprobada' THEN 1 END) as materias_aprobadas,
         COUNT(CASE WHEN ume.estado = 'En Final' THEN 1 END) as materias_en_final,
         COUNT(CASE WHEN ume.estado = 'Pendiente' THEN 1 END) as materias_pendientes,
         AVG(CASE WHEN ume.nota IS NOT NULL THEN ume.nota END) as promedio_general
       FROM prod.usuario_materia_estado ume
       WHERE ume.usuario_id = $1 AND ume.plan_estudio_id = $2`,
      [usuarioId, planEstudioId]
    )
    
    const stats = result.rows[0] as any
    const totalMaterias = parseInt(stats.total_materias_plan)
    const materiasAprobadas = parseInt(stats.materias_aprobadas) || 0
    
    // Para "En Curso" consultamos la tabla usuario_materia_cursada
    const cursandoResult = await query(
      `SELECT COUNT(DISTINCT materia_id) as materias_en_curso
       FROM prod.usuario_materia_cursada umc
       WHERE umc.usuario_id = $1 AND umc.plan_estudio_id = $2`,
      [usuarioId, planEstudioId]
    )
    
    const materiasEnCurso = parseInt((cursandoResult.rows[0] as any)?.materias_en_curso || '0') || 0
    
    return {
      totalMaterias: totalMaterias,
      materiasAprobadas: materiasAprobadas,
      materiasEnCurso: materiasEnCurso,
      materiasEnFinal: parseInt(stats.materias_en_final) || 0,
      materiasPendientes: parseInt(stats.materias_pendientes) || 0,
      promedioGeneral: stats.promedio_general ? parseFloat(stats.promedio_general) : null,
      porcentajeProgreso: totalMaterias > 0 ? Math.round((materiasAprobadas / totalMaterias) * 100) : 0
    }
  } catch (error) {
    console.error('Error obteniendo estadísticas de progreso:', error)
    throw new Error('No se pudieron obtener las estadísticas de progreso')
  }
}

// Eliminar carrera del usuario
export async function eliminarCarreraUsuario(usuarioId: number, planEstudioId: number): Promise<void> {
  try {
    const result = await query(
      'DELETE FROM prod.usuario_plan_estudio WHERE usuario_id = $1 AND plan_estudio_id = $2',
      [usuarioId, planEstudioId]
    )

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

// Obtener materias en curso para un usuario y plan de estudio
export async function obtenerMateriasEnCurso(usuarioId: number, planEstudioId: number): Promise<MateriaEnCurso[]> {
  try {
    const result = await query(
      `SELECT 
         umc.materia_id as id,
         m.codigo_materia as codigo,
         m.nombre_materia as nombre,
         pm.anio_cursada as anio,
         pm.cuatrimestre,
         umc.anio_cursada as anio_cursada,
         umc.cuatrimestre_cursada as cuatrimestre_cursada,
         umc.nota_primer_parcial as nota_primer_parcial,
         umc.nota_segundo_parcial as nota_segundo_parcial,
         umc.nota_recuperatorio_primer_parcial as nota_recuperatorio_primero,
         umc.nota_recuperatorio_segundo_parcial as nota_recuperatorio_segundo,
         umc.fecha_actualizacion,
         m.horas_semanales,
         m.tipo
       FROM prod.usuario_materia_cursada umc
       JOIN prod.materia m ON umc.materia_id = m.id
       JOIN prod.plan_materia pm ON umc.plan_estudio_id = pm.plan_estudio_id 
                                 AND umc.materia_id = pm.materia_id
       WHERE umc.usuario_id = $1 AND umc.plan_estudio_id = $2
       ORDER BY umc.anio_cursada DESC, umc.cuatrimestre_cursada DESC, m.nombre_materia`,
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
      notaPrimerParcial: row.nota_primer_parcial ? parseFloat(row.nota_primer_parcial) : undefined,
      notaSegundoParcial: row.nota_segundo_parcial ? parseFloat(row.nota_segundo_parcial) : undefined,
      notaRecuperatorioPrimero: row.nota_recuperatorio_primero ? parseFloat(row.nota_recuperatorio_primero) : undefined,
      notaRecuperatorioSegundo: row.nota_recuperatorio_segundo ? parseFloat(row.nota_recuperatorio_segundo) : undefined,
      fechaActualizacion: new Date(row.fecha_actualizacion),
      horasSemanales: row.horas_semanales,
      tipo: row.tipo as 'cursable' | 'electiva'
    }))
  } catch (error) {
    console.error('Error obteniendo materias en curso:', error)
    throw new Error('No se pudieron obtener las materias en curso')
  }
}

// Obtener historial académico para un usuario y plan de estudio
export async function obtenerHistorialAcademico(usuarioId: number, planEstudioId: number): Promise<MateriaHistorial[]> {
  try {
    // Consultar materias con estado (aprobadas, pendientes, en final)
    const resultEstado = await query(
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
       WHERE ume.usuario_id = $1 AND ume.plan_estudio_id = $2`,
      [usuarioId, planEstudioId]
    )

    // Consultar materias en curso
    const resultCursando = await query(
      `SELECT 
         umc.materia_id as id,
         m.codigo_materia as codigo,
         m.nombre_materia as nombre,
         pm.anio_cursada as anio,
         pm.cuatrimestre,
         NULL as nota,
         umc.anio_cursada as anio_cursada,
         umc.cuatrimestre_cursada as cuatrimestre_cursada,
         'En Curso' as estado,
         umc.fecha_actualizacion,
         m.horas_semanales,
         m.tipo
       FROM prod.usuario_materia_cursada umc
       JOIN prod.materia m ON umc.materia_id = m.id
       JOIN prod.plan_materia pm ON umc.plan_estudio_id = pm.plan_estudio_id 
                                 AND umc.materia_id = pm.materia_id
       WHERE umc.usuario_id = $1 AND umc.plan_estudio_id = $2`,
      [usuarioId, planEstudioId]
    )

    // Combinar ambos resultados
    const todasLasMaterias = [
      ...resultEstado.rows,
      ...resultCursando.rows
    ]

    // Eliminar duplicados (en caso de que una materia esté en ambas tablas)
    const materiasUnicas = new Map()
    todasLasMaterias.forEach((materia: any) => {
      const key = materia.id
      if (!materiasUnicas.has(key) || materia.estado === 'En Curso') {
        // Priorizar "En Curso" sobre otros estados porque significa que actualmente se está cursando
        materiasUnicas.set(key, materia)
      }
    })

    // Convertir a array y ordenar
    const materiasArray = Array.from(materiasUnicas.values()).sort((a: any, b: any) => {
      // Orden de prioridad de estados
      const ordenEstado: Record<string, number> = {
        'Aprobada': 1,
        'En Final': 2,
        'En Curso': 3,
        'Pendiente': 4
      }
      
      if (ordenEstado[a.estado] !== ordenEstado[b.estado]) {
        return ordenEstado[a.estado] - ordenEstado[b.estado]
      }
      
      // Si el estado es igual, ordenar por año y cuatrimestre del plan
      if (a.anio !== b.anio) {
        return a.anio - b.anio
      }
      
      if (a.cuatrimestre !== b.cuatrimestre) {
        return a.cuatrimestre - b.cuatrimestre
      }
      
      // Por último, ordenar alfabéticamente por nombre
      return a.nombre.localeCompare(b.nombre)
    })

    return materiasArray.map((row: any) => ({
      id: row.id,
      codigo: row.codigo,
      nombre: row.nombre,
      anio: row.anio,
      cuatrimestre: row.cuatrimestre,
      nota: row.nota ? parseFloat(row.nota) : undefined,
      anioCursada: row.anio_cursada,
      cuatrimestreCursada: row.cuatrimestre_cursada,
      estado: row.estado as 'Aprobada' | 'Pendiente' | 'En Final' | 'En Curso',
      fechaActualizacion: new Date(row.fecha_actualizacion),
      horasSemanales: row.horas_semanales,
      tipo: row.tipo as 'cursable' | 'electiva'
    }))
  } catch (error) {
    console.error('Error obteniendo historial académico:', error)
    throw new Error('No se pudo obtener el historial académico')
  }
}

// Obtener estadísticas de materias en curso
export async function obtenerEstadisticasMateriasEnCurso(usuarioId: number, planEstudioId: number): Promise<EstadisticasMateriasEnCurso> {
  try {
    const result = await query(
      `SELECT 
         COUNT(*) as total_materias,
         COUNT(CASE WHEN umc.cuatrimestre_cursada = 1 THEN 1 END) as materias_primero,
         COUNT(CASE WHEN umc.cuatrimestre_cursada = 2 THEN 1 END) as materias_segundo,
         AVG(
           CASE 
             WHEN umc.nota_primer_parcial IS NOT NULL OR umc.nota_segundo_parcial IS NOT NULL 
             THEN COALESCE(umc.nota_primer_parcial, 0) + COALESCE(umc.nota_segundo_parcial, 0)
             ELSE NULL
           END
         ) as promedio_parciales,
         COUNT(
           CASE 
             WHEN umc.nota_primer_parcial IS NOT NULL OR umc.nota_segundo_parcial IS NOT NULL 
             THEN 1 
           END
         ) as materias_con_parciales
       FROM prod.usuario_materia_cursada umc
       WHERE umc.usuario_id = $1 AND umc.plan_estudio_id = $2`,
      [usuarioId, planEstudioId]
    )
    
    const stats = result.rows[0] as any
    return {
      totalMaterias: parseInt(stats.total_materias) || 0,
      materiasPrimero: parseInt(stats.materias_primero) || 0,
      materiasSegundo: parseInt(stats.materias_segundo) || 0,
      promedioNotasParciales: stats.promedio_parciales ? parseFloat(stats.promedio_parciales) : undefined,
      materiasConParciales: parseInt(stats.materias_con_parciales) || 0
    }
  } catch (error) {
    console.error('Error obteniendo estadísticas de materias en curso:', error)
    throw new Error('No se pudieron obtener las estadísticas de materias en curso')
  }
}

// Obtener estadísticas del historial académico
export async function obtenerEstadisticasHistorial(usuarioId: number, planEstudioId: number): Promise<EstadisticasHistorial> {
  try {
    // Obtener estadísticas de materias con estado
    const resultEstado = await query(
      `SELECT 
         COUNT(CASE WHEN ume.estado = 'Aprobada' THEN 1 END) as materias_aprobadas,
         COUNT(CASE WHEN ume.estado = 'Pendiente' THEN 1 END) as materias_pendientes,
         COUNT(CASE WHEN ume.estado = 'En Final' THEN 1 END) as materias_en_final,
         AVG(CASE WHEN ume.estado = 'Aprobada' AND ume.nota IS NOT NULL THEN ume.nota END) as promedio_general
       FROM prod.usuario_materia_estado ume
       WHERE ume.usuario_id = $1 AND ume.plan_estudio_id = $2`,
      [usuarioId, planEstudioId]
    )

    // Obtener cantidad de materias en curso
    const resultCursando = await query(
      `SELECT COUNT(*) as materias_en_curso
       FROM prod.usuario_materia_cursada umc
       WHERE umc.usuario_id = $1 AND umc.plan_estudio_id = $2`,
      [usuarioId, planEstudioId]
    )

    // Obtener total de materias en el plan
    const resultTotal = await query(
      `SELECT COUNT(*) as total_materias_plan
       FROM prod.plan_materia 
       WHERE plan_estudio_id = $1`,
      [planEstudioId]
    )
    
    const statsEstado = resultEstado.rows[0] as any
    const statsCursando = resultCursando.rows[0] as any
    const statsTotal = resultTotal.rows[0] as any

    return {
      totalMaterias: parseInt(statsTotal.total_materias_plan) || 0,
      materiasAprobadas: parseInt(statsEstado.materias_aprobadas) || 0,
      materiasPendientes: parseInt(statsEstado.materias_pendientes) || 0,
      materiasEnFinal: parseInt(statsEstado.materias_en_final) || 0,
      materiasEnCurso: parseInt(statsCursando.materias_en_curso) || 0,
      promedioGeneral: statsEstado.promedio_general ? parseFloat(statsEstado.promedio_general) : undefined
    }
  } catch (error) {
    console.error('Error obteniendo estadísticas del historial:', error)
    throw new Error('No se pudieron obtener las estadísticas del historial')
  }
}
