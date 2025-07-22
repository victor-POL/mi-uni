'use client'

import { useState, useEffect } from 'react'
import { AppLayout } from '@/components/AppLayout'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AgregarCarreraModal } from '@/components/AgregarCarreraModal'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { GraduationCap, BookOpen, Trophy, Clock } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { resumenesCarreras, materiasEnCursoPorCarrera, historiaAcademicaPorCarrera } from '@/data/mis-carreras.data'
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
  const [selectedCarrera, setSelectedCarrera] = useState<CarreraResumen | null>(null)
  const [isLoadingCarreras, setIsLoadingCarreras] = useState(true)
  const [isLoadingDetalle, setIsLoadingDetalle] = useState(false)
  const [carreras, setCarreras] = useState<CarreraResumen[]>([])

  // Simular carga inicial de carreras
  useEffect(() => {
    const fetchCarreras = async () => {
      setIsLoadingCarreras(true)
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1500))
      setCarreras(resumenesCarreras)
      setIsLoadingCarreras(false)
    }

    fetchCarreras()
  }, [])

  // Función para recargar carreras después de agregar una nueva
  const handleCarreraAgregada = () => {
    // TODO: Aquí cargaremos las carreras reales desde la BD
    console.log('Carrera agregada, recargando lista...')
    // Por ahora mantenemos los datos mock
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
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">Mis Carreras</h1>
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
            ) : (
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
            )}
          </div>

          {/* Detailed View */}
          {(selectedCarrera || isLoadingDetalle) && (
            <>
              {isLoadingDetalle && <DetalleSkeleton />}
              {!isLoadingDetalle && selectedCarrera && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" />
                      {selectedCarrera.nombre}
                    </CardTitle>
                    <CardDescription>Información detallada de tu carrera</CardDescription>
                  </CardHeader>
                  <CardContent>
                <Tabs defaultValue="resumen" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="resumen">Resumen</TabsTrigger>
                    <TabsTrigger value="materias">Materias en Curso</TabsTrigger>
                    <TabsTrigger value="historial">Historial Académico</TabsTrigger>
                  </TabsList>

                  <TabsContent value="resumen" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <BookOpen className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-2xl font-bold">{selectedCarrera.materiasAprobadas}</p>
                              <p className="text-sm text-gray-600">Materias Aprobadas</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <Trophy className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                              <p className="text-2xl font-bold">{selectedCarrera.promedioGeneral}</p>
                              <p className="text-sm text-gray-600">Promedio General</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <Clock className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-2xl font-bold">{selectedCarrera.añoEstimadoEgreso}</p>
                              <p className="text-sm text-gray-600">Año Est. Egreso</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Progreso Detallado</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span>Materias Completadas</span>
                            <span>
                              {selectedCarrera.materiasAprobadas}/{selectedCarrera.materiasTotal}
                            </span>
                          </div>
                          <Progress
                            value={(selectedCarrera.materiasAprobadas / selectedCarrera.materiasTotal) * 100}
                            className="h-2"
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="materias" className="space-y-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Materias en Curso</h3>
                      {materiasEnCursoPorCarrera[selectedCarrera.id]?.map((materia) => (
                        <Card key={materia.codigo}>
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h4 className="font-semibold text-lg">{materia.nombre}</h4>
                                <p className="text-gray-600">
                                  {materia.codigo}
                                </p>
                                <p className="text-sm text-gray-500">{materia.profesor}</p>
                              </div>
                              <Badge variant="outline">{materia.horario}</Badge>
                            </div>

                            <div className="grid grid-cols-3 gap-4 text-center">
                              <div className="space-y-1">
                                <p className="text-sm text-gray-600">Parcial 1</p>
                                <p className="text-lg font-semibold">{materia.parcial1 ?? '-'}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm text-gray-600">Parcial 2</p>
                                <p className="text-lg font-semibold">{materia.parcial2 ?? '-'}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm text-gray-600">Final</p>
                                <p className="text-lg font-semibold">{materia.final ?? '-'}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="historial" className="space-y-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Historial Académico</h3>
                      {
                        historiaAcademicaPorCarrera[selectedCarrera.id]?.length ? (
                          <div className="space-y-4">
                            {historiaAcademicaPorCarrera[selectedCarrera.id].map((materia) => (
                              <Card key={materia.codigo}>
                                <CardContent className="p-6">
                                  <div className="flex items-start justify-between mb-4">
                                    <div>
                                      <h4 className="font-semibold text-lg">{materia.nombre}</h4>
                                      <p className="text-gray-600">{materia.codigo}</p>
                                    </div>
                                    <Badge className={getEstadoBadgeColor(materia.estado)}>
                                      {materia.estado}
                                    </Badge>
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    Nota: {materia.nota} | Año: {materia.anioCursada} | Cuatrimestre: {materia.cuatrimestreCursada}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500">No hay materias registradas en el historial académico.</p>
                        )
                      }
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
              )}
            </>
          )}
        </div>
      </AppLayout>
    </ProtectedRoute>
  )
}
