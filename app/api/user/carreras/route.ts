import { type NextRequest, NextResponse } from 'next/server'

import { insertCarrera, eliminarCarrera, getCarreras, getEstadisticasProgreso } from '@/lib/database/carreras.service'

import type { CarreraUsuarioConEstadisticasAPIResponse } from '@/models/api/carreras.model'
import type { CarreraEstadisticasDB, CarreraUsuarioDB } from '@/models/database/carreras.model'

import { joinEstadisticaToCarreraAPIResponse } from '@/adapters/mis-carreras.adapter'

/**
 *
 * GET /api/user/carreras?userId={id}
 * Obtiene un resumen de las carreras del usuario con estadísticas de progreso
 * @descripcion Parametro requerido: "userId" para identificar al usuario
 */
export async function GET(request: NextRequest) {
  try {
    // Obtener parametros
    const { searchParams } = new URL(request.url)
    const userIdParam = searchParams.get('userId')

    if (!userIdParam) {
      return NextResponse.json(
        {
          success: false,
          error: 'Parametro "userId" es requerido',
        },
        { status: 400 }
      )
    }

    const userIdParsed = parseInt(userIdParam)
    if (Number.isNaN(userIdParsed)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Parametro "userId" inválido',
        },
        { status: 400 }
      )
    }

    // Consultar informacion
    const carrerasUsuarioDB: CarreraUsuarioDB[] = await getCarreras(userIdParsed)

    // Obtener estadísticas para cada carrera
    const carrerasUsuarioConEstadisticasResponse: CarreraUsuarioConEstadisticasAPIResponse[] = await Promise.all(
      carrerasUsuarioDB.map(async (carrera: CarreraUsuarioDB): Promise<CarreraUsuarioConEstadisticasAPIResponse> => {
        const estadisticas: CarreraEstadisticasDB = await getEstadisticasProgreso(userIdParsed, carrera.plan_estudio_id)

        // Transformar consulta a formato API
        const carreraConEstadisticas: CarreraUsuarioConEstadisticasAPIResponse = joinEstadisticaToCarreraAPIResponse(
          carrera,
          estadisticas
        )

        return carreraConEstadisticas
      })
    )

    // Retornar respuesta
    return NextResponse.json({
      success: true,
      data: carrerasUsuarioConEstadisticasResponse,
      count: carrerasUsuarioConEstadisticasResponse.length,
    })
  } catch (error) {
    console.error('Error GET carreras del usuario')

    if (error instanceof Error) {
      console.error('Error message:', error.message)
    }

    return NextResponse.json(
      {
        success: false,
        error: 'No se pudo obtener las carreras del usuario',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/user/carreras
 * Agrega una nueva carrera al usuario
 * @description Body requerido: { usuario_id: number, plan_estudio_id: number }
 */
export async function POST(request: NextRequest) {
  try {
    // Obtener parametros
    const body = await request.json()
    const { usuario_id, plan_estudio_id } = body

    if (!usuario_id || !plan_estudio_id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Parametros "usuario_id" y  "plan_estudio_id" son requeridos en body',
        },
        { status: 400 }
      )
    }

    // Operaciones
    await insertCarrera(usuario_id, plan_estudio_id)

    // Retornar respuesta
    return NextResponse.json({
      success: true,
      message: 'Carrera agregada exitosamente',
    })
  } catch (error) {
    console.error('Error POST agregar carrera al usuario')

    if (error instanceof Error) {
      console.error('Error message:', error.message)
    }

    return NextResponse.json(
      {
        success: false,
        error: 'No se pudo agregar la carrera al usuario',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/user/carreras?userId={id}&planEstudioId={id}
 * Elimina una carrera del usuario
 *
 */
export async function DELETE(request: NextRequest) {
  try {
    // Obtener parametros
    const { searchParams } = new URL(request.url)
    const userIdParam = searchParams.get('userId')
    const planEstudioIdParam = searchParams.get('planEstudioId')

    if (!userIdParam || !planEstudioIdParam) {
      return NextResponse.json(
        {
          success: false,
          error: 'Parametros "userId" y "planEstudioId" son requeridos',
        },
        { status: 400 }
      )
    }

    const userIdParsed = parseInt(userIdParam)
    const planEstudioIdParsed = parseInt(planEstudioIdParam)

    if (Number.isNaN(userIdParsed) || Number.isNaN(planEstudioIdParsed)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Parametros "userId" o "planEstudioId" inválidos',
        },
        { status: 400 }
      )
    }

    // Operaciones
    await eliminarCarrera(userIdParsed, planEstudioIdParsed)

    // Retornar respuesta
    return NextResponse.json({
      success: true,
      message: 'Carrera eliminada exitosamente',
    })
  } catch (error) {
    console.error('Error DELETE eliminar carrera del usuario')

    if (error instanceof Error) {
      console.error('Error message:', error.message)
    }

    return NextResponse.json(
      {
        success: false,
        error: 'No se pudo eliminar la carrera del usuario',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
