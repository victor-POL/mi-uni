'use client'

import { useState, useEffect } from 'react'
import { CarreraDetalle } from '@/components/CarreraDetalle'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import type { CarreraResumen } from '@/models/mis-carreras.model'
import { DetalleSkeleton } from '@/components/mis-carreras/SkeletonDetalleCarrera'
import { MisCarrerasLayout } from '@/components/mis-carreras/MisCarrerasLayout'
import { AgregarCarreraModal } from '@/components/AgregarCarreraModal'

export default function MisCarrerasPage() {
  const { userId } = useAuth()
  const { toast } = useToast()
  const [selectedCarrera, setSelectedCarrera] = useState<CarreraResumen | null>(null)
  const [isLoadingCarreras, setIsLoadingCarreras] = useState(true)
  const [isLoadingDetalle, setIsLoadingDetalle] = useState(false)
  const [carreras, setCarreras] = useState<CarreraResumen[]>([])

  useEffect(() => {
    if (userId) {
      fetchCarreras()
    }
  }, [userId])

  const fetchCarreras = async () => {
    if (!userId) return

    setIsLoadingCarreras(true)
    try {
      const response = await fetch(`/api/user/carreras/resumen?usuarioId=${userId}`)
      if (!response.ok) {
        throw new Error('Error cargando carreras')
      }

      const carrerasData = await response.json()
      setCarreras(carrerasData)
    } catch (error) {
      console.error('Error cargando carreras:', error)
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las carreras. Mostrando datos de ejemplo.',
        variant: 'destructive',
      })
    } finally {
      setIsLoadingCarreras(false)
    }
  }

  // Simular carga de detalle cuando se selecciona una carrera
  const handleSelectCarrera = async (carrera: CarreraResumen) => {
    if (selectedCarrera?.id === carrera.id) return

    setIsLoadingDetalle(true)
    // Simular delay de API para cargar detalles
    await new Promise((resolve) => setTimeout(resolve, 800))
    setSelectedCarrera(carrera)
    setIsLoadingDetalle(false)
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
      <AgregarCarreraModal />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {carreras.map((carrera) => (
          <Card
            key={carrera.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedCarrera?.id === carrera.id ? 'ring-2 ring-blue-500' : ''
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

      {/* Detailed View */}
      {(selectedCarrera || isLoadingDetalle) && (
        <>
          {isLoadingDetalle && <DetalleSkeleton />}
          {!isLoadingDetalle && selectedCarrera && <CarreraDetalle carrera={selectedCarrera} usuarioId={userId ?? 1} />}
        </>
      )}
    </MisCarrerasLayout>
  )
}
