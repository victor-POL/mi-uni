import { Pool } from 'pg'
import type { PlanDeEstudioDetalle } from '@/models/plan-estudio.model'

// Configuración de base de datos
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'miuniversidad',
  password: process.env.DB_PASSWORD || 'victor1234',
  port: parseInt(process.env.DB_PORT || '5432'),
  ssl: false
})

/**
 * Obtiene todos los planes de estudio básicos (solo información de resumen)
 */
export async function getAllPlanesBasicos() {
  try {
    // Configurar el search_path
    await pool.query(`SET search_path = prod, public`)
    
    // Consultar los planes de estudio básicos
    const result = await pool.query(`
      SELECT 
        pe.id as plan_id,
        pe.anio,
        c.nombre as nombre_carrera
      FROM prod.plan_estudio pe
      JOIN prod.carrera c ON pe.carrera_id = c.id
      ORDER BY c.nombre, pe.anio DESC
    `)

    return result.rows.map(row => ({
      idPlan: row.plan_id,
      nombreCarrera: row.nombre_carrera,
      anio: row.anio
    }))

  } catch (error) {
    console.error('Database error getting basic plans:', error)
    throw error
  }
}

/**
 * Obtiene un plan completo con todas las materias desde la base de datos
 */
export async function getPlanById(planId: number): Promise<PlanDeEstudioDetalle | null> {
  try {
    // Configurar el search_path
    await pool.query(`SET search_path = prod, public`)
    
    // Primero obtener la información básica del plan
    const planResult = await pool.query(`
      SELECT 
        pe.id as plan_id,
        pe.anio,
        c.nombre as nombre_carrera
      FROM prod.plan_estudio pe
      JOIN prod.carrera c ON pe.carrera_id = c.id
      WHERE pe.id = $1
    `, [planId])

    if (planResult.rows.length === 0) {
      return null
    }

    const planInfo = planResult.rows[0]

    // Luego obtener todas las materias del plan con correlativas
    const materiasResult = await pool.query(`
      WITH materias_plan AS (
        SELECT 
          pm.plan_estudio_id,
          pm.materia_id,
          pm.anio_cursada,
          pm.cuatrimestre,
          m.codigo_materia,
          m.nombre_materia,
          m.tipo,
          m.horas_semanales
        FROM prod.plan_materia pm
        JOIN prod.materia m ON pm.materia_id = m.id
        WHERE pm.plan_estudio_id = $1
      ),
      correlativas_agrupadas AS (
        SELECT 
          c.materia_id,
          array_agg(m_corr.codigo_materia ORDER BY m_corr.codigo_materia) as correlativas
        FROM prod.correlativa c
        JOIN prod.materia m_corr ON c.correlativa_materia_id = m_corr.id
        WHERE c.materia_id IN (SELECT materia_id FROM materias_plan)
        GROUP BY c.materia_id
      )
      SELECT 
        mp.*,
        COALESCE(ca.correlativas, ARRAY[]::text[]) as lista_correlativas
      FROM materias_plan mp
      LEFT JOIN correlativas_agrupadas ca ON mp.materia_id = ca.materia_id
      ORDER BY mp.anio_cursada, mp.cuatrimestre, mp.codigo_materia
    `, [planId])

    // Transformar las materias al formato esperado
    const materias = materiasResult.rows.map(row => ({
      codigoMateria: row.codigo_materia,
      nombreMateria: row.nombre_materia,
      anioCursada: row.anio_cursada,
      cuatrimestreCursada: row.cuatrimestre,
      horasSemanales: row.horas_semanales || 0,
      tipo: row.tipo || 'cursable',
      estado: 'Pendiente' as const,
      listaCorrelativas: row.lista_correlativas || []
    }))

    return {
      idPlan: planInfo.plan_id,
      nombreCarrera: planInfo.nombre_carrera,
      anio: planInfo.anio,
      materias
    }

  } catch (error) {
    console.error('Database error getting plan details:', error)
    throw error
  }
}

/**
 * Busca planes por nombre de carrera
 */
export async function searchPlanesByCarrera(carreraNombre: string) {
  try {
    await pool.query(`SET search_path = prod, public`)
    
    const result = await pool.query(`
      SELECT 
        pe.id as plan_id,
        pe.anio,
        c.nombre as nombre_carrera
      FROM prod.plan_estudio pe
      JOIN prod.carrera c ON pe.carrera_id = c.id
      WHERE LOWER(c.nombre) LIKE LOWER($1)
      ORDER BY c.nombre, pe.anio DESC
    `, [`%${carreraNombre}%`])

    return result.rows.map(row => ({
      idPlan: row.plan_id,
      nombreCarrera: row.nombre_carrera,
      anio: row.anio
    }))

  } catch (error) {
    console.error('Database error searching plans:', error)
    throw error
  }
}

/**
 * Cierra la conexión del pool (útil para testing)
 */
export async function closeConnection() {
  await pool.end()
}
