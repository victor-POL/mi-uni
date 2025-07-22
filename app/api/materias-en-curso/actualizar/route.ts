import { NextRequest, NextResponse } from 'next/server'
import { actualizarNotasMateriaEnCurso, eliminarMateriaEnCurso } from '@/lib/database/materias-cursada.service'

// PUT: Actualizar notas de una materia en curso
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      usuarioId, 
      planEstudioId, 
      materiaId, 
      anioCursada, 
      cuatrimestreCursada,
      notaPrimerParcial,
      notaSegundoParcial,
      notaRecuperatorioPrimerParcial,
      notaRecuperatorioSegundoParcial
    } = body

    if (!usuarioId || !planEstudioId || !materiaId || !anioCursada || !cuatrimestreCursada) {
      return NextResponse.json(
        { error: 'Campos básicos requeridos' },
        { status: 400 }
      )
    }

    await actualizarNotasMateriaEnCurso({
      usuarioId,
      planEstudioId,
      materiaId,
      anioCursada,
      cuatrimestreCursada,
      notaPrimerParcial: notaPrimerParcial ? parseInt(notaPrimerParcial) : undefined,
      notaSegundoParcial: notaSegundoParcial ? parseInt(notaSegundoParcial) : undefined,
      notaRecuperatorioPrimerParcial: notaRecuperatorioPrimerParcial ? parseInt(notaRecuperatorioPrimerParcial) : undefined,
      notaRecuperatorioSegundoParcial: notaRecuperatorioSegundoParcial ? parseInt(notaRecuperatorioSegundoParcial) : undefined
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error actualizando notas:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE: Eliminar materia en curso
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const usuarioId = searchParams.get('usuarioId')
    const planEstudioId = searchParams.get('planEstudioId')
    const materiaId = searchParams.get('materiaId')

    if (!usuarioId || !planEstudioId || !materiaId) {
      return NextResponse.json(
        { error: 'Todos los parámetros son requeridos' },
        { status: 400 }
      )
    }

    await eliminarMateriaEnCurso(
      parseInt(usuarioId),
      parseInt(planEstudioId),
      parseInt(materiaId)
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error eliminando materia en curso:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
