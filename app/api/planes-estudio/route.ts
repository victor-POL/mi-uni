import { NextResponse } from 'next/server'

import { getListadoPlanes } from '@/lib/database/planes-estudio.service'

import type { PlanEstudioDB } from '@/models/database/planes-estudio.model'

import type { PlanEstudioAPIResponse } from '@/models/api/planes-estudio.model'

import { adaptPlanEstudioDBToAPIResponse } from '@/adapters/planes-estudio.adapter'

/**
 * GET /api/planes-estudio?carreraId={id}
 * Obtiene un listado básico de todos los planes de estudio
 * @description Parametro opcional: "carreraId" para filtrar por carrera
 */
export async function GET(request: Request) {
  try {
    // Obtener parametros
    const { searchParams } = new URL(request.url)
    const carreraIdParam = searchParams.get('carreraId')

    let planesDB: PlanEstudioDB[] = []

    // Consultar informacion
    if (!carreraIdParam) {
      planesDB = await getListadoPlanes()
    } else {
      const carreraIdParsed = parseInt(carreraIdParam)
      if (Number.isNaN(carreraIdParsed)) {
        return NextResponse.json(
          {
            success: false,
            error: 'Parametro "carreraId" inválido',
          },
          { status: 400 }
        )
      }
      planesDB = await getListadoPlanes(carreraIdParsed)
    }

    // Transformar consulta a formato API
    const planesResponse: PlanEstudioAPIResponse[] = adaptPlanEstudioDBToAPIResponse(planesDB)

    // Retornar respuesta
    return NextResponse.json({
      success: true,
      data: planesResponse,
      count: planesResponse.length,
    })
  } catch (error) {
    console.error('Error GET planes de estudio')

    if (error instanceof Error) {
      console.error('Error message:', error.message)
    }

    return NextResponse.json(
      {
        success: false,
        error: 'No se pudo obtener el listado de planes de estudio',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
