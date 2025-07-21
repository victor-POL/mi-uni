import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { planesDeEstudio } from '@/data/planes-estudio.data'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const planId = searchParams.get('id')
    const carrera = searchParams.get('carrera')
    const summary = searchParams.get('summary')

    // Si se solicita solo el resumen de planes (para el selector)
    if (summary === 'true') {
      try {
        const planesService = await import('@/lib/database/planes-estudio.service')
        const planesBasicos = await planesService.getAllPlanesBasicos()
        return NextResponse.json({
          success: true,
          data: planesBasicos,
          count: planesBasicos.length,
          source: 'database'
        })
      } catch (error) {
        console.error('Error fetching from database, falling back to static data:', error)
        
        // Fallback a datos estáticos
        const planesSummary = planesDeEstudio.map(plan => ({
          idPlan: plan.idPlan,
          nombreCarrera: plan.nombreCarrera,
          anio: plan.anio
        }))
        
        return NextResponse.json({
          success: true,
          data: planesSummary,
          count: planesSummary.length,
          source: 'fallback'
        })
      }
    }

    // Si se proporciona un ID específico, devolver ese plan completo
    if (planId) {
      const id = parseInt(planId, 10)
      if (Number.isNaN(id)) {
        return NextResponse.json(
          { error: 'Invalid plan ID provided' },
          { status: 400 }
        )
      }

      try {
        const planesService = await import('@/lib/database/planes-estudio.service')
        const plan = await planesService.getPlanById(id)
        if (!plan) {
          return NextResponse.json(
            { error: 'Plan not found' },
            { status: 404 }
          )
        }

        return NextResponse.json({
          success: true,
          data: plan,
          source: 'database'
        })
      } catch (error) {
        console.error('Error fetching plan from database, falling back to static data:', error)
        
        // Fallback a datos estáticos
        const plan = planesDeEstudio.find(p => p.idPlan === id)
        if (!plan) {
          return NextResponse.json(
            { error: 'Plan not found' },
            { status: 404 }
          )
        }

        return NextResponse.json({
          success: true,
          data: plan,
          source: 'fallback'
        })
      }
    }

    // Si se proporciona una búsqueda por carrera
    if (carrera) {
      try {
        const planesService = await import('@/lib/database/planes-estudio.service')
        const planes = await planesService.searchPlanesByCarrera(carrera)
        return NextResponse.json({
          success: true,
          data: planes,
          count: planes.length,
          source: 'database'
        })
      } catch (error) {
        console.error('Error searching plans in database, falling back to static data:', error)
        
        // Fallback a datos estáticos
        const planes = planesDeEstudio.filter(p => 
          p.nombreCarrera.toLowerCase().includes(carrera.toLowerCase())
        )
        return NextResponse.json({
          success: true,
          data: planes,
          count: planes.length,
          source: 'fallback'
        })
      }
    }

    // Si no se proporcionan parámetros, devolver todos los planes completos
    return NextResponse.json({
      success: true,
      data: planesDeEstudio,
      count: planesDeEstudio.length,
      source: 'static'
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Something went wrong'
      },
      { status: 500 }
    )
  }
}

// Para el futuro, si necesitas crear nuevos planes
export async function POST() {
  try {
    // Aquí puedes agregar la lógica para crear nuevos planes
    return NextResponse.json(
      { error: 'POST method not implemented yet' },
      { status: 501 }
    )
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Para el futuro, si necesitas actualizar planes
export async function PUT() {
  try {
    // Aquí puedes agregar la lógica para actualizar planes
    return NextResponse.json(
      { error: 'PUT method not implemented yet' },
      { status: 501 }
    )
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
