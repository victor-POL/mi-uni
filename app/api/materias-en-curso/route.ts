import { NextRequest, NextResponse } from 'next/server'
import { obtenerMateriasEnCursoPorCarrera, obtenerEstadisticasMateriasEnCurso } from '@/lib/database/materias-cursada.service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const usuarioId = searchParams.get('usuarioId')

    if (!usuarioId) {
      return NextResponse.json(
        { error: 'ID de usuario requerido' },
        { status: 400 }
      )
    }

    const [materiasPorCarrera, estadisticas] = await Promise.all([
      obtenerMateriasEnCursoPorCarrera(parseInt(usuarioId)),
      obtenerEstadisticasMateriasEnCurso(parseInt(usuarioId))
    ])

    return NextResponse.json({
      materiasPorCarrera,
      estadisticas
    })
  } catch (error) {
    console.error('Error en API de materias en curso:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
