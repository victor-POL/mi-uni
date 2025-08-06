import { NextResponse } from 'next/server'

import { getAnioAcademicoVigente } from '@/lib/database/anio-academico.service'

import type { AnioAcademicoVigenteDB } from '@/models/database/materias-cursada.model'

import type { AnioAcademicoVigenteAPIResponse } from '@/models/api/materias-cursada.model'

import { adaptAnioAcademicoVigenteDBToAPIResponse } from '@/adapters/materias-cursada.adapter'

/**
 * GET /api/anio-academico
 * Obtiene el año académico vigente o null si no hay uno vigente
 */
export async function GET() {
  try {
    // Obtener parametros

    // Consultar informacion
    const anioAcademicoVigenteDB: AnioAcademicoVigenteDB | null = await getAnioAcademicoVigente()

    if (!anioAcademicoVigenteDB) {
      return NextResponse.json({
        success: true,
        data: null,
      })
    }

    // Transformar consulta a formato API
    const anioAcademicoVigenteResponse: AnioAcademicoVigenteAPIResponse =
      adaptAnioAcademicoVigenteDBToAPIResponse(anioAcademicoVigenteDB)

    // Retornar respuesta
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
