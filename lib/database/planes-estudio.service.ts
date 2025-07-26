import { Pool } from 'pg'
import type { PlanDeEstudioDetalle } from '@/models/plan-estudio.model'
import type { PlanEstudioAPIResponse } from '@/models/api/carreras.model'
import type { PlanEstudioDB } from '@/models/database/carreras.model'

// Configuración de base de datos
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'miuniversidad',
  password: process.env.DB_PASSWORD || 'victor1234',
  port: parseInt(process.env.DB_PORT || '5432'),
  ssl: false,
})

/**
 * Obtiene un listado de todos los planes de estudio (solo información básica: idPlan, nombreCarrera, anio)
 * @param idCarrera - ID de la carrera para filtrar los planes. Si no se proporciona, devuelve todos los planes
 * @returns Promise con array de planes de estudio con información básica
 */
export async function getListadoPlanes(idCarrea?: number): Promise<PlanEstudioAPIResponse[]> {
  try {
    await pool.query(`SET search_path = prod, public`)

    const result = await pool.query(
      `
      SELECT 
        plan_estudio.id       as plan_id,
        plan_estudio.anio,
        carrera.nombre        as nombre_carrera
      FROM prod.plan_estudio
      JOIN prod.carrera       ON plan_estudio.carrera_id = carrera.id
      ${idCarrea ? 'WHERE carrera.id = $1' : ''}
      ORDER BY 
        carrera.nombre    ASC, 
        plan_estudio.anio DESC
    `,
      [idCarrea]
    )

    const rows: PlanEstudioDB[] = result.rows

    return rows.map((row) => ({
      plan_id: row.plan_id,
      nombre_carrera: row.nombre_carrera,
      anio: row.anio,
    }))
  } catch (error) {
    console.error('Database error getting basic plans:', error)
    throw error
  }
}

/**
 * Obtiene un detalle del plan con todas las materias desde la base de datos (anioCursada, cuatrimestreCursada, horasSemanales, tipo, estado, correlativas, etc)
 */
export async function getDetallePlan(planId: number, usuarioId?: number): Promise<PlanDeEstudioDetalle | null> {
  try {
    await pool.query(`SET search_path = prod, public`)

    // Primero obtener la información básica del plan
    const planBasicInfo = await pool.query(
      `
      SELECT 
        plan_estudio.id       as plan_id,
        plan_estudio.anio,
        carrera.nombre        as nombre_carrera
      FROM prod.plan_estudio
      JOIN prod.carrera       ON plan_estudio.carrera_id = carrera.id
      WHERE plan_estudio.id = $1
    `,
      [planId]
    )

    if (planBasicInfo.rows.length === 0) {
      return null
    }

    const planInfo = planBasicInfo.rows[0]

    // Luego obtener todas las materias del plan con correlativas
    const materiasResult = await pool.query(
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
      correlativas_agrupadas AS (
        SELECT 
          correlativa.materia_id,
          array_agg(
            json_build_object(
              'codigoMateria', materia.codigo_materia,
              'nombreMateria', materia.nombre_materia
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
        CASE 
          WHEN usuario_tiene_plan.tiene_acceso THEN (
            SELECT usuario_materia_estado.estado
            FROM prod.usuario_materia_estado
            WHERE usuario_materia_estado.usuario_id = $2::int
              AND usuario_materia_estado.materia_id = materias_plan.materia_id
          )
          ELSE NULL
        END as estado_materia_usuario,
        COALESCE(correlativas_agrupadas.correlativas, ARRAY[]::json[]) as lista_correlativas
      FROM materias_plan
      LEFT JOIN correlativas_agrupadas ON materias_plan.materia_id = correlativas_agrupadas.materia_id
      CROSS JOIN usuario_tiene_plan
      ORDER BY 
        materias_plan.anio_cursada ASC, 
        materias_plan.cuatrimestre ASC, 
        materias_plan.codigo_materia ASC
    `,
      [planId, usuarioId]
    )

    // Transformar las materias al formato esperado
    const materias = materiasResult.rows.map((row) => ({
      codigoMateria: row.codigo_materia,
      nombreMateria: row.nombre_materia,
      anioCursada: row.anio_cursada,
      cuatrimestreCursada: row.cuatrimestre,
      horasSemanales: row.horas_semanales,
      tipo: row.tipo,
      estado: row.estado_materia_usuario,
      listaCorrelativas: row.lista_correlativas || [],
    }))

    return {
      idPlan: planInfo.plan_id,
      nombreCarrera: planInfo.nombre_carrera,
      anio: planInfo.anio,
      materias,
    }
  } catch (error) {
    console.error('Database error getting plan details:', error)
    throw error
  }
}

/**
 * Cierra la conexión del pool (útil para testing)
 */
export async function closeConnection() {
  await pool.end()
}
