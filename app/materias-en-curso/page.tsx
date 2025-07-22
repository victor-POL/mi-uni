'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Clock, Edit, Plus, GraduationCap, Trash2 } from 'lucide-react'
import { AppLayout } from '@/components/AppLayout'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import type { MateriaCursadaPorCarrera, EstadisticasMateriasEnCurso, MateriaCursada } from '@/models/materias-cursada.model'
import { AgregarMateriaEnCursoModal } from '@/components/AgregarMateriaEnCursoModal'
import { EditarNotasMateriaModal } from '@/components/EditarNotasMateriaModal'

export default function MateriasEnCursoPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [materiasPorCarrera, setMateriasPorCarrera] = useState<MateriaCursadaPorCarrera[]>([])
  const [estadisticas, setEstadisticas] = useState<EstadisticasMateriasEnCurso | null>(null)
  const [loading, setLoading] = useState(true)
  const [modalAgregarAbierto, setModalAgregarAbierto] = useState(false)
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false)
  const [materiaEditando, setMateriaEditando] = useState<MateriaCursada | null>(null)

  const cargarMateriasEnCurso = async () => {
    if (!user?.dbId) return
    
    try {
      setLoading(true)
      const response = await fetch(`/api/materias-en-curso?usuarioId=${user.dbId}`)
      
      if (!response.ok) throw new Error('Error cargando materias en curso')
      
      const data = await response.json()
      setMateriasPorCarrera(data.materiasPorCarrera)
      setEstadisticas(data.estadisticas)
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las materias en curso",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarMateriasEnCurso()
  }, [user?.dbId])

  const handleEditarNotas = (materia: MateriaCursada) => {
    setMateriaEditando(materia)
    setModalEditarAbierto(true)
  }

  const handleEliminarMateria = async (materia: MateriaCursada) => {
    if (!user?.dbId) return
    
    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar esta materia en curso?')
    if (!confirmacion) return
    
    try {
      const params = new URLSearchParams({
        usuarioId: user.dbId.toString(),
        planEstudioId: materia.planEstudioId.toString(),
        materiaId: materia.materiaId.toString(),
        anioCursada: materia.anioCursada.toString(),
        cuatrimestreCursada: materia.cuatrimestreCursada.toString()
      })
      
      const response = await fetch(`/api/materias-en-curso/actualizar?${params}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Error eliminando materia')
      
      toast({
        title: "Éxito",
        description: "Materia eliminada correctamente",
      })
      
      cargarMateriasEnCurso()
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "No se pudo eliminar la materia",
        variant: "destructive",
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
      materia.notaRecuperatorioSegundoParcial
    ].filter(nota => nota !== undefined)
    
    if (notas.length === 0) return undefined
    return notas.reduce((sum, nota) => sum + nota, 0) / notas.length
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <AppLayout title='Materias en Curso'>
          <div className="container mx-auto p-6">
            <div className="text-center">Cargando materias en curso...</div>
          </div>
        </AppLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <AppLayout title='Materias en Curso'>
        <div className="container mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Materias en Curso</h1>
              <p className="text-gray-600">Gestiona las materias que estás cursando actualmente</p>
            </div>
            <Button onClick={() => setModalAgregarAbierto(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Agregar Materia
            </Button>
          </div>

          {/* Estadísticas */}
          {estadisticas && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    <p className="text-sm text-gray-600">Total Materias</p>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{estadisticas.totalMaterias}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-green-600" />
                    <p className="text-sm text-gray-600">1er Cuatrimestre</p>
                  </div>
                  <p className="text-2xl font-bold text-green-600">{estadisticas.materiasPrimero}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-orange-600" />
                    <p className="text-sm text-gray-600">2do Cuatrimestre</p>
                  </div>
                  <p className="text-2xl font-bold text-orange-600">{estadisticas.materiasSegundo}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="h-5 w-5 text-purple-600" />
                    <p className="text-sm text-gray-600">Promedio Parciales</p>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">
                    {formatearNota(estadisticas.promedioNotasParciales)}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Materias por Carrera */}
          {materiasPorCarrera.length === 0 ? (
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
                        key={`${materia.materiaId}-${materia.anioCursada}-${materia.cuatrimestreCursada}`}
                        className="border rounded-lg p-4 hover:bg-gray-50"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium">{materia.codigoMateria} - {materia.nombreMateria}</h3>
                            </div>
                            <p className="text-sm text-gray-600">
                              Cursando en {materia.anioCursada} - {materia.cuatrimestreCursada}° Cuatrimestre
                            </p>
                            <p className="text-xs text-gray-500">
                              Plan: {materia.anioEnPlan}° año, {materia.cuatrimestreEnPlan}° cuatrimestre - {materia.horasSemanales}hs semanales
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleEditarNotas(materia)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleEliminarMateria(materia)}
                            >
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
          )}
        </div>

        {/* Modales */}
        <AgregarMateriaEnCursoModal
          isOpen={modalAgregarAbierto}
          onClose={() => setModalAgregarAbierto(false)}
          usuarioId={user?.dbId || 0}
          onSuccess={() => {
            cargarMateriasEnCurso()
            toast({
              title: "Éxito",
              description: "Materia agregada correctamente",
            })
          }}
        />
        
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
              title: "Éxito",
              description: "Notas actualizadas correctamente",
            })
          }}
        />
      </AppLayout>
    </ProtectedRoute>
  )
}
