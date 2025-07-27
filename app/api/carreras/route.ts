import { NextResponse } from 'next/server'
import { obtenerCarreras } from '@/lib/database/carreras.service'
import type { CarreraDB } from '@/models/database/carreras.model'
import type { CarreraAPIResponse } from '@/models/api/carreras.model'

export async function GET() {
  try {
    const carrerasDB: CarreraDB[] = await obtenerCarreras()

    const carrerasFormatted: CarreraAPIResponse[] = carrerasDB.map((carrera) => ({
      carrera_id: carrera.carrera_id,
      carrera_nombre: carrera.carrera_nombre,
    }))

    return NextResponse.json(carrerasFormatted)
  } catch (error) {
    console.error('Error en API carreras:', error)
    return NextResponse.json({ error: 'No se pudieron obtener las carreras' }, { status: 500 })
  }
}
