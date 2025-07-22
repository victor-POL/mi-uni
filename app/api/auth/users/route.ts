import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// Función para importar el service dinámicamente
async function importUsuariosService() {
  try {
    const service = await import('@/lib/database/usuarios.service')
    return service
  } catch (error) {
    console.error('Error importing usuarios service:', error)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { githubData } = body

    // Validar que tenemos los datos necesarios de GitHub
    if (!githubData || !githubData.id || !githubData.email) {
      return NextResponse.json(
        { error: 'GitHub data is required with id and email' },
        { status: 400 }
      )
    }

    try {
      // Importar el service dinámicamente
      const usuariosService = await importUsuariosService()
      if (!usuariosService) {
        throw new Error('Could not load usuarios service')
      }

      // Verificar o crear usuario
      const user = await usuariosService.verifyOrCreateGitHubUser(githubData)

      return NextResponse.json({
        success: true,
        data: {
          user: {
            id: user.id,
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.email,
            creado_at: user.creado_at
          }
        },
        message: 'User authenticated successfully'
      })

    } catch (error) {
      console.error('Error in user authentication:', error)
      return NextResponse.json(
        { 
          success: false,
          error: 'Database error during authentication',
          message: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Internal server error'
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('API Error in auth:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Invalid request',
        message: 'Could not parse request body'
      },
      { status: 400 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId parameter is required' },
        { status: 400 }
      )
    }

    try {
      const usuariosService = await importUsuariosService()
      if (!usuariosService) {
        throw new Error('Could not load usuarios service')
      }

      const userWithAuth = await usuariosService.getUserWithAuth(parseInt(userId))
      
      if (!userWithAuth) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: userWithAuth
      })

    } catch (error) {
      console.error('Error getting user:', error)
      return NextResponse.json(
        { 
          success: false,
          error: 'Database error',
          message: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Internal server error'
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}
