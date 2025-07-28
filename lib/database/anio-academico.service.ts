import type { AnioAcademicoUsuarioDB, AnioAcademicoVigenteDB } from '@/models/database/materias-cursada.model'
import { query } from './connection'

/**
 * Obtiene el año académico vigente desde la base de datos.
 * @returns Promise<AnioAcademicoVigenteDB | null> - El año académico vigente o null si no se encuentra.
 */
export async function obtenerAnioAcademicoVigente(): Promise<AnioAcademicoVigenteDB | null> {
  try {
    const result = await query(
      `SELECT
          anio as anio_academico,
          fecha_inicio,
          fecha_fin
      FROM prod.anio_academico
      WHERE fecha_inicio <= NOW() AND fecha_fin >= NOW()
      ORDER BY fecha_inicio DESC
      LIMIT 1`
    )

    const anioAcademicoVigente: AnioAcademicoVigenteDB | null = result.rows.length > 0 ? result.rows[0] : null

    return anioAcademicoVigente
  } catch (error) {
    console.error('Error obteniendo año académico vigente:', error)
    throw new Error('Error al obtener el año académico vigente')
  }
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

export async function establecerAnioAcademicoUsuario(usuarioID: number) {
  try {
    const anioAcademicoVigente = await obtenerAnioAcademicoVigente()

    if (!anioAcademicoVigente) {
      throw new Error('No se encontró un año académico vigente')
    }

    await query(
      `INSERT INTO prod.usuario_anio_academico (usuario_id, anio_academico, fecha_actualizacion)
       VALUES ($1, $2, NOW())
       `,
      [usuarioID, anioAcademicoVigente.anio_academico]
    )

    return true
  } catch (error) {
    console.error('Error estableciendo año académico del usuario:', error)
    throw new Error('Error al establecer el año académico del usuario')
  }
}
