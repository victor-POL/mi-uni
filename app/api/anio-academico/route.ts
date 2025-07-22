import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/connection'

// GET: Obtener año académico actual del usuario
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

    const result = await query(
      `SELECT anio_academico, fecha_actualizacion 
       FROM prod.usuario_anio_academico 
       WHERE usuario_id = $1 
       ORDER BY fecha_actualizacion DESC 
       LIMIT 1`,
      [parseInt(usuarioId)]
    )

    if (result.rows.length === 0) {
      // Si no hay año académico establecido, devolver null
      return NextResponse.json({ 
        anioAcademico: null,
        esNuevo: true 
      })
    }

    const row = result.rows[0] as any
    return NextResponse.json({
      anioAcademico: row.anio_academico,
      fechaActualizacion: row.fecha_actualizacion,
      esNuevo: false
    })
  } catch (error) {
    console.error('Error obteniendo año académico:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST: Establecer año académico para el usuario
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { usuarioId, anioAcademico } = body

    if (!usuarioId || !anioAcademico) {
      return NextResponse.json(
        { error: 'Usuario y año académico requeridos' },
        { status: 400 }
      )
    }

    // Validar año académico
    const anioActual = new Date().getFullYear()
    if (anioAcademico < anioActual - 1 || anioAcademico > anioActual) {
      return NextResponse.json(
        { error: 'Año académico inválido' },
        { status: 400 }
      )
    }

    await query(
      `INSERT INTO prod.usuario_anio_academico (usuario_id, anio_academico, fecha_actualizacion)
       VALUES ($1, $2, NOW())
       ON CONFLICT (usuario_id, anio_academico) 
       DO UPDATE SET fecha_actualizacion = NOW()`,
      [parseInt(usuarioId), parseInt(anioAcademico)]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error estableciendo año académico:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT: Cambiar año académico (afecta todas las materias en curso)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { usuarioId, nuevoAnioAcademico } = body

    if (!usuarioId || !nuevoAnioAcademico) {
      return NextResponse.json(
        { error: 'Usuario y nuevo año académico requeridos' },
        { status: 400 }
      )
    }

    // Validar año académico
    const anioActual = new Date().getFullYear()
    if (nuevoAnioAcademico < anioActual - 1 || nuevoAnioAcademico > anioActual) {
      return NextResponse.json(
        { error: 'Año académico inválido' },
        { status: 400 }
      )
    }

    // Actualizar todas las materias en curso al nuevo año
    await query(
      `UPDATE prod.usuario_materia_cursada 
       SET anio_academico = $2, fecha_actualizacion = NOW()
       WHERE usuario_id = $1`,
      [parseInt(usuarioId), parseInt(nuevoAnioAcademico)]
    )

    // Crear/actualizar registro de año académico
    await query(
      `INSERT INTO prod.usuario_anio_academico (usuario_id, anio_academico, fecha_actualizacion)
       VALUES ($1, $2, NOW())
       ON CONFLICT (usuario_id, anio_academico) 
       DO UPDATE SET fecha_actualizacion = NOW()`,
      [parseInt(usuarioId), parseInt(nuevoAnioAcademico)]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error cambiando año académico:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
