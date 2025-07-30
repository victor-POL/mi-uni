import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/connection'

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { usuarioId, planEstudioId, materiaId, estado, nota, anioCursada, cuatrimestreCursada } = body

    // Validar campos requeridos
    if (!usuarioId || !planEstudioId || !materiaId || !estado) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // Verificar que el usuario existe
    const usuarioExiste = await query(
      `SELECT id FROM prod.usuario WHERE id = $1`,
      [usuarioId]
    )
    
    if (usuarioExiste.rows.length === 0) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
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
        { error: 'Materia no encontrada en el plan de estudio' },
        { status: 404 }
      )
    }

    // Verificar si ya existe un registro para esta materia
    const existeRegistro = await query(
      `SELECT usuario_id FROM prod.usuario_materia_estado 
       WHERE usuario_id = $1 AND plan_estudio_id = $2 AND materia_id = $3`,
      [usuarioId, planEstudioId, materiaId]
    )

    if (existeRegistro.rows.length > 0) {
      // Actualizar registro existente
      const result = await query(
        `UPDATE prod.usuario_materia_estado 
         SET estado = $1, nota = $2, anio_cursada = $3, cuatrimestre = $4, fecha_actualizacion = NOW()
         WHERE usuario_id = $5 AND plan_estudio_id = $6 AND materia_id = $7`,
        [estado, nota, anioCursada, cuatrimestreCursada, usuarioId, planEstudioId, materiaId]
      )
    } else {
      // Crear nuevo registro
      const result = await query(
        `INSERT INTO prod.usuario_materia_estado 
         (usuario_id, plan_estudio_id, materia_id, estado, nota, anio_cursada, cuatrimestre, fecha_actualizacion)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
        [usuarioId, planEstudioId, materiaId, estado, nota, anioCursada, cuatrimestreCursada]
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error detallado actualizando estado de materia:', error)
    if (error instanceof Error) {
      console.error('Stack trace:', error.stack)
    }
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
