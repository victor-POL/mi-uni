import { NextResponse } from 'next/server'
import { obtenerAnioAcademicoVigente } from '@/lib/database/anio-academico.service'
import type { AnioAcademicoVigenteAPIResponse } from '@/models/api/materias-cursada.model'
import { adaptAnioAcademicoVigenteDBToAPIResponse } from '@/adapters/materias-cursada.model'

/**
 * GET /api/anio-academico
 * Obtiene el año académico vigente desde la base de datos.
 */
export async function GET() {
  try {
    const anioAcademicoUsuarioDB = await obtenerAnioAcademicoVigente()

    if (!anioAcademicoUsuarioDB) {
      return NextResponse.json({
        success: true,
        data: null,
      })
    }

    const anioAcademicoVigenteResponse: AnioAcademicoVigenteAPIResponse =
      adaptAnioAcademicoVigenteDBToAPIResponse(anioAcademicoUsuarioDB)

    return NextResponse.json({
      success: true,
      data: anioAcademicoVigenteResponse,
    })
  } catch (error) {
    console.error('Error GET año academico vigente')

    if (error instanceof Error) {
      console.error('Error message:', error.message)
    }

    return NextResponse.json(
      {
        success: false,
        error: 'No se pudo obtener el año académico vigente',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
