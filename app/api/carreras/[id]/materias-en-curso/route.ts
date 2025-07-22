import { NextRequest, NextResponse } from 'next/server'
import { obtenerMateriasEnCurso, obtenerEstadisticasMateriasEnCurso } from '@/lib/database/carreras.service'

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

    const planEstudioId = parseInt(params.id)
    if (Number.isNaN(planEstudioId)) {
      return NextResponse.json(
        { error: 'Plan de estudio ID inválido' },
        { status: 400 }
      )
    }

    const [materias, estadisticas] = await Promise.all([
      obtenerMateriasEnCurso(parseInt(usuarioId), planEstudioId),
      obtenerEstadisticasMateriasEnCurso(parseInt(usuarioId), planEstudioId)
    ])

    return NextResponse.json({
      materias,
      estadisticas
    })
  } catch (error) {
    console.error('Error obteniendo materias en curso:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
