'use client'

/* ---------------------------------- HOOKS --------------------------------- */
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useCarrerasUsuario } from '@/hooks/use-carreras'
/* ------------------------------ COMPONENTS ----------------------------- */
import { CarreraDetalle } from '@/components/CarreraDetalle'
import { DetalleSkeleton } from '@/components/mis-carreras/SkeletonDetalleCarrera'
import { MisCarrerasLayout } from '@/components/mis-carreras/MisCarrerasLayout'
import { AgregarCarreraModal } from '@/components/AgregarCarreraModal'
/* ------------------------------ COMPONENTS UI ----------------------------- */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
/* --------------------------------- MODELS --------------------------------- */
import type { CarreraResumen } from '@/models/mis-carreras.model'
/* -------------------------------- ADAPTERS -------------------------------- */

export default function MisCarrerasPage() {
  // Para consultar las carreras del usuario
  const { userId } = useAuth()

  // Lista de carreras del usuario
  const { carreras, loading: isLoadingCarreras } = useCarrerasUsuario({ userID: userId })

  // Detalle de carrera consultada
  const [detalleCarreraConsultada, setDetalleCarreraConsultada] = useState<CarreraResumen | null>(null)
  const [isLoadingDetalleCarrera, setIsLoadingDetalleCarrera] = useState(false)

  // Simular carga de detalle cuando se selecciona una carrera
  const handleSelectCarrera = async (carrera: CarreraResumen) => {
    if (carrera.planEstudioId === detalleCarreraConsultada?.planEstudioId) return

    setIsLoadingDetalleCarrera(true)
    setDetalleCarreraConsultada(null)

    // Simular delay de API para cargar detalles
    await new Promise((resolve) => setTimeout(resolve, 800))
    setDetalleCarreraConsultada(carrera)
    setIsLoadingDetalleCarrera(false)
  }

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case 'En Curso':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200'
      case 'Completada':
        return 'bg-green-100 text-green-800 hover:bg-green-200'
      case 'Suspendida':
        return 'bg-red-100 text-red-800 hover:bg-red-200'
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200'
    }
  }

  if (isLoadingCarreras) return <MisCarrerasLayout loading />

  if (carreras === null) return <MisCarrerasLayout forError />

  if (carreras.length === 0) return <MisCarrerasLayout emptyCarreras />

  return (
    <MisCarrerasLayout>
      {/* Boton para abrir modal y agregar carreras */}
      <AgregarCarreraModal />

      {/* Lista de Carreras */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {carreras.map((carrera) => (
          <Card
            key={carrera.planEstudioId}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              detalleCarreraConsultada?.planEstudioId === carrera.planEstudioId ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => handleSelectCarrera(carrera)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-xl">{carrera.nombre}</CardTitle>
                </div>
                <Badge className={getEstadoBadgeColor(carrera.estado)}>{carrera.estado}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progreso General</span>
                  <span>{carrera.progreso}%</span>
                </div>
                <Progress value={carrera.progreso} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-gray-600">Materias</p>
                  <p className="font-medium">
                    {carrera.materiasAprobadas}/{carrera.materiasTotal}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-600">Promedio</p>
                  <p className="font-medium">{carrera.promedioGeneral}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detalle de Carrera Seleccionada */}
      {/* Placeholder detalle */}
      {isLoadingDetalleCarrera && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DetalleSkeleton />
        </div>
      )}

      {/* Detalle real */}
      {!isLoadingDetalleCarrera && detalleCarreraConsultada !== null && (
        <CarreraDetalle carrera={detalleCarreraConsultada} usuarioId={userId ?? 1} />
      )}
    </MisCarrerasLayout>
  )
}
