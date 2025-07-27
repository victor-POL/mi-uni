import { NextResponse } from 'next/server'
import { obtenerCarrerasUsuario, obtenerEstadisticasProgreso } from '@/lib/database/carreras.service'
import type {
  CarreraUsuarioAPIResponse,
  CarreraUsuarioConEstadisticasAPIResponse,
  CarreraEstadisticasAPIResponse,
} from '@/models/api/carreras.model'
import { joinEstadisticaToCarreraAPIResponse } from '@/adapters/carreras.adapter'

/**
 *
 * GET /api/user/carreras/resumen
 * Obtiene un resumen de las carreras del usuario
 * Parameters:
 * - usuarioId: ID del usuario para obtener sus carreras
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const usuarioId = searchParams.get('usuarioId')

    if (!usuarioId) {
      return NextResponse.json({ error: 'Usuario ID es requerido' }, { status: 400 })
    }

    const usuarioIdNum = parseInt(usuarioId)
    if (Number.isNaN(usuarioIdNum)) {
      return NextResponse.json({ error: 'Usuario ID debe ser un número válido' }, { status: 400 })
    }

    // Obtener carreras del usuario
    const carrerasUsuario: CarreraUsuarioAPIResponse[] = await obtenerCarrerasUsuario(usuarioIdNum)

    // Obtener estadísticas para cada carrera
    const carrerasConEstadisticas: CarreraUsuarioConEstadisticasAPIResponse[] = await Promise.all(
      carrerasUsuario.map(async (carrera): Promise<CarreraUsuarioConEstadisticasAPIResponse> => {
        const estadisticas: CarreraEstadisticasAPIResponse = await obtenerEstadisticasProgreso(
          usuarioIdNum,
          carrera.plan_estudio_id
        )

        const carreraConEstadisticas: CarreraUsuarioConEstadisticasAPIResponse = joinEstadisticaToCarreraAPIResponse(
          carrera,
          estadisticas
        )

        return carreraConEstadisticas
      })
    )

    return NextResponse.json({
      success: true,
      data: carrerasConEstadisticas,
      count: carrerasConEstadisticas.length,
    })
  } catch (error) {
    console.error('Error en API carreras usuario:', error)
    return NextResponse.json({ error: 'No se pudieron obtener las carreras del usuario' }, { status: 500 })
  }
}
