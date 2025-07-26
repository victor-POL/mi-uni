import type { PlanEstudioDetalleAPIResponse } from '@/models/api/planes-estudio.model'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

/**
 * GET /api/planes-estudio/[id]
 * Obtiene el detalle completo de un plan de estudio específico
 * @param params.id - ID del plan de estudio
 * @param searchParams.usuarioId - ID del usuario (opcional) para obtener el estado de las materias
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const planId = parseInt(params.id, 10)

    if (Number.isNaN(planId)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'ID de plan inválido' 
        }, 
        { status: 400 }
      )
    }

    const { searchParams } = new URL(request.url)
    const usuarioIdParam = searchParams.get('usuarioId')
    
    let usuarioId: number | undefined
    if (usuarioIdParam) {
      usuarioId = parseInt(usuarioIdParam, 10)
      if (Number.isNaN(usuarioId)) {
        return NextResponse.json(
          { 
            success: false,
            error: 'ID de usuario inválido' 
          }, 
          { status: 400 }
        )
      }
    }

    const planesService = await import('@/lib/database/planes-estudio.service')
    const planDetalle: PlanEstudioDetalleAPIResponse | null = await planesService.getDetallePlan(planId, usuarioId)
    
    if (planDetalle === null) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Plan de estudio no encontrado' 
        }, 
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: planDetalle,
    })
  } catch (error) {
    console.error('Error fetching plan detalle:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor',
      },
      { status: 500 }
    )
  }
}
