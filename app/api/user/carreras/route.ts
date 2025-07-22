import { NextResponse } from 'next/server'
import { agregarCarreraUsuario } from '@/lib/database/carreras.service'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { usuarioId, planEstudioId } = body

    if (!usuarioId || !planEstudioId) {
      return NextResponse.json(
        { error: 'Usuario ID y Plan de Estudio ID son requeridos' },
        { status: 400 }
      )
    }

    await agregarCarreraUsuario(usuarioId, planEstudioId)
    
    return NextResponse.json({ 
      message: 'Carrera agregada exitosamente' 
    })
  } catch (error) {
    console.error('Error en API agregar carrera:', error)
    
    const message = error instanceof Error ? error.message : 'No se pudo agregar la carrera'
    
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
