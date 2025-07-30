import { NextRequest, NextResponse } from 'next/server'
import { obtenerHistorialAcademico, obtenerEstadisticasHistorial } from '@/lib/database/carreras.service'

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

    const [historial, estadisticas] = await Promise.all([
      obtenerHistorialAcademico(parseInt(usuarioId), planEstudioId),
      obtenerEstadisticasHistorial(parseInt(usuarioId), planEstudioId)
    ])

    return NextResponse.json({
      historial,
      estadisticas
    })
  } catch (error) {
    console.error('Error obteniendo historial académico:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
