'use client'

import { useState, useEffect } from 'react'
import { AppLayout } from '@/components/AppLayout'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AgregarCarreraModal } from '@/components/AgregarCarreraModal'
import { CarreraDetalle } from '@/components/CarreraDetalle'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { GraduationCap, BookOpen, Trophy, Clock } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { resumenesCarreras } from '@/data/mis-carreras.data'
import type { CarreraResumen } from '@/models/mis-carreras.model'

// Componente para skeleton de carrera
const CarreraSkeleton = () => (
  <Card className="animate-pulse">
    <CardHeader>
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-6 w-20" />
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-8" />
        </div>
        <Skeleton className="h-2 w-full" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-5 w-12" />
        </div>
        <div className="space-y-1">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-5 w-8" />
        </div>
      </div>
    </CardContent>
  </Card>
)

// Componente para skeleton de detalle
const DetalleSkeleton = () => (
  <Card>
    <CardHeader>
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-5" />
        <Skeleton className="h-6 w-48" />
      </div>
      <Skeleton className="h-4 w-64" />
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="flex space-x-1">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-36" />
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={`skeleton-${i}`}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-8 w-12" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
)

export default function MisCarrerasPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [selectedCarrera, setSelectedCarrera] = useState<CarreraResumen | null>(null)
  const [isLoadingCarreras, setIsLoadingCarreras] = useState(true)
  const [isLoadingDetalle, setIsLoadingDetalle] = useState(false)
  const [carreras, setCarreras] = useState<CarreraResumen[]>([])

  // Cargar carreras del usuario desde la BD
  useEffect(() => {
    if (user?.dbId) {
      fetchCarreras()
    }
  }, [user?.dbId])

  const fetchCarreras = async () => {
    if (!user?.dbId) return
    
    setIsLoadingCarreras(true)
    try {
      const response = await fetch(`/api/user/carreras/resumen?usuarioId=${user.dbId}`)
      if (!response.ok) {
        throw new Error('Error cargando carreras')
      }
      
      const carrerasData = await response.json()
      setCarreras(carrerasData)
    } catch (error) {
      console.error('Error cargando carreras:', error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las carreras. Mostrando datos de ejemplo.",
        variant: "destructive",
      })
      // Fallback a datos mock en caso de error
      setCarreras(resumenesCarreras)
    } finally {
      setIsLoadingCarreras(false)
    }
  }

  // Función para recargar carreras después de agregar una nueva
  const handleCarreraAgregada = () => {
    fetchCarreras()
  }

  // Simular carga de detalle cuando se selecciona una carrera
  const handleSelectCarrera = async (carrera: CarreraResumen) => {
    if (selectedCarrera?.id === carrera.id) return
    
    setIsLoadingDetalle(true)
    // Simular delay de API para cargar detalles
    await new Promise(resolve => setTimeout(resolve, 800))
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

  return (
    <ProtectedRoute>
      <AppLayout title="Mis Carreras">
        <div className="container mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Mis Carreras</h1>
              <p className="text-gray-600">Gestiona tus carreras y seguimiento académico</p>
            </div>
            <AgregarCarreraModal 
              onCarreraAgregada={handleCarreraAgregada}
              usuarioId={user?.dbId ?? 1}
            />
          </div>

          {/* Carreras Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isLoadingCarreras ? (
              // Mostrar skeletons mientras carga
              <>
                <CarreraSkeleton />
                <CarreraSkeleton />
              </>
            ) : carreras.length > 0 ? (
              // Mostrar carreras reales
              carreras.map((carrera) => (
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
              ))
            ) : (
              // Mostrar mensaje cuando no hay carreras
              <div className="col-span-full">
                <Card>
                  <CardContent className="text-center py-12">
                    <GraduationCap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes carreras agregadas</h3>
                    <p className="text-gray-500 mb-6">Comienza agregando tu primera carrera para ver tu progreso académico</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Detailed View */}
          {(selectedCarrera || isLoadingDetalle) && (
            <>
              {isLoadingDetalle && <DetalleSkeleton />}
              {!isLoadingDetalle && selectedCarrera && (
                <CarreraDetalle 
                  carrera={selectedCarrera} 
                  usuarioId={user?.dbId ?? 1} 
                />
              )}
            </>
          )}
        </div>
      </AppLayout>
    </ProtectedRoute>
  )
}
