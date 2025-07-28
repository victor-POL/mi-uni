import type { AnioAcademicoUsuarioDB } from '@/models/database/materias-cursada.model'
import { query } from './connection'

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