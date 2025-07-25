import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const planId = searchParams.get('id')
    const summary = searchParams.get('summary')
    const usuarioId = searchParams.get('usuarioId')

    // Si es summary === true se devuelve un listado básico de planes, sin detalles
    if (summary === 'true') {
      try {
        const planesService = await import('@/lib/database/planes-estudio.service')
        const planesBasicos = await planesService.getListadoPlanes()
        return NextResponse.json({
          success: true,
          data: planesBasicos,
          count: planesBasicos.length,
        })
      } catch (error) {
        console.error('Error fetching from database:', error)

        return NextResponse.json(
          {
            error: 'Internal server error: No se pudo obtener el listado de planes de estudio',
          },
          { status: 500 }
        )
      }
    }

    // Si se proporciona un ID específico de un plan, devolver el detalle del plan
    if (planId) {
      const planIdParsed = parseInt(planId, 10)

      if (Number.isNaN(planIdParsed)) {
        return NextResponse.json({ error: 'Plan ID invalido' }, { status: 400 })
      }

      try {
        const planesService = await import('@/lib/database/planes-estudio.service')

        const parsedUsuarioId = usuarioId ? Number(usuarioId) : undefined

        if (usuarioId && Number.isNaN(parsedUsuarioId)) {
          return NextResponse.json({ error: 'Usuario ID invalido' }, { status: 400 })
        }

        const planDetalle = await planesService.getDetallePlan(planIdParsed, parsedUsuarioId)
        if (planDetalle === null) {
          return NextResponse.json({ error: 'No se pudo obtener el detalle del plan de estudio (id nulo)' }, { status: 404 })
        }

        return NextResponse.json({
          success: true,
          data: planDetalle,
          source: 'database',
        })
      } catch (error) {
        console.error('Error fetching plan from database: ', error)
        return NextResponse.json({ error: 'Internal server error: Something went wrong' }, { status: 500 })
      }
    }

    // Si no se proporcionan parámetros, notificar que se deben indicar parámetros de búsqueda
    return NextResponse.json({ error: 'Debe proporcionar parametros (id, summary, usuarioId)' }, { status: 400 })
  } catch (error) {
    console.error('API Error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Ha ocurrido un error al procesar la solicitud',
      },
      { status: 500 }
    )
  }
}
