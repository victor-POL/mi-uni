import type { AnioAcademicoUsuarioDB } from '@/models/database/materias-cursada.model'
import { query } from './connection'

export interface AnioAcademico {
  usuarioId: string
  anioAcademico: number
  fechaActualizacion: Date
}

// Obtener el año académico actual del usuario
export async function obtenerAnioAcademicoUsuario(usuarioId: number): Promise<AnioAcademicoUsuarioDB | null> {
  try {
    const result = await query(
      `SELECT 
          anio_academico, 
          fecha_actualizacion
       FROM prod.usuario_anio_academico 
       WHERE usuario_id = $1
       LIMIT 1
       `,
      [usuarioId]
    )

    return result.rows.length > 0 ? result.rows[0] : null
  } catch (error) {
    console.error('Error obteniendo año académico:', error)
    throw new Error('Error al obtener el año académico')
  }
}

// Establecer o actualizar el año académico del usuario
export async function establecerAnioAcademicoUsuario(usuarioId: string, anioAcademico: number): Promise<void> {
  try {
    await query(
      `INSERT INTO prod.usuario_anio_academico (usuario_id, anio_academico, fecha_actualizacion)
       VALUES ($1, $2, NOW())
       ON CONFLICT (usuario_id) 
       DO UPDATE SET anio_academico = EXCLUDED.anio_academico, fecha_actualizacion = NOW()`,
      [usuarioId, anioAcademico]
    )
  } catch (error) {
    console.error('Error estableciendo año académico:', error)
    throw new Error('Error al establecer el año académico')
  }
}

// Verificar si el usuario tiene un año académico establecido
export async function usuarioTieneAnioAcademico(usuarioId: string): Promise<boolean> {
  try {
    const result = await query('SELECT 1 FROM prod.usuario_anio_academico WHERE usuario_id = $1', [usuarioId])

    return result.rows.length > 0
  } catch (error) {
    console.error('Error verificando año académico:', error)
    throw new Error('Error al verificar el año académico')
  }
}

// Obtener información completa del año académico
export async function obtenerInfoAnioAcademico(usuarioId: string): Promise<AnioAcademico | null> {
  try {
    const result = await query(
      'SELECT usuario_id, anio_academico, fecha_actualizacion FROM prod.usuario_anio_academico WHERE usuario_id = $1',
      [usuarioId]
    )

    if (result.rows.length === 0) {
      return null
    }

    const row = result.rows[0]
    return {
      usuarioId: row.usuario_id,
      anioAcademico: row.anio_academico,
      fechaActualizacion: row.fecha_actualizacion,
    }
  } catch (error) {
    console.error('Error obteniendo información del año académico:', error)
    throw new Error('Error al obtener la información del año académico')
  }
}
