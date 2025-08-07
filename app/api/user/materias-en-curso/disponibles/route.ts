import { type NextRequest, NextResponse } from 'next/server'

import { getMateriasEnCursoDisponibles } from '@/lib/database/materias-cursada.service'

import type { MateriaCursadaDisponibleDB } from '@/models/database/materias-en-curso.model'

import type { MateriaCursadaDisponibleAPIResponse } from '@/models/api/materias-en-curso.model'

import { adaptMateriaCursadaDisponibleDBToAPIResponse } from '@/adapters/materias-en-curso.adapter'

/**
 * GET /api/user/materias-en-curso/disponibles?userId={id}&planEstudioId={planId}
 * Obtiene las materias de un usuario que están disponibles para ser cursadas en un plan de estudio específico que no están en curso actualmente.
 */
export async function GET(request: NextRequest) {
  try {
    // Obtener parametros
    const { searchParams } = new URL(request.url)
    const userIdParam = searchParams.get('userId')
    const planEstudioIdParam = searchParams.get('planEstudioId')

    if (!userIdParam || !planEstudioIdParam) {
      return NextResponse.json(
        {
          success: false,
          error: 'Parametros "userId" y "planEstudioId" son requeridos',
        },
        { status: 400 }
      )
    }

    const userIdParsed = parseInt(userIdParam)
    const planEstudioIdParsed = parseInt(planEstudioIdParam)

    if (Number.isNaN(userIdParsed) || Number.isNaN(planEstudioIdParsed)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Parametros "userId" y "planEstudioId" inválidos',
        },
        { status: 400 }
      )
    }

    // Consultar informacion
    const materiasDB: MateriaCursadaDisponibleDB[] = await getMateriasEnCursoDisponibles(
      userIdParsed,
      planEstudioIdParsed
    )

    // Transformar consulta a formato API
    const materiasDisponibles: MateriaCursadaDisponibleAPIResponse[] =
      adaptMateriaCursadaDisponibleDBToAPIResponse(materiasDB)

    // Retornar respuesta
    return NextResponse.json({
      success: true,
      data: materiasDisponibles,
      count: materiasDisponibles.length,
    })
  } catch (error) {
    console.error('Error GET materias disponibles para cursar del usuario')

    if (error instanceof Error) {
      console.error('Error message:', error.message)
    }

    return NextResponse.json(
      {
        success: false,
        error: 'No se pudo obtener las materias disponibles para cursar del usuario',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
