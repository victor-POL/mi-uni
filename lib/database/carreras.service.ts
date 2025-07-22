import { query } from '@/connection'

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
         COUNT(*) as total_materias,
         COUNT(CASE WHEN estado = 'Aprobada' THEN 1 END) as materias_aprobadas,
         COUNT(CASE WHEN estado = 'En Curso' THEN 1 END) as materias_en_curso,
         COUNT(CASE WHEN estado = 'Regularizada' THEN 1 END) as materias_regularizadas,
         COUNT(CASE WHEN estado = 'Pendiente' THEN 1 END) as materias_pendientes,
         AVG(CASE WHEN nota IS NOT NULL THEN nota END) as promedio_general,
         SUM(CASE WHEN estado = 'Aprobada' THEN m.horas_semanales ELSE 0 END) as creditos_obtenidos,
         SUM(m.horas_semanales) as creditos_totales
       FROM prod.usuario_materia_estado ume
       JOIN prod.materia m ON ume.materia_id = m.id
       WHERE ume.usuario_id = $1 AND ume.plan_estudio_id = $2`,
      [usuarioId, planEstudioId]
    )
    
    const stats = result.rows[0]
    return {
      totalMaterias: parseInt(stats.total_materias),
      materiasAprobadas: parseInt(stats.materias_aprobadas),
      materiasEnCurso: parseInt(stats.materias_en_curso),
      materiasRegularizadas: parseInt(stats.materias_regularizadas),
      materiasPendientes: parseInt(stats.materias_pendientes),
      promedioGeneral: stats.promedio_general ? parseFloat(stats.promedio_general) : null,
      creditosObtenidos: parseInt(stats.creditos_obtenidos),
      creditosTotales: parseInt(stats.creditos_totales),
      porcentajeProgreso: Math.round((parseInt(stats.materias_aprobadas) / parseInt(stats.total_materias)) * 100)
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
