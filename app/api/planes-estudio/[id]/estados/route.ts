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

    // Obtener también las materias en curso
    const resultCursando = await query(`
      SELECT 
        umc.materia_id,
        m.codigo_materia,
        'En Curso' as estado
      FROM prod.usuario_materia_cursada umc
      JOIN prod.materia m ON umc.materia_id = m.id
      WHERE umc.usuario_id = $1 AND umc.plan_estudio_id = $2
    `, [parseInt(usuarioId), planEstudioId])

    // Combinar ambos resultados
    const estadosMap = new Map()
    
    // Agregar estados definitivos
    result.rows.forEach((row: any) => {
      estadosMap.set(row.codigo_materia, row.estado)
    })
    
    // Agregar materias en curso (priorizar sobre otros estados)
    resultCursando.rows.forEach((row: any) => {
      estadosMap.set(row.codigo_materia, row.estado)
    })

    // Convertir a objeto para respuesta
    const estadosObj: Record<string, string> = {}
    estadosMap.forEach((estado, codigoMateria) => {
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
