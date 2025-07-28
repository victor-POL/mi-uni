'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Clock, Edit, GraduationCap, Trash2, Calendar } from 'lucide-react'
import { AppLayout } from '@/components/AppLayout'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { useAnioAcademicoUsuario } from '@/hooks/use-anio-academico'
import type {
  MateriaCursadaPorCarrera,
  EstadisticasMateriasEnCurso,
  MateriaCursada,
} from '@/models/materias-cursada.model'
import { AgregarMateriaEnCursoModal } from '@/components/AgregarMateriaEnCursoModal'
import { EditarNotasMateriaModal } from '@/components/EditarNotasMateriaModal'
import { EstablecerAnioAcademicoUsuarioModal } from '@/components/materias-en-curso/EstablecerAnioAcademicoUsuarioModal'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export default function MateriasEnCursoPage() {
  const { userId } = useAuth()
  const { toast } = useToast()
  const { anioAcademico, esNuevo, desestablecerAnioAcademico, refrescar: refrescarAnioAcademico } = useAnioAcademicoUsuario(userId as number)

  const [materiasPorCarrera, setMateriasPorCarrera] = useState<MateriaCursadaPorCarrera[]>([])
  const [estadisticas, setEstadisticas] = useState<EstadisticasMateriasEnCurso | null>(null)
  const [loading, setLoading] = useState(true)
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false)
  const [materiaEditando, setMateriaEditando] = useState<MateriaCursada | null>(null)

  // Estado para desestablecer anio academico usuario
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const cargarMateriasEnCurso = async () => {
    if (!userId) return

    try {
      setLoading(true)
      const response = await fetch(`/api/materias-en-curso?usuarioId=${userId}`)

      if (!response.ok) throw new Error('Error cargando materias en curso')

      const data = await response.json()
      setMateriasPorCarrera(data.materiasPorCarrera)
      setEstadisticas(data.estadisticas)
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las materias en curso',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarMateriasEnCurso()
  }, [userId])

  const handleEditarNotas = (materia: MateriaCursada) => {
    setMateriaEditando(materia)
    setModalEditarAbierto(true)
  }

  // Handler para mostrar confirmación de eliminar anio académico
  const handleMostrarConfirmacionEliminar = () => {
    setShowDeleteDialog(true)
  }

  // Handler para cancelar la eliminación de anio académico
  const handleCancelarEliminacion = () => {
    setShowDeleteDialog(false)
  }

  const handleEliminarMateria = async (materia: MateriaCursada) => {
    if (!userId) return

    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar esta materia en curso?')
    if (!confirmacion) return

    try {
      const params = new URLSearchParams({
        usuarioId: userId.toString(),
        planEstudioId: materia.planEstudioId.toString(),
        materiaId: materia.materiaId.toString(),
      })

      const response = await fetch(`/api/materias-en-curso/actualizar?${params}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Error eliminando materia')

      toast({
        title: 'Éxito',
        description: 'Materia eliminada correctamente',
      })

      cargarMateriasEnCurso()
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la materia',
        variant: 'destructive',
      })
    }
  }

  const formatearNota = (nota?: number) => {
    return nota !== undefined ? nota.toFixed(1) : '-'
  }

  const calcularPromedioMaterias = (materia: any) => {
    const notas = [
      materia.notaPrimerParcial,
      materia.notaSegundoParcial,
      materia.notaRecuperatorioPrimerParcial,
      materia.notaRecuperatorioSegundoParcial,
    ].filter((nota) => nota !== undefined)

    if (notas.length === 0) return undefined
    return notas.reduce((sum, nota) => sum + nota, 0) / notas.length
  }

  const handleDesestablecerAnio = async () => {
    const exito = await desestablecerAnioAcademico()

    if (exito) {
      toast({
        title: 'Año académico quitado de tu perfil',
        description: 'Tu año académico ha sido eliminado correctamente',
      })
      refrescarAnioAcademico()
    } else {
      toast({
        title: 'Error',
        description: 'No se pudo desvincular el año académico de tu perfil',
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <AppLayout title="Materias en Curso">
          <div className="container mx-auto p-6">
            <div className="text-center">Cargando materias en curso...</div>
          </div>
        </AppLayout>
      </ProtectedRoute>
    )
  }

  if (esNuevo) {
    return (
      <ProtectedRoute>
        <AppLayout title="Materias en Curso">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Materias en Curso</h1>
              <p className="text-gray-600">Gestiona las materias que estás cursando actualmente</p>
            </div>
          </div>
          {/* Selector de Año Académico */}
          <div className="container mx-auto p-6 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="h-5 w-5" />
                  Año Académico
                  <EstablecerAnioAcademicoUsuarioModal onEstablecerAnio={refrescarAnioAcademico} />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="mx-2">
                    <p className="text-2xl font-bold">-</p>
                    <div className="text-sm text-gray-600">
                      Por favor establece un año academico para empezar a gestionar tus materias
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </AppLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <AppLayout title="Materias en Curso">
        <div className="container mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Materias en Curso</h1>
              <p className="text-gray-600">Gestiona las materias que estás cursando actualmente</p>
            </div>
            {anioAcademico && <AgregarMateriaEnCursoModal usuarioId={userId || 0} />}
          </div>

          {/* Año Académico y Estadísticas */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            {estadisticas && anioAcademico && !esNuevo && (
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">Estadísticas del Curso</CardTitle>
                        <CardDescription>Año Académico: {anioAcademico}</CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-500 hover:text-red-600"
                        onClick={handleMostrarConfirmacionEliminar}
                      >
                        Quitar
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 mb-1">
                          <BookOpen className="h-4 w-4 text-blue-600" />
                          <p className="text-sm text-gray-600">Total</p>
                        </div>
                        <p className="text-xl font-bold text-blue-600">{estadisticas.totalMaterias}</p>
                      </div>

                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 mb-1">
                          <Calendar className="h-4 w-4 text-purple-600" />
                          <p className="text-sm text-gray-600">Anuales</p>
                        </div>
                        <p className="text-xl font-bold text-purple-600">{estadisticas.materiasAnual}</p>
                      </div>

                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 mb-1">
                          <Clock className="h-4 w-4 text-green-600" />
                          <p className="text-sm text-gray-600">1er Cuatr.</p>
                        </div>
                        <p className="text-xl font-bold text-green-600">{estadisticas.materiasPrimero}</p>
                      </div>

                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 mb-1">
                          <Clock className="h-4 w-4 text-orange-600" />
                          <p className="text-sm text-gray-600">2do Cuatr.</p>
                        </div>
                        <p className="text-xl font-bold text-orange-600">{estadisticas.materiasSegundo}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Materias por Carrera */}
          {anioAcademico &&
            (materiasPorCarrera.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hay materias en curso</h3>
                  <p className="text-gray-600 mb-4">Comienza agregando las materias que estás cursando actualmente</p>
                </CardContent>
              </Card>
            ) : (
              materiasPorCarrera.map((carrera) => (
                <Card key={`${carrera.carreraId}-${carrera.planEstudioId}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" />
                      {carrera.carreraNombre} - Plan {carrera.planAnio}
                    </CardTitle>
                    <CardDescription>
                      {carrera.materias.length} materia{carrera.materias.length !== 1 ? 's' : ''} en curso
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {carrera.materias.map((materia) => (
                        <div
                          key={`${materia.planEstudioId}-${materia.materiaId}`}
                          className="border rounded-lg p-4 hover:bg-gray-50"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium">
                                  {materia.codigoMateria} - {materia.nombreMateria}
                                </h3>
                              </div>
                              <p className="text-sm text-gray-600">En curso - Año académico {anioAcademico}</p>
                              <p className="text-xs text-gray-500">
                                Plan: {materia.anioEnPlan}° año, {materia.cuatrimestreEnPlan}° cuatrimestre -{' '}
                                {materia.horasSemanales}hs semanales
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => handleEditarNotas(materia)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleEliminarMateria(materia)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Notas */}
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">1er Parcial</p>
                              <p className="font-medium">{formatearNota(materia.notaPrimerParcial)}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">2do Parcial</p>
                              <p className="font-medium">{formatearNota(materia.notaSegundoParcial)}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Recup. 1er</p>
                              <p className="font-medium">{formatearNota(materia.notaRecuperatorioPrimerParcial)}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Recup. 2do</p>
                              <p className="font-medium">{formatearNota(materia.notaRecuperatorioSegundoParcial)}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Promedio</p>
                              <p className="font-medium">{formatearNota(calcularPromedioMaterias(materia))}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            ))}
        </div>

        {/* Modales */}
        <EditarNotasMateriaModal
          isOpen={modalEditarAbierto}
          onClose={() => {
            setModalEditarAbierto(false)
            setMateriaEditando(null)
          }}
          materia={materiaEditando}
          onSuccess={() => {
            cargarMateriasEnCurso()
            toast({
              title: 'Éxito',
              description: 'Notas actualizadas correctamente',
            })
          }}
        />

        {/* Diálogo de confirmación para desestablecer carrera */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción eliminará permanentemente el año académico establecido en tu perfil. Se perderan todos los
                datos cargados a tus materias en curso y no podrás recuperarlos. Las mismas regresaran al estado en el
                que estaban antes de establecer el año académico y podras agregarlas a tus materias en curso una vez que
                establezcas un nuevo año académico.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancelarEliminacion}>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDesestablecerAnio}
                className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Eliminando...
                  </>
                ) : (
                  'Eliminar Año Establecido'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </AppLayout>
    </ProtectedRoute>
  )
}
