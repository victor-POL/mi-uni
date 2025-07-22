import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { query } from '@/lib/database/connection'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const usuarioId = searchParams.get('usuarioId')
    
    if (!usuarioId) {
      return NextResponse.json(
        { error: 'Usuario ID es requerido' },
        { status: 400 }
      )
    }

    const planEstudioId = parseInt((await params).id)
    if (Number.isNaN(planEstudioId)) {
      return NextResponse.json(
        { error: 'Plan de estudio ID inválido' },
        { status: 400 }
      )
    }

    // Obtener los estados de las materias del usuario para este plan
    const result = await query(`
      SELECT 
        ume.materia_id,
        m.codigo_materia,
        ume.estado
      FROM prod.usuario_materia_estado ume
      JOIN prod.materia m ON ume.materia_id = m.id
      WHERE ume.usuario_id = $1 AND ume.plan_estudio_id = $2
    `, [parseInt(usuarioId), planEstudioId])

    // Crear mapa de estados por código de materia
    // Crear mapa de estados por código de materia
    const estadosPorMateria = new Map()
    result.rows.forEach((row: any) => {
      estadosPorMateria.set(row.codigo_materia, row.estado)
    })

    // Convertir a objeto para respuesta
    const estadosObj: Record<string, string> = {}
    estadosPorMateria.forEach((estado, codigoMateria) => {
      estadosObj[codigoMateria] = estado
    })

    return NextResponse.json({
      success: true,
      data: estadosObj
    })

  } catch (error) {
    console.error('Error obteniendo estados de materias:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
