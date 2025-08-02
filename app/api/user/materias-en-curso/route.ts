import { type NextRequest, NextResponse } from 'next/server'

import {
  getMateriasEnCurso,
  getEstadisticasMateriasEnCurso,
  insertMateriaEnCurso,
  deleteMateriaEnCurso,
  updateNotasMateriaEnCurso,
} from '@/lib/database/materias-cursada.service'

import type { EstadisticasMateriasEnCursoDB, MateriaEnCursoUsuarioDB } from '@/models/database/materias-cursada.model'

import type {
  EstadisticasCursadaAPIResponse,
  MateriasEnCursoAPIResponse,
  MateriasPorCarreraCursadaAPIResponse,
} from '@/models/api/materias-cursada.model'

import {
  adaptEstadisticasMateriasEnCursoDBToLocal,
  agruparMateriasEnCursoPorCarrera,
} from '@/adapters/materias-cursada.model'

/**
 * GET /api/user/materias-en-curso?userId={id}
 * Obtiene las materias en curso del usuario, agrupadas por carrera, junto con estadísticas de las materias en curso
 * @descripcion Parametro requerido: "userId" para identificar al usuario
 * @description Parametro opcional: "planEstudioId" para filtrar por un plan de estudio específico
 */
export async function GET(request: NextRequest) {
  try {
    let getMaterias: () => Promise<MateriaEnCursoUsuarioDB[]>
    let getEstadisticas: () => Promise<EstadisticasMateriasEnCursoDB>
    // Obtener parametros
    const { searchParams } = new URL(request.url)
    const userIdParam = searchParams.get('userId')
    const planIdParam = searchParams.get('planEstudioId')

    // UserId (requerido)
    if (!userIdParam) {
      return NextResponse.json(
        {
          success: false,
          error: 'Parametro "userId" es requerido',
        },
        { status: 400 }
      )
    }

    const userIdParsed = parseInt(userIdParam)

    if (Number.isNaN(userIdParsed)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Parametro "userId" inválido',
        },
        { status: 400 }
      )
    }

    // PlanId (opcional)
    let planIdParsed: number | undefined

    if (planIdParam) {
      planIdParsed = parseInt(planIdParam)

      if (Number.isNaN(planIdParsed)) {
        return NextResponse.json(
          {
            success: false,
            error: 'Parametro "planEstudioId" inválido',
          },
          { status: 400 }
        )
      }

      getMaterias = () => getMateriasEnCurso(userIdParsed, planIdParsed)
      getEstadisticas = () => getEstadisticasMateriasEnCurso(userIdParsed, planIdParsed)
    } else {
      getMaterias = () => getMateriasEnCurso(userIdParsed)
      getEstadisticas = () => getEstadisticasMateriasEnCurso(userIdParsed)
    }

    // Consultar informacion
    const [materiasPorCarreraDB, estadisticasDB]: [MateriaEnCursoUsuarioDB[], EstadisticasMateriasEnCursoDB] =
      await Promise.all([getMaterias(), getEstadisticas()])

    // Transformar consulta a formato API
    const materiasCursadaPorCarreraResponse: MateriasPorCarreraCursadaAPIResponse[] =
      agruparMateriasEnCursoPorCarrera(materiasPorCarreraDB)

    const estadisticasResponse: EstadisticasCursadaAPIResponse =
      adaptEstadisticasMateriasEnCursoDBToLocal(estadisticasDB)

    const materiasEnCursoResponse: MateriasEnCursoAPIResponse = {
      materias_por_carrera: materiasCursadaPorCarreraResponse,
      estadisticas_cursada: estadisticasResponse,
    }

    // Retornar respuesta
    return NextResponse.json({
      success: true,
      data: materiasEnCursoResponse,
    })
  } catch (error) {
    console.error('Error GET materias en curso del usuario')

    if (error instanceof Error) {
      console.error('Error message:', error.message)
    }

    return NextResponse.json(
      {
        success: false,
        error: 'No se pudo obtener las materias en curso del usuario',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/user/materias-en-curso
 * Agrega una materia en curso al usuario
 * @description Body requerido: { usuario_id: number, plan_estudio_id: number, materia_id: number }
 */
export async function POST(request: NextRequest) {
  try {
    // Obtener parametros
    const body = await request.json()
    const { usuario_id, plan_estudio_id, materia_id } = body

    if (!usuario_id || !plan_estudio_id || !materia_id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Parametros "usuario_id", "plan_estudio_id" y "materia_id" son requeridos en body',
        },
        { status: 400 }
      )
    }

    // Operaciones
    await insertMateriaEnCurso(usuario_id, plan_estudio_id, materia_id)

    // Retornar respuesta
    return NextResponse.json({ success: true, message: 'Materia en curso agregada exitosamente' })
  } catch (error) {
    console.error('Error POST agregar materia en curso al usuario')

    if (error instanceof Error) {
      console.error('Error message:', error.message)
    }

    return NextResponse.json(
      {
        success: false,
        error: 'No se pudo agregar la materia en curso al usuario',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/user/materias-en-curso?userId={id}&planEstudioId={planId}&materiaId={materiaId}
 * Elimina una materia en curso del usuario
 * @description Parametros requeridos: "userId", "planEstudioId" y "materiaId" para identificar la materia a eliminar
 */
export async function DELETE(request: NextRequest) {
  try {
    // Obtener parametros
    const { searchParams } = new URL(request.url)
    const userIdParam = searchParams.get('userId')
    const planEstudioIdParam = searchParams.get('planEstudioId')
    const materiaIdParam = searchParams.get('materiaId')

    if (!userIdParam || !planEstudioIdParam || !materiaIdParam) {
      return NextResponse.json(
        {
          success: false,
          error: 'Parametros "userId", "planEstudioId" y "materiaId" son requeridos',
        },
        { status: 400 }
      )
    }

    const userIdParsed = parseInt(userIdParam)
    const planEstudioIdParsed = parseInt(planEstudioIdParam)
    const materiaIdParsed = parseInt(materiaIdParam)

    if (Number.isNaN(userIdParsed) || Number.isNaN(planEstudioIdParsed) || Number.isNaN(materiaIdParsed)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Parametros "userId", "planEstudioId" o "materiaId" inválidos',
        },
        { status: 400 }
      )
    }

    // Operaciones
    await deleteMateriaEnCurso(userIdParsed, planEstudioIdParsed, materiaIdParsed)

    // Retornar respuesta
    return NextResponse.json({ success: true, message: 'Materia en curso eliminada exitosamente' })
  } catch (error) {
    console.error('Error DELETE eliminar materia en curso del usuario')

    if (error instanceof Error) {
      console.error('Error message:', error.message)
    }

    return NextResponse.json(
      {
        success: false,
        error: 'No se pudo eliminar la materia en curso del usuario',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/user/materias-en-curso
 * Actualiza las notas de una materia en curso del usuario
 */
export async function PATCH(request: NextRequest) {
  try {
    // Obtener parametros
    const body = await request.json()
    const {
      userId,
      planEstudioId,
      materiaId,
      notaPrimerParcial,
      notaSegundoParcial,
      notaRecuperatorioPrimerParcial,
      notaRecuperatorioSegundoParcial,
    } = body

    if (!userId || !planEstudioId || !materiaId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Parametros "userId", "planEstudioId" y "materiaId" son requeridos en body',
        },
        { status: 400 }
      )
    }

    // Operaciones
    await updateNotasMateriaEnCurso({
      usuarioId: userId,
      planEstudioId,
      materiaId,
      notaPrimerParcial: notaPrimerParcial ? parseInt(notaPrimerParcial) : undefined,
      notaSegundoParcial: notaSegundoParcial ? parseInt(notaSegundoParcial) : undefined,
      notaRecuperatorioPrimerParcial: notaRecuperatorioPrimerParcial
        ? parseInt(notaRecuperatorioPrimerParcial)
        : undefined,
      notaRecuperatorioSegundoParcial: notaRecuperatorioSegundoParcial
        ? parseInt(notaRecuperatorioSegundoParcial)
        : undefined,
    })

    // Retornar respuesta
    return NextResponse.json({ success: true, message: 'Notas de materia en curso actualizadas exitosamente' })
  } catch (error) {
    console.error('Error PATCH actualizar notas de materia en curso del usuario')

    if (error instanceof Error) {
      console.error('Error message:', error.message)
    }

    return NextResponse.json(
      {
        success: false,
        error: 'No se pudo actualizar las notas de la materia en curso del usuario',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
