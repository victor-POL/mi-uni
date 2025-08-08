/* ------------------------------ LIB DATABASE ------------------------------ */
import { query } from '@/lib/database/connection'
import { existeUsuario } from '@/lib/database/usuarios.service'

/* --------------------------------- MODELS --------------------------------- */
import type { AnioAcademicoUsuarioDB, AnioAcademicoVigenteDB } from '@/models/database/materias-en-curso.model'

/* ---------------------------------- UTILS --------------------------------- */
import { esParametroValido, getErrorMessageNoExisteUsuario } from '@/utils/error.util'

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
    /* ------------------------------ validaciones ------------------------------ */
    if (esParametroValido(usuarioId, 'number') === false) throw new Error(getErrorMessageNoExisteUsuario())
    if (!(await existeUsuario(usuarioId))) throw new Error(getErrorMessageNoExisteUsuario())

    /* -------------------------------- query DB -------------------------------- */
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

    const anioAcademicoUsuario: AnioAcademicoUsuarioDB | null =
      resQuery.rows.length > 0 ? (resQuery.rows[0] as unknown as AnioAcademicoUsuarioDB) : null

    return anioAcademicoUsuario
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
    /* ------------------------------ validaciones ------------------------------ */
    if (esParametroValido(usuarioId, 'number') === false) throw new Error(getErrorMessageNoExisteUsuario())
    if (!(await existeUsuario(usuarioId))) throw new Error(getErrorMessageNoExisteUsuario())

    /* -------------------------------- query DB -------------------------------- */
    // Validar si el usuario ya tiene un año académico
    const usuarioTieneAnioEstablecido = await getAnioAcademico(usuarioId)

    if (usuarioTieneAnioEstablecido) {
      throw new Error('El usuario ya tiene un año académico establecido')
    }

    // Obtener el año académico vigente
    const anioAcademicoVigenteDB: AnioAcademicoVigenteDB | null = await getAnioAcademicoVigente()

    if (!anioAcademicoVigenteDB) {
      throw new Error('No se encontró un año académico vigente para establecer')
    }

    // Insertar el año académico del usuario
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
    /* ------------------------------ validaciones ------------------------------ */
    if (esParametroValido(usuarioId, 'number') === false) throw new Error(getErrorMessageNoExisteUsuario())
    if (!(await existeUsuario(usuarioId))) throw new Error(getErrorMessageNoExisteUsuario())

    /* -------------------------------- query DB -------------------------------- */
    // Verificar si el usuario tiene un año académico establecido
    const usuarioTieneAnioEstablecido = await getAnioAcademico(usuarioId)

    if (!usuarioTieneAnioEstablecido) {
      throw new Error('El usuario no tiene un año académico establecido para eliminar')
    }

    // Eliminar el año académico del usuario
    await query(`DELETE FROM prod.usuario_anio_academico WHERE usuario_id = $1`, [usuarioId])
  } catch (error) {
    console.error('Error desestableciendo año académico del usuario:', error)
    throw new Error('Error al desestablecer el año académico del usuario')
  }
}
