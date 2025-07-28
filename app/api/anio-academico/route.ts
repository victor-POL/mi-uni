import { type NextRequest, NextResponse } from 'next/server'
import { query } from '@/connection'
import { obtenerAnioAcademicoUsuario } from '@/lib/database/anio-academico.service'
import type { AnioAcademicoUsuarioAPIResponse } from '@/models/api/materias-cursada.model'
import { adaptAnioAcademicoUsuarioDBToAPIResponse } from '@/adapters/materias-cursada.model'

// GET: Obtener año académico actual del usuario
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userIdParam = searchParams.get('userId')

    if (!userIdParam) {
      return NextResponse.json({ error: 'ID de usuario requerido' }, { status: 400 })
    }

    const usedId = parseInt(userIdParam)

    if (Number.isNaN(usedId)) {
      return NextResponse.json({ error: 'ID de usuario inválido' }, { status: 400 })
    }

    const anioAcademicoUsuarioDB = await obtenerAnioAcademicoUsuario(usedId)

    const anioAcademicoResponse: AnioAcademicoUsuarioAPIResponse =
      adaptAnioAcademicoUsuarioDBToAPIResponse(anioAcademicoUsuarioDB)

    return NextResponse.json({
      success: true,
      data: anioAcademicoResponse,
    })
  } catch (error) {
    console.error('Error GET año academico del usuario')

    if (error instanceof Error) {
      console.error('Error message:', error.message)
    }

    return NextResponse.json(
      {
        success: false,
        error: 'No se pudo obtener el año académico del usuario',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// POST: Establecer año académico para el usuario
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, anioAcademico } = body

    if (!userId || !anioAcademico) {
      return NextResponse.json({ error: 'Usuario y año académico requeridos' }, { status: 400 })
    }

    // Validar año académico
    const anioActual = new Date().getFullYear()
    if (anioAcademico < anioActual - 1 || anioAcademico > anioActual) {
      return NextResponse.json({ error: 'Año académico inválido' }, { status: 400 })
    }

    await query(
      `INSERT INTO prod.usuario_anio_academico (usuario_id, anio_academico, fecha_actualizacion)
       VALUES ($1, $2, NOW())
       ON CONFLICT (usuario_id) 
       DO UPDATE SET anio_academico = EXCLUDED.anio_academico, fecha_actualizacion = NOW()`,
      [parseInt(userId), parseInt(anioAcademico)]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error estableciendo año académico:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// PUT: Cambiar año académico (afecta todas las materias en curso)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, nuevoAnioAcademico } = body

    if (!userId || !nuevoAnioAcademico) {
      return NextResponse.json({ error: 'Usuario y nuevo año académico requeridos' }, { status: 400 })
    }

    // Validar año académico
    const anioActual = new Date().getFullYear()
    if (nuevoAnioAcademico < anioActual - 1 || nuevoAnioAcademico > anioActual) {
      return NextResponse.json({ error: 'Año académico inválido' }, { status: 400 })
    }

    // Crear/actualizar registro de año académico
    await query(
      `INSERT INTO prod.usuario_anio_academico (usuario_id, anio_academico, fecha_actualizacion)
       VALUES ($1, $2, NOW())
       ON CONFLICT (usuario_id) 
       DO UPDATE SET anio_academico = EXCLUDED.anio_academico, fecha_actualizacion = NOW()`,
      [parseInt(userId), parseInt(nuevoAnioAcademico)]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error cambiando año académico:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
