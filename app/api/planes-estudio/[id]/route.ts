import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { getDetallePlan } from '@/lib/database/planes-estudio.service'

import type { PlanEstudioDetalleDB } from '@/models/database/planes-estudio.model'

import type { PlanEstudioDetalleAPIResponse } from '@/models/api/planes-estudio.model'

import { adaptPlanEstudioDetalleDBToAPIResponse } from '@/adapters/planes-estudio.adapter'

/**
 * GET /api/planes-estudio/[id]
 * Obtiene el detalle completo de un plan de estudio específico
 * @param params.id - ID del plan de estudio para obtener su detalle
 * @description Parametro opcional: "userId" para obtener el estado de las materias del usuario
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

    let userIdParsed: number | undefined
    if (userIdParam) {
      userIdParsed = parseInt(userIdParam, 10)
      if (Number.isNaN(userIdParsed)) {
        return NextResponse.json(
          {
            success: false,
            error: 'Parametro "userId" inválido',
          },
          { status: 400 }
        )
      }
    }

    // Consultar informacion
    const planDetalleDB: PlanEstudioDetalleDB | null = await getDetallePlan(planIdParsed, userIdParsed)

    if (planDetalleDB === null) {
      return NextResponse.json(
        {
          success: false,
          error: 'Plan de estudio no encontrado',
        },
        { status: 404 }
      )
    }

    // Transformar consulta a formato API
    const planDetalleResponse: PlanEstudioDetalleAPIResponse = adaptPlanEstudioDetalleDBToAPIResponse(planDetalleDB)

    // Retornar respuesta
    return NextResponse.json({
      success: true,
      data: planDetalleResponse,
    })
  } catch (error) {
    console.error('Error GET detalle de plan de estudio')

    if (error instanceof Error) {
      console.error('Error message:', error.message)
    }

    return NextResponse.json(
      {
        success: false,
        error: 'No se pudo obtener el detalle del plan de estudio',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
