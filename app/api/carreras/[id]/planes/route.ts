import { NextResponse } from 'next/server'
import { getListadoPlanes } from '@/lib/database/planes-estudio.service'
import type { PlanEstudioAPIResponse } from '@/models/api/carreras.model'

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const carreraId = parseInt(params.id)

    if (Number.isNaN(carreraId)) {
      return NextResponse.json({ error: 'ID de carrera inválido' }, { status: 400 })
    }

    const planes: PlanEstudioAPIResponse[] = await getListadoPlanes(carreraId)

    return NextResponse.json(planes)
  } catch (error) {
    console.error('Error en API planes de carrera:', error)
    return NextResponse.json({ error: 'No se pudieron obtener los planes de estudio' }, { status: 500 })
  }
}
