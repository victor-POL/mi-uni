import { type NextRequest, NextResponse } from 'next/server'

import { query } from '@/connection'

import { obtenerEstadisticasHistorial, obtenerHistorialAcademico } from '@/lib/database/carreras.service'

/**
 * GET /api/user/carreras/materias?userId={id}&planEstudioId={id}
 * Obtiene el historial académico de un usuario para un plan de estudio específico.
 * @description Parámetros requeridos: "userId" para identificar al usuario y "planEstudioId" para el plan de estudio.
 */
export async function GET(request: NextRequest) {
  try {
    // Obtener parametros
    const { searchParams } = new URL(request.url)
    const userIdParam = searchParams.get('userId')
    const planEstudioIdParam = searchParams.get('planEstudioId')

    if (!userIdParam || !planEstudioIdParam) {
      return NextResponse.json(
        {
          success: false,
          error: 'Parametros "userId" y "planEstudioId" son requeridos',
        },
        { status: 400 }
      )
    }

    const userIdParsed = parseInt(userIdParam)
    const planEstudioIdParsed = parseInt(planEstudioIdParam)

    if (Number.isNaN(userIdParsed) || Number.isNaN(planEstudioIdParsed)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Parametros "userId" o "planEstudioId" inválidos',
        },
        { status: 400 }
      )
    }

    // Consultar informacion
    const [historialDB, estadisticasDB] = await Promise.all([
      obtenerHistorialAcademico(userIdParsed, planEstudioIdParsed),
      obtenerEstadisticasHistorial(userIdParsed, planEstudioIdParsed),
    ])

    // Retornar respuesta
    return NextResponse.json({
      success: true,
      data: {
        hhistorial: historialDB,
        estadisticas: estadisticasDB,
      },
    })
  } catch (error) {
    console.error('Error GET historial académico del usuario')

    if (error instanceof Error) {
      console.error('Error message:', error.message)
    }

    return NextResponse.json(
      {
        success: false,
        error: 'No se pudo obtener el historial académico del usuario',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/user/carreras/materias
 * Actualiza el estado de una materia en el historial académico del usuario.
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()

    const { userId, planEstudioId, materiaId, estado, nota, anioCursada, cuatrimestreCursada } = body

    // Validar campos requeridos
    if (!userId || !planEstudioId || !materiaId || !estado) {
      return NextResponse.json(
        {
          success: false,
          error: 'Parametros "userId", "planEstudioId", "materiaId" y "estado" son requeridos en body',
        },
        { status: 400 }
      )
    }

    // Verificar que el usuario existe
    const usuarioExiste = await query(`SELECT id FROM prod.usuario WHERE id = $1`, [userId])

    if (usuarioExiste.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Usuario no encontrado',
        },
        { status: 404 }
      )
    }

    // Verificar que la materia existe en el plan
    const materiaEnPlan = await query(
      `SELECT materia_id FROM prod.plan_materia WHERE plan_estudio_id = $1 AND materia_id = $2`,
      [planEstudioId, materiaId]
    )

    if (materiaEnPlan.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Materia no encontrada en el plan de estudio',
        },
        { status: 404 }
      )
    }

    // Verificar si ya existe un registro para esta materia
    const existeRegistro = await query(
      `SELECT usuario_id FROM prod.usuario_materia_estado 
       WHERE usuario_id = $1 AND plan_estudio_id = $2 AND materia_id = $3`,
      [userId, planEstudioId, materiaId]
    )

    if (existeRegistro.rows.length > 0) {
      // Actualizar registro existente
      await query(
        `UPDATE prod.usuario_materia_estado 
         SET estado = $1, nota = $2, anio_academico = $3, cuatrimestre = $4, fecha_actualizacion = NOW()
         WHERE usuario_id = $5 AND plan_estudio_id = $6 AND materia_id = $7`,
        [estado, nota, anioCursada, cuatrimestreCursada, userId, planEstudioId, materiaId]
      )
    } else {
      // Crear nuevo registro
      await query(
        `INSERT INTO prod.usuario_materia_estado 
         (usuario_id, plan_estudio_id, materia_id, estado, nota, anio_academico, cuatrimestre, fecha_actualizacion)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
        [userId, planEstudioId, materiaId, estado, nota, anioCursada, cuatrimestreCursada]
      )
    }

    return NextResponse.json({ success: true, message: 'Estado de materia actualizado exitosamente' })
  } catch (error) {
    console.error('Error PATCH actualizar estado de materia en el historial académico del usuario')

    if (error instanceof Error) {
      console.error('Error message:', error.message)
    }

    return NextResponse.json(
      {
        success: false,
        error: 'No se pudo actualizar el estado de la materia en el historial académico del usuario',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
