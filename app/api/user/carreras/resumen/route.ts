import { NextResponse } from 'next/server'
import { obtenerCarrerasUsuario, obtenerEstadisticasProgreso } from '@/lib/database/carreras.service'
import type { CarreraUsuarioDB } from '@/models/database/carreras.model'
import type {
  CarreraUsuarioConEstadisticasAPIResponse,
  CarreraEstadisticasAPIResponse,
} from '@/models/api/carreras.model'
import { joinEstadisticaToCarreraAPIResponse } from '@/adapters/carreras.adapter'

/**
 *
 * GET /api/user/carreras/resumen
 * Obtiene un resumen de las carreras del usuario con estadísticas de progreso
 * Parameters:
 * - usuarioId: ID del usuario para obtener sus carreras
 */
export async function GET(request: Request) {
  try {
    // Obtener parametros
    const { searchParams } = new URL(request.url)
    const usuarioId = searchParams.get('usuarioId')

    if (!usuarioId) {
      return NextResponse.json({ error: 'Usuario ID es requerido' }, { status: 400 })
    }

    const usuarioIdNum = parseInt(usuarioId)
    if (Number.isNaN(usuarioIdNum)) {
      return NextResponse.json({ error: 'Usuario ID debe ser un número válido' }, { status: 400 })
    }

    // Consultar informacion
    const carrerasUsuario: CarreraUsuarioDB[] = await obtenerCarrerasUsuario(usuarioIdNum)

    // Obtener estadísticas para cada carrera
    const carrerasConEstadisticas: CarreraUsuarioConEstadisticasAPIResponse[] = await Promise.all(
      carrerasUsuario.map(async (carrera): Promise<CarreraUsuarioConEstadisticasAPIResponse> => {
        const estadisticas: CarreraEstadisticasAPIResponse = await obtenerEstadisticasProgreso(
          usuarioIdNum,
          carrera.plan_estudio_id
        )

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
      data: carrerasConEstadisticas,
      count: carrerasConEstadisticas.length,
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
