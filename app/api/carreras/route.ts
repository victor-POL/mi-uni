import { NextResponse } from 'next/server'
import { obtenerCarreras } from '@/lib/database/carreras.service'

export async function GET() {
  try {
    const carreras = await obtenerCarreras()
    return NextResponse.json(carreras)
  } catch (error) {
    console.error('Error en API carreras:', error)
    return NextResponse.json(
      { error: 'No se pudieron obtener las carreras' },
      { status: 500 }
    )
  }
}
