import { type NextRequest, NextResponse } from 'next/server'
import { obtenerMateriasDisponiblesParaCurso } from '@/lib/database/materias-cursada.service'

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

