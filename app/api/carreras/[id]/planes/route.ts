import { NextResponse } from 'next/server'
import { getListadoPlanes } from '@/lib/database/planes-estudio.service'
import type { PlanEstudioDB } from '@/models/database/planes-estudio.model'
import type { PlanEstudioAPIResponse } from '@/models/api/planes-estudio.model'

/**
 * GET /api/carreras/[id]/planes
 * Obtiene los planes de estudio de una carrera específica
 */
export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const carreraId = parseInt(params.id)

    if (Number.isNaN(carreraId)) {
      return NextResponse.json({ error: 'ID de carrera inválido' }, { status: 400 })
    }

    const planes: PlanEstudioDB[] = await getListadoPlanes(carreraId)

    const planesFormatted: PlanEstudioAPIResponse[] = planes.map((plan) => ({
      plan_id: plan.plan_id,
      nombre_carrera: plan.nombre_carrera,
      anio: plan.anio,
    }))

    return NextResponse.json(planesFormatted)
  } catch (error) {
    console.error('Error en API planes de carrera:', error)
    return NextResponse.json({ error: 'No se pudieron obtener los planes de estudio' }, { status: 500 })
  }
}
