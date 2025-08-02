import { type NextRequest, NextResponse } from 'next/server'

import { getMateriasEnCurso, getEstadisticasMateriasEnCurso } from '@/lib/database/carreras.service'

/**
 * GET /api/user/carreras/[planEstudioId]/materias-en-curso?userId={id}
 * Obtiene las materias en curso de un plan de estudio específico para un usuario
 * @param params.planEstudioId - ID del plan de estudio para obtener las materias en
 * @description Parametro requerido: "userId" para identificar al usuario
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Obtener parametros
    // PlanId
    const planIdParam = params.id

    if (Number.isNaN(planIdParam)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Parametro "planId" inválido',
        },
        { status: 400 }
      )
    }

    const planIdParsed = parseInt(planIdParam)

    if (Number.isNaN(planIdParsed)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Parametro "planId" inválido',
        },
        { status: 400 }
      )
    }

    // userId (opcional)
    const { searchParams } = new URL(request.url)
    const userIdParam = searchParams.get('userId')

    if (!userIdParam) {
      return NextResponse.json(
        {
          success: false,
          error: 'Parametro "userId" es requerido',
        },
        { status: 400 }
      )
    }

    const userIdParsed = parseInt(userIdParam, 10)

    if (Number.isNaN(userIdParsed)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Parametro "userId" inválido',
        },
        { status: 400 }
      )
    }

    // Consultar informacion
    const [materiasDB, estadisticasDB] = await Promise.all([
      getMateriasEnCurso(userIdParsed, planIdParsed),
      getEstadisticasMateriasEnCurso(userIdParsed, planIdParsed),
    ])

    return NextResponse.json({
      success: true,
      data: {
        materias: materiasDB,
        estadisticas: estadisticasDB,
      },
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
