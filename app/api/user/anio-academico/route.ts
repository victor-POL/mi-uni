import { type NextRequest, NextResponse } from 'next/server'

import { deleteAnioAcademico, insertAnioAcademico, getAnioAcademico } from '@/lib/database/anio-academico.service'

import type { AnioAcademicoUsuarioDB } from '@/models/database/materias-en-curso.model'

import type { AnioAcademicoUsuarioAPIResponse } from '@/models/api/materias-en-curso.model'

import { adaptAnioAcademicoUsuarioDBToAPIResponse } from '@/adapters/materias-en-curso.adapter'

/**
 * GET /api/user/anio-academico?userId={id}
 * Obtiene el año académico del usuario o null si no tiene uno establecido
 * @description Parametro requerido: "userId" para identificar al usuario
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
    const anioAcademicoUsuarioDB: AnioAcademicoUsuarioDB | null = await getAnioAcademico(userIdParsed)

    // Transformar consulta a formato API
    const anioAcademicoUsuarioResponse: AnioAcademicoUsuarioAPIResponse =
      adaptAnioAcademicoUsuarioDBToAPIResponse(anioAcademicoUsuarioDB)

    // Retornar respuesta
    return NextResponse.json({
      success: true,
      data: anioAcademicoUsuarioResponse,
    })
  } catch (error) {
    console.error('Error GET año academico del usuario')

    if (error instanceof Error) {
      console.error('Error message:', error.message)
    }

    return NextResponse.json(
      {
        success: false,
        error: 'No se pudo obtener el año académico del usuario',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/user/anio-academico
 * Establece el año académico del usuario con el anio vigente
 * @description Body requerido: { usuario_id: number }
 */
export async function POST(request: NextRequest) {
  try {
    // Obtener parametros
    const body = await request.json()
    const { usuario_id } = body

    if (!usuario_id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Parametro "usuario_id" es requerido en body',
        },
        { status: 400 }
      )
    }

    // Operaciones
    await insertAnioAcademico(usuario_id)

    // Retornar respuesta
    return NextResponse.json({
      success: true,
      message: 'Año académico del usuario establecido exitosamente',
    })
  } catch (error) {
    console.error('Error POST establecer año academico usuario')

    if (error instanceof Error) {
      console.error('Error message:', error.message)
    }

    return NextResponse.json(
      {
        success: false,
        error: 'No se pudo establecer el año académico del usuario',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/user/anio-academico?userId={id}
 * Desestablece el año académico del usuario
 * @description Parametro requerido: "userId" para identificar al usuario
 */
export async function DELETE(request: NextRequest) {
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

    // Operaciones
    await deleteAnioAcademico(userIdParsed)

    // Retornar respuesta
    return NextResponse.json({ success: true, message: 'Año académico del usuario desestablecido exitosamente' })
  } catch (error) {
    console.error('Error DELETE desestablecer año academico usuario')

    if (error instanceof Error) {
      console.error('Error message:', error.message)
    }

    return NextResponse.json(
      {
        success: false,
        error: 'No se pudo desestablecer el año académico del usuario',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
