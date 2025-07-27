import { NextResponse } from 'next/server'
import { eliminarCarreraUsuario } from '@/lib/database/carreras.service'

export async function DELETE(
  request: Request,
  { params }: { params: { planEstudioId: string } }
) {
  try {
    const body = await request.json()
    const { userId } = body

    const planEstudioId = parseInt(params.planEstudioId)

    if (!userId || !planEstudioId || Number.isNaN(planEstudioId)) {
      return NextResponse.json(
        { error: 'Parametros "userId" y "planEstudioId" son requeridos' },
        { status: 400 }
      )
    }

    await eliminarCarreraUsuario(userId, planEstudioId)

    return NextResponse.json({ 
      message: 'Carrera eliminada exitosamente' 
    })
  } catch (error) {
    console.error('Error en API eliminar carrera:', error)
    
    const message = error instanceof Error ? error.message : 'No se pudo eliminar la carrera'
    
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
