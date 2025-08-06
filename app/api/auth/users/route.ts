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
    const { githubData, emailPasswordData } = body

    // Validar que tenemos algún tipo de datos
    if (!githubData && !emailPasswordData) {
      return NextResponse.json({ error: 'Either GitHub data or Email/Password data is required' }, { status: 400 })
    }

    // Validar datos específicos según el tipo
    if (githubData && (!githubData.id || !githubData.email)) {
      return NextResponse.json({ error: 'GitHub data requires id and email' }, { status: 400 })
    }

    if (emailPasswordData && (!emailPasswordData.id || !emailPasswordData.email)) {
      return NextResponse.json({ error: 'Email/Password data requires id (Firebase UID) and email' }, { status: 400 })
    }

    try {
      // Importar el service dinámicamente
      const usuariosService = await importUsuariosService()
      if (!usuariosService) {
        throw new Error('Could not load usuarios service')
      }

      let user: any = null
      if (githubData) {
        // Proceso para GitHub
        user = await usuariosService.verifyOrCreateGitHubUser(githubData)
      } else if (emailPasswordData) {
        // Proceso para Email/Password
        user = await usuariosService.verifyOrCreateEmailPasswordUser(emailPasswordData)
      }

      if (!user) {
        throw new Error('Failed to create or verify user')
      }

      return NextResponse.json({
        success: true,
        data: {
          user: {
            id: user.id,
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.email,
            creado_at: user.creado_at,
          },
        },
        message: 'User authenticated successfully',
      })
    } catch (error) {
      console.error('Error in user authentication:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'Database error during authentication',
          message: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Internal server error',
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
        message: 'Could not parse request body',
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
      return NextResponse.json({ error: 'userId parameter is required' }, { status: 400 })
    }

    try {
      const usuariosService = await importUsuariosService()
      if (!usuariosService) {
        throw new Error('Could not load usuarios service')
      }

      const userWithAuth = await usuariosService.getUserWithAuth(parseInt(userId))

      if (!userWithAuth) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      return NextResponse.json({
        success: true,
        data: userWithAuth,
      })
    } catch (error) {
      console.error('Error getting user:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'Database error',
          message: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Internal server error',
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}
