import { type NextRequest, NextResponse } from 'next/server'

import { obtenerCarrerasDisponiblesParaUsuario } from '@/lib/database/carreras.service'

import type { CarreraDB } from '@/models/database/carreras.model'

import type { CarreraUsuarioDisponibleAPIResponse } from '@/models/api/carreras.model'

import { adaptCarrerasDisponiblesDBToAPIResponse } from '@/adapters/carreras.adapter'

/**
 * GET /api/user/carreras/disponibles?userId={id}
 * Obtiene las carreras disponibles para un usuario (carreras en las que no está inscrito)
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
    const carrerasDB: CarreraDB[] = await obtenerCarrerasDisponiblesParaUsuario(userIdParsed)

    // Transformar consulta a formato API
    const carrerasResponse: CarreraUsuarioDisponibleAPIResponse[] = adaptCarrerasDisponiblesDBToAPIResponse(carrerasDB)

    // Retornar respuesta
    return NextResponse.json({
      success: true,
      data: carrerasResponse,
      count: carrerasResponse.length,
    })
  } catch (error) {
    console.error('Error GET carreras disponibles del usuario')

    if (error instanceof Error) {
      console.error('Error message:', error.message)
    }

    return NextResponse.json(
      {
        success: false,
        error: 'No se pudo obtener las carreras disponibles del usuario',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
