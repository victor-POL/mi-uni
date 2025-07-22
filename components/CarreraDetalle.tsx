'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { EditarMateriaModal } from '@/components/EditarMateriaModal'
import { GraduationCap, BookOpen, Trophy, Clock, Award, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import type { CarreraResumen } from '@/models/mis-carreras.model'
import type { MateriaEnCurso, MateriaHistorial, EstadisticasMateriasEnCurso, EstadisticasHistorial } from '@/models/carrera-detalle.model'

interface CarreraDetalleProps {
  carrera: CarreraResumen
  usuarioId: number
}

interface MateriasEnCursoData {
  materias: MateriaEnCurso[]
  estadisticas: EstadisticasMateriasEnCurso
}

interface HistorialData {
  historial: MateriaHistorial[]
  estadisticas: EstadisticasHistorial
}

// Componente Skeleton para loading
const TabSkeleton = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[...Array(3)].map(() => (
        <Card key={crypto.randomUUID()}>
          <CardContent className="p-4">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-8 w-12" />
          </CardContent>
        </Card>
      ))}
    </div>
    <Card>
      <CardContent className="p-4">
        <div className="space-y-2">
          {[...Array(5)].map(() => (
            <Skeleton key={crypto.randomUUID()} className="h-12 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
)

export function CarreraDetalle({ carrera, usuarioId }: CarreraDetalleProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('resumen')
  const [loadingMateriasEnCurso, setLoadingMateriasEnCurso] = useState(false)
  const [loadingHistorial, setLoadingHistorial] = useState(false)
  const [materiasEnCurso, setMateriasEnCurso] = useState<MateriasEnCursoData | null>(null)
  const [historial, setHistorial] = useState<HistorialData | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [materiaAEditar, setMateriaAEditar] = useState<MateriaHistorial | null>(null)

  // Cargar materias en curso cuando se active esa tab
  useEffect(() => {
    if (activeTab === 'materias-en-curso' && !materiasEnCurso && !loadingMateriasEnCurso) {
      fetchMateriasEnCurso()
    }
  }, [activeTab])

  // Cargar historial cuando se active esa tab
  useEffect(() => {
    if (activeTab === 'historial' && !historial && !loadingHistorial) {
      fetchHistorial()
    }
  }, [activeTab])

  const fetchMateriasEnCurso = async () => {
    setLoadingMateriasEnCurso(true)
    try {
      const response = await fetch(`/api/carreras/${carrera.planEstudioId}/materias-en-curso?usuarioId=${usuarioId}`)
      if (!response.ok) throw new Error('Error cargando materias en curso')
      
      const data = await response.json()
      setMateriasEnCurso(data)
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las materias en curso",
        variant: "destructive",
      })
    } finally {
      setLoadingMateriasEnCurso(false)
    }
  }

  const fetchHistorial = async () => {
    setLoadingHistorial(true)
    try {
      const response = await fetch(`/api/carreras/${carrera.planEstudioId}/historial?usuarioId=${usuarioId}`)
      if (!response.ok) throw new Error('Error cargando historial')
      
      const data = await response.json()
      setHistorial(data)
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "No se pudo cargar el historial académico",
        variant: "destructive",
      })
    } finally {
      setLoadingHistorial(false)
    }
  }

  // Función para ver detalle de materia
  const handleVerDetalle = (codigoMateria: string) => {
    router.push(`/materias/${codigoMateria}`)
  }

  // Función para editar materia
  const handleEditarMateria = (materia: MateriaHistorial) => {
    setMateriaAEditar(materia)
    setEditModalOpen(true)
  }

  // Función para refrescar historial después de editar
  const handleEditSuccess = () => {
    setHistorial(null) // Reset para forzar recarga
    if (activeTab === 'historial') {
      fetchHistorial()
    }
  }

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'Aprobada':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case 'En Final':
        return <Award className="h-4 w-4 text-purple-600" />
      case 'En Curso':
        return <BookOpen className="h-4 w-4 text-blue-600" />
      case 'Pendiente':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case 'Aprobada':
        return 'bg-green-100 text-green-800'
      case 'En Final':
        return 'bg-purple-100 text-purple-800'
      case 'En Curso':
        return 'bg-blue-100 text-blue-800'
      case 'Pendiente':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatearNota = (nota?: number) => {
    return nota ? nota.toFixed(2) : 'N/A'
  }

  const formatearCuatrimestre = (cuatrimestre: number) => {
    return cuatrimestre === 1 ? '1er Cuatrimestre' : '2do Cuatrimestre'
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-2xl">{carrera.nombre}</CardTitle>
          </div>
          <CardDescription>
            Plan {carrera.planEstudioAnio} - Detalle completo de tu progreso académico
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="resumen">Resumen</TabsTrigger>
              <TabsTrigger value="materias-en-curso">Materias en Curso</TabsTrigger>
              <TabsTrigger value="historial">Historial Académico</TabsTrigger>
            </TabsList>

          {/* Tab Resumen */}
          <TabsContent value="resumen" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{carrera.materiasTotal}</p>
                      <p className="text-sm text-gray-600">Total Materias</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Trophy className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{carrera.materiasAprobadas}</p>
                      <p className="text-sm text-gray-600">Aprobadas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Clock className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{carrera.progreso}%</p>
                      <p className="text-sm text-gray-600">Progreso</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Progreso General</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progreso de la carrera</span>
                    <span>{carrera.progreso}%</span>
                  </div>
                  <Progress value={carrera.progreso} className="h-2" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{carrera.materiasAprobadas}</p>
                    <p className="text-sm text-gray-600">Aprobadas</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{carrera.materiasTotal - carrera.materiasAprobadas}</p>
                    <p className="text-sm text-gray-600">Pendientes</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{carrera.promedioGeneral || 'N/A'}</p>
                    <p className="text-sm text-gray-600">Promedio</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Materias en Curso */}
          <TabsContent value="materias-en-curso" className="space-y-6">
            {loadingMateriasEnCurso ? (
              <TabSkeleton />
            ) : materiasEnCurso ? (
              <>
                {/* Estadísticas de materias en curso */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600">Total Cursando</p>
                      <p className="text-2xl font-bold text-blue-600">{materiasEnCurso.estadisticas.totalMaterias}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600">1er Cuatrimestre</p>
                      <p className="text-2xl font-bold text-green-600">{materiasEnCurso.estadisticas.materiasPrimero}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600">2do Cuatrimestre</p>
                      <p className="text-2xl font-bold text-orange-600">{materiasEnCurso.estadisticas.materiasSegundo}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600">Promedio Parciales</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {formatearNota(materiasEnCurso.estadisticas.promedioNotasParciales)}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Tabla de materias en curso */}
                <Card>
                  <CardHeader>
                    <CardTitle>Materias Cursando Actualmente</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {materiasEnCurso.materias.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Código</TableHead>
                            <TableHead>Materia</TableHead>
                            <TableHead>Año Plan</TableHead>
                            <TableHead>Cuatrimestre</TableHead>
                            <TableHead>Año Cursada</TableHead>
                            <TableHead>1er Parcial</TableHead>
                            <TableHead>2do Parcial</TableHead>
                            <TableHead>Horas</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {materiasEnCurso.materias.map((materia) => (
                            <TableRow key={`${materia.id}-${materia.anioCursada}-${materia.cuatrimestreCursada}`}>
                              <TableCell className="font-mono">{materia.codigo}</TableCell>
                              <TableCell className="font-medium">{materia.nombre}</TableCell>
                              <TableCell>{materia.anio}°</TableCell>
                              <TableCell>{formatearCuatrimestre(materia.cuatrimestre)}</TableCell>
                              <TableCell>{materia.anioCursada} - {formatearCuatrimestre(materia.cuatrimestreCursada)}</TableCell>
                              <TableCell>{formatearNota(materia.notaPrimerParcial)}</TableCell>
                              <TableCell>{formatearNota(materia.notaSegundoParcial)}</TableCell>
                              <TableCell>{materia.horasSemanales}hs</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-8">
                        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No hay materias en curso actualmente</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">Error cargando materias en curso</p>
              </div>
            )}
          </TabsContent>

          {/* Tab Historial Académico */}
          <TabsContent value="historial" className="space-y-6">
            {loadingHistorial ? (
              <TabSkeleton />
            ) : historial ? (
              <>
                {/* Estadísticas del historial */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600">Total Materias</p>
                      <p className="text-2xl font-bold text-gray-900">{historial.estadisticas.totalMaterias}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600">Aprobadas</p>
                      <p className="text-2xl font-bold text-green-600">{historial.estadisticas.materiasAprobadas}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600">En Final</p>
                      <p className="text-2xl font-bold text-purple-600">{historial.estadisticas.materiasEnFinal}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600">En Curso</p>
                      <p className="text-2xl font-bold text-blue-600">{historial.estadisticas.materiasEnCurso || 0}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600">Pendientes</p>
                      <p className="text-2xl font-bold text-red-600">{historial.estadisticas.materiasPendientes || 0}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600">Promedio</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {formatearNota(historial.estadisticas.promedioGeneral)}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Tabla del historial */}
                <Card>
                  <CardHeader>
                    <CardTitle>Historial Académico Completo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {historial.historial.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Estado</TableHead>
                            <TableHead>Código</TableHead>
                            <TableHead>Materia</TableHead>
                            <TableHead>Nota</TableHead>
                            <TableHead>Año Cursada</TableHead>
                            <TableHead>Cuatrimestre</TableHead>
                            <TableHead>Horas</TableHead>
                            <TableHead>Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {historial.historial.map((materia) => (
                            <TableRow key={materia.id} className="hover:bg-gray-50">
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {getEstadoIcon(materia.estado)}
                                  <Badge className={getEstadoBadgeColor(materia.estado)}>
                                    {materia.estado}
                                  </Badge>
                                </div>
                              </TableCell>
                              <TableCell className="font-mono">{materia.codigo}</TableCell>
                              <TableCell className="font-medium">{materia.nombre}</TableCell>
                              <TableCell className="font-bold">
                                {materia.nota ? (
                                  <span className={materia.nota >= 6 ? 'text-green-600' : 'text-red-600'}>
                                    {formatearNota(materia.nota)}
                                  </span>
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </TableCell>
                              <TableCell>
                                {materia.anioCursada || '-'}
                              </TableCell>
                              <TableCell>
                                {materia.cuatrimestreCursada ? formatearCuatrimestre(materia.cuatrimestreCursada) : '-'}
                              </TableCell>
                              <TableCell>{materia.horasSemanales}hs</TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleVerDetalle(materia.codigo)}
                                    className="h-8 px-2 text-blue-600 hover:text-blue-800"
                                  >
                                    Ver Detalle
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditarMateria(materia)}
                                    className="h-8 px-2 text-green-600 hover:text-green-800"
                                  >
                                    Editar
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-8">
                        <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No hay historial académico disponible</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">Error cargando historial académico</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>

    {/* Modal para editar materia */}
    <EditarMateriaModal
      isOpen={editModalOpen}
      onClose={() => setEditModalOpen(false)}
      materia={materiaAEditar}
      usuarioId={usuarioId}
      planEstudioId={carrera.planEstudioId}
      onSuccess={handleEditSuccess}
    />
  </>
  )
}
