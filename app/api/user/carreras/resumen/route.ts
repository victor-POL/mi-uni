import { NextResponse } from 'next/server'
import { obtenerCarrerasUsuario, obtenerEstadisticasProgreso } from '@/lib/database/carreras.service'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const usuarioId = searchParams.get('usuarioId')

    if (!usuarioId) {
      return NextResponse.json(
        { error: 'Usuario ID es requerido' },
        { status: 400 }
      )
    }

    const usuarioIdNum = parseInt(usuarioId)
    if (Number.isNaN(usuarioIdNum)) {
      return NextResponse.json(
        { error: 'Usuario ID debe ser un número válido' },
        { status: 400 }
      )
    }

    // Obtener carreras del usuario
    const carrerasUsuario = await obtenerCarrerasUsuario(usuarioIdNum)
    
    // Obtener estadísticas para cada carrera
    const carrerasConEstadisticas = await Promise.all(
      carrerasUsuario.map(async (carrera) => {
        const estadisticas = await obtenerEstadisticasProgreso(usuarioIdNum, carrera.plan_estudio_id)
        
        return {
          id: carrera.plan_estudio_id,
          nombre: carrera.carrera_nombre,
          codigo: `${carrera.carrera_nombre.substring(0, 2).toUpperCase()}-${carrera.anio}`,
          estado: estadisticas.porcentajeProgreso === 100 ? 'Completada' : 'En Curso',
          progreso: estadisticas.porcentajeProgreso,
          materiasAprobadas: estadisticas.materiasAprobadas,
          materiasTotal: estadisticas.totalMaterias,
          promedioGeneral: estadisticas.promedioGeneral || 0,
          añoIngreso: carrera.anio, // TODO: Agregar fecha real de ingreso del usuario
          añoEstimadoEgreso: carrera.anio + 5, // TODO: Calcular basado en progreso real
          planEstudioId: carrera.plan_estudio_id,
          planEstudioAnio: carrera.anio,
          carreraId: carrera.carrera_id
        }
      })
    )

    return NextResponse.json(carrerasConEstadisticas)
  } catch (error) {
    console.error('Error en API carreras usuario:', error)
    return NextResponse.json(
      { error: 'No se pudieron obtener las carreras del usuario' },
      { status: 500 }
    )
  }
}
