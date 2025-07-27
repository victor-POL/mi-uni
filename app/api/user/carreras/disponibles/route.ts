import { NextResponse } from 'next/server'
import { obtenerCarrerasDisponiblesParaUsuario } from '@/lib/database/carreras.service'
import type { CarreraUsuarioDisponibleAPIResponse } from '@/models/api/carreras.model'

/**
 * GET /api/user/carreras/disponibles
 * Obtiene las carreras disponibles para un usuario (carreras en las que no está inscrito)
 * Parameters:
 * - usuarioId: ID del usuario para obtener sus carreras disponibles
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

    const carrerasDisponibles: CarreraUsuarioDisponibleAPIResponse[] =
      await obtenerCarrerasDisponiblesParaUsuario(usuarioIdNum)

    return NextResponse.json(carrerasDisponibles)
  } catch (error) {
    console.error('Error en API carreras disponibles:', error)
    return NextResponse.json({ error: 'No se pudieron obtener las carreras disponibles' }, { status: 500 })
  }
}
