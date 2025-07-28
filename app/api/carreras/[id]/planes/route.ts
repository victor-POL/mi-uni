import { NextResponse } from 'next/server'
import { getListadoPlanes } from '@/lib/database/planes-estudio.service'
import type { PlanEstudioDB } from '@/models/database/planes-estudio.model'
import type { PlanEstudioAPIResponse } from '@/models/api/planes-estudio.model'

/**
 * GET /api/carreras/[id]/planes
 * Obtiene un listado básico de todos los planes de estudio de una carrera específica
 * @param params.id - ID de la carrera para obtener sus planes de estudio
 */
export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    // Obtener parametros
    const carreraId = parseInt(params.id)

    if (Number.isNaN(carreraId)) {
      return NextResponse.json({ error: 'ID de carrera inválido' }, { status: 400 })
    }

    // Consultar informacion
    const planesDB: PlanEstudioDB[] = await getListadoPlanes(carreraId)

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
    console.error('Error GET planes de estudio de la carrera')

    if (error instanceof Error) {
      console.error('Error message:', error.message)
    }

    return NextResponse.json(
      {
        success: false,
        error: 'No se pudo obtener el listado de planes de estudio de la carrera',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
