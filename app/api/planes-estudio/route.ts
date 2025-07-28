import { NextResponse } from 'next/server'
import { getListadoPlanes } from '@/lib/database/planes-estudio.service'
import type { PlanEstudioDB } from '@/models/database/planes-estudio.model'
import type { PlanEstudioAPIResponse } from '@/models/api/planes-estudio.model'

/**
 * GET /api/planes-estudio
 * Obtiene un listado básico de todos los planes de estudio
 */
export async function GET() {
  try {
    // Obtener parametros

    // Consultar informacion
    const planesDB: PlanEstudioDB[] = await getListadoPlanes()

    // Transformar consulta a formato API
    const planesFormatted: PlanEstudioAPIResponse[] = planesDB.map((plan) => ({
      plan_id: plan.plan_id,
      nombre_carrera: plan.nombre_carrera,
      anio: plan.anio,
    }))

    // Retornar respuesta
    return NextResponse.json({
      success: true,
      data: planesFormatted,
      count: planesFormatted.length,
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
