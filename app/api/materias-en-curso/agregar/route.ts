import { NextRequest, NextResponse } from 'next/server'
import { agregarMateriaEnCurso, obtenerMateriasDisponiblesParaCurso } from '@/lib/database/materias-cursada.service'

// GET: Obtener materias disponibles para agregar a curso
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const usuarioId = searchParams.get('usuarioId')
    const planEstudioId = searchParams.get('planEstudioId')

    if (!usuarioId || !planEstudioId) {
      return NextResponse.json(
        { error: 'ID de usuario y plan de estudio requeridos' },
        { status: 400 }
      )
    }

    const materiasDisponibles = await obtenerMateriasDisponiblesParaCurso(
      parseInt(usuarioId),
      parseInt(planEstudioId)
    )

    return NextResponse.json({ materiasDisponibles })
  } catch (error) {
    console.error('Error obteniendo materias disponibles:', error)
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
