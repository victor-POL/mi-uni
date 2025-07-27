import { NextResponse } from 'next/server'
import { agregarCarreraUsuario } from '@/lib/database/carreras.service'
import type { BodyPostNuevaCarreraEnUsuario } from '@/models/api/carreras.model'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { usuario_id, plan_estudio_id } = body as BodyPostNuevaCarreraEnUsuario

    if (!usuario_id || !plan_estudio_id) {
      return NextResponse.json(
        { error: 'Parametros "usuario_id" y "plan_estudio_id" son requeridos' },
        { status: 400 }
      )
    }

    await agregarCarreraUsuario(usuario_id, plan_estudio_id)
    
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
