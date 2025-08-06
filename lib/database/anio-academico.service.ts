import { query } from '@/lib/database/connection'

import type { AnioAcademicoUsuarioDB, AnioAcademicoVigenteDB } from '@/models/database/materias-cursada.model'

/**
 * Obtiene el año académico vigente desde la base de datos
 * @returns Promise<AnioAcademicoVigenteDB | null> - El año académico vigente o null si no se encuentra.
 */
export async function getAnioAcademicoVigente(): Promise<AnioAcademicoVigenteDB | null> {
  try {
    const resQuery = await query(
      `SELECT
          anio as anio_academico,
          fecha_inicio,
          fecha_fin
      FROM prod.anio_academico
      WHERE fecha_inicio <= NOW() AND fecha_fin >= NOW()
      ORDER BY fecha_inicio DESC
      LIMIT 1`
    )

    const anioAcademicoVigente: AnioAcademicoVigenteDB | null = resQuery.rows.length > 0 ? resQuery.rows[0] : null

    return anioAcademicoVigente
  } catch (error) {
    console.error('Error obteniendo año académico vigente:', error)
    throw new Error('Error al obtener el año académico vigente')
  }
}

/**
 * Obtiene el año académico del usuario desde la base de datos
 * @param usuarioId - ID del usuario para obtener su año académico
 * @returns Promise con el año académico del usuario o null si no se encuentra
 */
export async function getAnioAcademico(usuarioId: number): Promise<AnioAcademicoUsuarioDB | null> {
  try {
    const resQuery = await query(
      `SELECT 
          anio_academico, 
          fecha_actualizacion
       FROM prod.usuario_anio_academico 
       WHERE usuario_id = $1
       LIMIT 1
       `,
      [usuarioId]
    )

    return resQuery.rows.length > 0 ? (resQuery.rows[0] as unknown as AnioAcademicoUsuarioDB) : null
  } catch (error) {
    console.error('Error obteniendo año académico:', error)
    throw new Error('Error al obtener el año académico')
  }
}

/**
 * Inserta un nuevo año académico para el usuario
 * @param usuarioId - ID del usuario
 */
export async function insertAnioAcademico(usuarioId: number): Promise<void> {
  try {
    const anioAcademicoVigenteDB: AnioAcademicoVigenteDB | null = await getAnioAcademicoVigente()

    if (!anioAcademicoVigenteDB) {
      throw new Error('No se encontró un año académico vigente')
    }

    await query(
      `INSERT INTO prod.usuario_anio_academico (usuario_id, anio_academico, fecha_actualizacion)
       VALUES ($1, $2, NOW())
       `,
      [usuarioId, anioAcademicoVigenteDB.anio_academico]
    )
  } catch (error) {
    console.error('Error estableciendo año académico del usuario:', error)
    throw new Error('Error al establecer el año académico del usuario')
  }
}

/**
 * Elimina el año académico del usuario
 * @param usuarioId - ID del usuario
 */
export async function deleteAnioAcademico(usuarioId: number): Promise<void> {
  try {
    await query(`DELETE FROM prod.usuario_anio_academico WHERE usuario_id = $1`, [usuarioId])
  } catch (error) {
    console.error('Error desestableciendo año académico del usuario:', error)
    throw new Error('Error al desestablecer el año académico del usuario')
  }
}
