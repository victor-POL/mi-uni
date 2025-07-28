import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getDetallePlan } from '@/lib/database/planes-estudio.service'
import type {
  DetalleMateriaAPIResponse,
  EstadisticasPlanAPIResponse,
  PlanEstudioDetalleAPIResponse,
} from '@/models/api/planes-estudio.model'
import type { PlanEstudioDetalleDB } from '@/models/database/planes-estudio.model'

/**
 * GET /api/planes-estudio/[id]
 * Obtiene el detalle completo de un plan de estudio específico
 * @param params.id - ID del plan de estudio para obtener su detalle
 * @param searchParams.usuarioId - ID del usuario (opcional) para obtener el estado de las materias
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Obtener parametros
    const planId = parseInt(params.id, 10)

    if (Number.isNaN(planId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'ID de plan inválido',
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
            error: 'ID de usuario inválido',
          },
          { status: 400 }
        )
      }
    }

    // Consultar informacion
    const planDetalleDB: PlanEstudioDetalleDB | null = await getDetallePlan(planId, usuarioId)

    if (planDetalleDB === null) {
      return NextResponse.json(
        {
          success: false,
          error: 'Plan de estudio no encontrado',
        },
        { status: 404 }
      )
    }

    // Transformar consulta a formato API
    const materias: DetalleMateriaAPIResponse[] = planDetalleDB.materias.map((materia) => ({
      codigo_materia: materia.codigo_materia,
      nombre_materia: materia.nombre_materia,
      anio_cursada: materia.anio_cursada,
      cuatrimestre_cursada: materia.cuatrimestre,
      horas_semanales: materia.horas_semanales,
      tipo: materia.tipo,
      estado_materia_usuario: materia.estado_materia_usuario,
      lista_correlativas: materia.lista_correlativas.map((correlativa) => ({
        codigo_materia: correlativa.codigo_materia,
        nombre_materia: correlativa.nombre_materia,
      })),
    }))

    // Transformar consulta a formato API
    const estadisticas: EstadisticasPlanAPIResponse = {
      total_materias: planDetalleDB.estadisticas.total_materias,
      horas_totales: planDetalleDB.estadisticas.horas_totales,
      duracion_plan: planDetalleDB.estadisticas.duracion_plan,
      materias_sin_correlativas: planDetalleDB.estadisticas.materias_sin_correlativas,
    }

    const planDetalle: PlanEstudioDetalleAPIResponse = {
      plan_id: planDetalleDB.plan_id,
      nombre_carrera: planDetalleDB.nombre_carrera,
      anio: planDetalleDB.anio,
      estadisticas,
      materias,
    }

    // Retornar respuesta
    return NextResponse.json({
      success: true,
      data: planDetalle,
    })
  } catch (error) {
    console.error('Error GET detalle de plan de estudio')

    if (error instanceof Error) {
      console.error('Error message:', error.message)
    }

    return NextResponse.json(
      {
        success: false,
        error: 'No se pudo obtener el detalle del plan de estudio',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
