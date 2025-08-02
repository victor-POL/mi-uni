'use client'

/* ---------------------------------- HOOKS --------------------------------- */
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { useAnioAcademicoUsuario } from '@/hooks/use-anio-academico'
import { useMateriasEnCurso } from '@/hooks/use-materias-en-curso'
/* ----------------------------- COMPONENTES UI ----------------------------- */
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Clock, Edit, GraduationCap, Calendar } from 'lucide-react'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
/* ------------------------------- COMPONENTES ------------------------------ */
import { AppLayout } from '@/components/AppLayout'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { ErrorAlert } from '@/components/ErrorAlert'
import { AgregarMateriaEnCursoModal } from '@/components/AgregarMateriaEnCursoModal'
import { EditarNotasMateriaModal } from '@/components/EditarNotasMateriaModal'
import { EstablecerAnioAcademicoUsuarioModal } from '@/components/materias-en-curso/EstablecerAnioAcademicoUsuarioModal'
import { DesestablecerAnioAcademicoUsuarioModal } from '@/components/materias-en-curso/DesestablecerAnioAcademicoUsuarioModal'
import { EliminarMateriaEnCursoModal } from '@/components/materias-en-curso/EliminarMateriaEnCursoModal'
/* -------------------------------- CONTEXTS -------------------------------- */
import { useAuth } from '@/contexts/AuthContext'
/* --------------------------------- MODELS --------------------------------- */
import type { MateriaCursada } from '@/models/materias-cursada.model'
/* --------------------------------- UTILES --------------------------------- */
import { formatearNota, calcularPromedioMaterias } from '@/lib/utils'

export default function MateriasEnCursoPage() {
  const { userId } = useAuth()
  const { toast } = useToast()

  // Hook para obtener el año académico del usuario
  const {
    anioAcademico,
    esNuevo,
    loading: loadingAnioAcademico,
    desestablecerAnioAcademico,
    establecerAnioAcademicoVigente,
    refrescar: refrescarAnioAcademico,
  } = useAnioAcademicoUsuario(userId as number)

  // Si el usuario tiene un año académico establecido, carga las materias en curso
  const {
    infoMateriasEnCurso,
    loading: loadinfoInfoMateriasEnCurso,
    refetch: refrescarInfoMateriasEnCurso,
  } = useMateriasEnCurso({
    userId: userId as number,
    autoFetch: true,
    esNuevo: esNuevo,
  })

  // Estado para el modal de edición de notas
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false)
  const [materiaEditando, setMateriaEditando] = useState<MateriaCursada | null>(null)

  // Estado para el loading de eliminar materia
  const [eliminandoMateria, setEliminandoMateria] = useState(false)

  // Handler para editar notas de una materia
  const handleEditarNotas = (materia: MateriaCursada) => {
    setMateriaEditando(materia)
    setModalEditarAbierto(true)
  }

  const eliminarMateria = async (materia: MateriaCursada) => {
    if (!userId) return

    setEliminandoMateria(true)

    try {
      const params = new URLSearchParams({
        userId: userId.toString(),
        planEstudioId: materia.planEstudioId.toString(),
        materiaId: materia.materiaId.toString(),
      })

      const response = await fetch(`/api/user/materias-en-curso?${params}`, {
        method: 'DELETE',
      })

      const responseData = await response.json()

      if (!responseData.success) {
        toast({
          title: 'Error',
          description: responseData.error ,
          variant: 'destructive',
        })

        return
      } else {
        toast({
          title: '¡Éxito!',
          description: responseData.message,
        })

        refrescarInfoMateriasEnCurso()
      }
    } catch (err) {
      toast({
        title: 'Error al eliminar materia',
        description: err instanceof Error ? err.message : 'Ocurrió un error inesperado al eliminar la materia.',
        variant: 'destructive',
      })
    } finally {
      setEliminandoMateria(false)
    }
  }

  if (loadingAnioAcademico || loadinfoInfoMateriasEnCurso) {
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
          {/* Loading Icon */}
          <LoadingSpinner className="my-5" text="Obteniendo año academico y materias en curso" />
        </AppLayout>
      </ProtectedRoute>
    )
  }

  if (infoMateriasEnCurso === null) {
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
          {/* Error Message */}
          <ErrorAlert />
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
                  <EstablecerAnioAcademicoUsuarioModal
                    onEstablecerAnio={refrescarAnioAcademico}
                    establecerAnioAcademicoVigente={establecerAnioAcademicoVigente}
                    loadingEstablecimiento={loadingAnioAcademico}
                  />
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
          </div>

          {/* Año Académico y Estadísticas */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">Estadísticas del Curso</CardTitle>
                      <CardDescription>Año Académico: {anioAcademico}</CardDescription>
                    </div>
                    <DesestablecerAnioAcademicoUsuarioModal
                      desestablecerAnioAcademico={desestablecerAnioAcademico}
                      loading={loadingAnioAcademico}
                      onDesestablecerAnio={refrescarAnioAcademico}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                        <p className="text-sm text-gray-600">Total</p>
                      </div>
                      <p className="text-xl font-bold text-blue-600">
                        {infoMateriasEnCurso.estadisticasCursada.totalMaterias}
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <Calendar className="h-4 w-4 text-purple-600" />
                        <p className="text-sm text-gray-600">Anuales</p>
                      </div>
                      <p className="text-xl font-bold text-purple-600">
                        {infoMateriasEnCurso.estadisticasCursada.materiasAnual}
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <Clock className="h-4 w-4 text-green-600" />
                        <p className="text-sm text-gray-600">1er Cuatr.</p>
                      </div>
                      <p className="text-xl font-bold text-green-600">
                        {infoMateriasEnCurso.estadisticasCursada.materiasPrimero}
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <Clock className="h-4 w-4 text-orange-600" />
                        <p className="text-sm text-gray-600">2do Cuatr.</p>
                      </div>
                      <p className="text-xl font-bold text-orange-600">
                        {infoMateriasEnCurso.estadisticasCursada.materiasSegundo}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {infoMateriasEnCurso.materiasPorCarrera.length > 0 && (
            <AgregarMateriaEnCursoModal onCarreraAgregada={refrescarInfoMateriasEnCurso} />
          )}

          {/* Materias por Carrera */}
          {infoMateriasEnCurso.materiasPorCarrera.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center flex flex-col items-center">
                <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay materias en curso</h3>
                <p className="text-gray-600 mb-4">Comienza agregando las materias que estás cursando actualmente</p>
                <AgregarMateriaEnCursoModal onCarreraAgregada={refrescarInfoMateriasEnCurso} />
              </CardContent>
            </Card>
          ) : (
            infoMateriasEnCurso.materiasPorCarrera.map((carrera) => (
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
                            <EliminarMateriaEnCursoModal
                              loading={eliminandoMateria}
                              materia={materia}
                              onConfirm={eliminarMateria}
                            />
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
          )}
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
            refrescarInfoMateriasEnCurso()
            toast({
              title: 'Éxito',
              description: 'Notas actualizadas exitosamente',
            })
          }}
        />
      </AppLayout>
    </ProtectedRoute>
  )
}
