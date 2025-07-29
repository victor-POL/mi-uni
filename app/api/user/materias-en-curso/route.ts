import { type NextRequest, NextResponse } from 'next/server'
import { obtenerMateriasEnCursoPorCarrera, obtenerEstadisticasMateriasEnCurso, agregarMateriaEnCurso } from '@/lib/database/materias-cursada.service'

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

    try {
      const [materiasPorCarrera, estadisticas] = await Promise.all([
        obtenerMateriasEnCursoPorCarrera(parseInt(usuarioId)),
        obtenerEstadisticasMateriasEnCurso(parseInt(usuarioId))
      ])

      return NextResponse.json({
        materiasPorCarrera: materiasPorCarrera || [],
        estadisticas: estadisticas || null
      })
    } catch (serviceError) {
      console.error('Error en servicios de materias en curso:', serviceError)
      // Si hay error en los servicios, devolver datos vacíos en lugar de fallar
      return NextResponse.json({
        materiasPorCarrera: [],
        estadisticas: null
      })
    }
  } catch (error) {
    console.error('Error en API de materias en curso:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST: Agregar nueva materia en curso
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { usuarioId, planEstudioId, materiaId } = body

    if (!usuarioId || !planEstudioId || !materiaId) {
      return NextResponse.json(
        { error: 'Usuario, plan de estudio y materia son requeridos' },
        { status: 400 }
      )
    }

    await agregarMateriaEnCurso(usuarioId, {
      planEstudioId,
      materiaId
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error agregando materia en curso:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error interno del servidor' },
      { status: 500 }
    )
  }
}