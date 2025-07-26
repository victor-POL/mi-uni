import type { PlanEstudioAPIResponse } from '@/models/api/planes-estudio.model'
import { NextResponse } from 'next/server'

/**
 * GET /api/planes-estudio
 * Obtiene un listado básico de todos los planes de estudio
 */
export async function GET() {
  try {
    const planesService = await import('@/lib/database/planes-estudio.service')
    const listadoPlanes: PlanEstudioAPIResponse[] = await planesService.getListadoPlanes()
    
    return NextResponse.json({
      success: true,
      data: listadoPlanes,
      count: listadoPlanes.length,
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
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
