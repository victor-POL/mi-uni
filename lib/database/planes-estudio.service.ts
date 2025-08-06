import { query } from '@/lib/database/connection'
import type {
  PlanEstudioDB,
  MateriaPlanEstudioDetalleDB,
  EstadisticasPlanDB,
  PlanEstudioDetalleDB,
} from '@/models/database/planes-estudio.model'

/**
 * Obtiene un listado de todos los planes de estudio desde la base de datos (solo información básica: idPlan, nombreCarrera, anio)
 * @param carreraId - Opcional - ID de la carrera para filtrar los planes. Si no se proporciona, devuelve todos los planes
 * @returns Promise con array de planes de estudio con información básica
 */
export async function getPlanesEstudio(carreraId?: number): Promise<PlanEstudioDB[]> {
  try {
    await query(`SET search_path = prod, public`)

    const planesResQuery = await query(
      `
      SELECT 
        plan_estudio.id       as plan_id,
        plan_estudio.anio,
        carrera.nombre        as nombre_carrera
      FROM prod.plan_estudio
      JOIN prod.carrera ON plan_estudio.carrera_id = carrera.id
      WHERE (COALESCE($1::int, 0) = 0 OR carrera.id = $1::int)
      ORDER BY carrera.nombre ASC, plan_estudio.anio DESC
      `,
      [carreraId || null]
    )

    const planesDB: PlanEstudioDB[] = planesResQuery.rows as unknown as PlanEstudioDB[]

    return planesDB
  } catch (error) {
    console.error('Error DB listado planes')
    throw error
  }
}

/**
 * Obtiene un detalle del plan con todas las materias desde la base de datos (anioCursada, cuatrimestreCursada, horasSemanales, tipo, estado, correlativas, etc)
 * @param planEstudioId - ID del plan de estudio a obtener su detalle
 * @param usuarioId - Opcional - ID del usuario para obtener el estado de las materias (Pendiente, Aprobado, Cursando, etc)
 * @returns Promise con el detalle del plan de estudio o null si no se encuentra
 */
export async function getDetallePlanEstudio(
  planEstudioId: number,
  usuarioId?: number
): Promise<PlanEstudioDetalleDB | null> {
  try {
    await query(`SET search_path = prod, public`)

    // 1. Obtener la información básica del plan
    const datosPlanResQuery = await query(
      `
      SELECT 
        plan_estudio.id       as plan_id,
        plan_estudio.anio,
        carrera.nombre        as nombre_carrera
      FROM prod.plan_estudio
      JOIN prod.carrera       ON plan_estudio.carrera_id = carrera.id
      WHERE plan_estudio.id = $1
    `,
      [planEstudioId]
    )

    if (datosPlanResQuery.rows.length === 0) {
      return null
    }

    const planEstudioDB: PlanEstudioDB = datosPlanResQuery.rows[0]

    // 2. Obtener todas las materias del plan con correlativas y estadísticas
    const detallePlanResQuery = await query(
      `
      WITH materias_plan AS (
        SELECT 
          plan_materia.plan_estudio_id,
          plan_materia.materia_id,
          plan_materia.anio_cursada,
          plan_materia.cuatrimestre,
          materia.codigo_materia,
          materia.nombre_materia,
          materia.tipo,
          materia.horas_semanales
        FROM prod.plan_materia
        JOIN prod.materia         ON plan_materia.materia_id = materia.id
        WHERE plan_materia.plan_estudio_id = $1
      ),
      estadisticas_plan AS (
        SELECT
          plan_materia.plan_estudio_id,
          COUNT(*)                                  AS total_materias,
          SUM(materia.horas_semanales)                    AS horas_totales,
          MAX(plan_materia.anio_cursada)                      AS duracion_plan,
          SUM(
            CASE 
              WHEN NOT EXISTS (
                SELECT 1 
                FROM prod.correlativa c
                WHERE c.plan_estudio_id = plan_materia.plan_estudio_id
                  AND c.materia_id      = plan_materia.materia_id
              ) THEN 1 
              ELSE 0 
            END
          ) 										AS materias_sin_correlativas
        FROM prod.plan_materia
        INNER JOIN prod.materia  					ON materia.id = plan_materia.materia_id
        WHERE plan_materia.plan_estudio_id = $1
        GROUP BY plan_materia.plan_estudio_id
      ),
      correlativas_agrupadas AS (
        SELECT 
          correlativa.materia_id,
          array_agg(
            json_build_object(
              'codigo_materia', materia.codigo_materia,
              'nombre_materia', materia.nombre_materia
            ) 
            ORDER BY materia.codigo_materia
          ) as correlativas
        FROM prod.correlativa
        JOIN prod.materia  ON correlativa.correlativa_materia_id = materia.id
        WHERE correlativa.materia_id IN (SELECT materia_id FROM materias_plan)
          AND correlativa.plan_estudio_id = $1
        GROUP BY correlativa.materia_id
      ),
      usuario_tiene_plan AS (
        SELECT CASE 
          WHEN $2::int IS NULL THEN false
          WHEN EXISTS (
            SELECT 1 
            FROM prod.usuario_plan_estudio 
            JOIN prod.plan_estudio ON usuario_plan_estudio.plan_estudio_id = plan_estudio.id 
            WHERE usuario_plan_estudio.usuario_id = $2::int AND plan_estudio.id = $1
          ) THEN true
          ELSE false
        END as tiene_acceso
      )
      SELECT 
        materias_plan.*,
        estadisticas_plan.*,
        CASE 
          WHEN usuario_tiene_plan.tiene_acceso THEN (
            SELECT usuario_materia_estado.estado
            FROM prod.usuario_materia_estado
            WHERE usuario_materia_estado.usuario_id = $2::int
              AND usuario_materia_estado.plan_estudio_id = materias_plan.plan_estudio_id
              AND usuario_materia_estado.materia_id = materias_plan.materia_id
          )
          ELSE NULL
        END as estado_materia_usuario,
        COALESCE(correlativas_agrupadas.correlativas, ARRAY[]::json[]) as lista_correlativas
      FROM materias_plan
      LEFT JOIN correlativas_agrupadas ON materias_plan.materia_id = correlativas_agrupadas.materia_id
      CROSS JOIN usuario_tiene_plan
      CROSS JOIN estadisticas_plan
      ORDER BY 
        materias_plan.anio_cursada ASC, 
        materias_plan.cuatrimestre ASC, 
        materias_plan.codigo_materia ASC
    `,
      [planEstudioId, usuarioId]
    )

    const materiasPlanDB: MateriaPlanEstudioDetalleDB[] =
      detallePlanResQuery.rows as unknown as MateriaPlanEstudioDetalleDB[]

    // 3. Obtener las estadísticas del plan, tomo la primera fila ya que es la misma para todas las materias
    const estadisticasPlanDB: EstadisticasPlanDB = materiasPlanDB[0]

    const detallePlan: PlanEstudioDetalleDB = {
      plan_id: planEstudioDB.plan_id,
      nombre_carrera: planEstudioDB.nombre_carrera,
      anio: planEstudioDB.anio,
      estadisticas: estadisticasPlanDB,
      materias: materiasPlanDB,
    }

    return detallePlan
  } catch (error) {
    console.error('Error DB detalle plan')
    throw error
  }
}
