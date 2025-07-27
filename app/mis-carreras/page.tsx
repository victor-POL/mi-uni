'use client'

/* ---------------------------------- HOOKS --------------------------------- */
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useCarrerasUsuario } from '@/hooks/use-carreras'
import { useToast } from '@/hooks/use-toast'
/* ------------------------------ COMPONENTS ----------------------------- */
import { CarreraDetalle } from '@/components/CarreraDetalle'
import { DetalleSkeleton } from '@/components/mis-carreras/SkeletonDetalleCarrera'
import { MisCarrerasLayout } from '@/components/mis-carreras/MisCarrerasLayout'
import { AgregarCarreraModal } from '@/components/AgregarCarreraModal'
/* ------------------------------ COMPONENTS UI ----------------------------- */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
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
import { Trash2 } from 'lucide-react'
/* --------------------------------- MODELS --------------------------------- */
import type { CarreraResumen } from '@/models/mis-carreras.model'
/* -------------------------------- ADAPTERS -------------------------------- */

export default function MisCarrerasPage() {
  // Para consultar las carreras del usuario
  const { userId } = useAuth()

  // Lista de carreras del usuario
  const { carreras, loading: isLoadingCarreras, refetch: refetchCarreras } = useCarrerasUsuario({ userID: userId })

  // Detalle de carrera consultada
  const [detalleCarreraConsultada, setDetalleCarreraConsultada] = useState<CarreraResumen | null>(null)
  const [isLoadingDetalleCarrera, setIsLoadingDetalleCarrera] = useState(false)

  // Estado para eliminación de carreras
  const [carreraEliminandose, setCarreraEliminandose] = useState<number | null>(null)
  const [carreraAEliminar, setCarreraAEliminar] = useState<CarreraResumen | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const { toast } = useToast()

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

  // Handler para mostrar confirmación de eliminar carrera
  const handleMostrarConfirmacionEliminar = (carrera: CarreraResumen, event: React.MouseEvent) => {
    event.stopPropagation() // Evitar que se active el onClick del Card
    setCarreraAEliminar(carrera)
    setShowDeleteDialog(true)
  }

  // Handler para eliminar carrera (confirmado)
  const handleEliminarCarrera = async () => {
    if (!carreraAEliminar) return

    setCarreraEliminandose(carreraAEliminar.planEstudioId)
    setShowDeleteDialog(false)
    
    try {
      const response = await fetch(`/api/user/carreras/${carreraAEliminar.planEstudioId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Error eliminando carrera')
      }

      toast({
        title: '¡Éxito!',
        description: 'Carrera eliminada correctamente',
      })

      // Si la carrera eliminada era la que estaba seleccionada, limpiar detalle
      if (detalleCarreraConsultada?.planEstudioId === carreraAEliminar.planEstudioId) {
        setDetalleCarreraConsultada(null)
      }

      // Refrescar la lista de carreras
      await refetchCarreras()
      
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'No se pudo eliminar la carrera',
        variant: 'destructive',
      })
    } finally {
      setCarreraEliminandose(null)
      setCarreraAEliminar(null)
    }
  }

  // Handler para cancelar eliminación
  const handleCancelarEliminacion = () => {
    setShowDeleteDialog(false)
    setCarreraAEliminar(null)
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

  if (carreras.length === 0) return (
    <MisCarrerasLayout emptyCarreras>
      <AgregarCarreraModal onCarreraAgregada={refetchCarreras} />
    </MisCarrerasLayout>
  )

  return (
    <MisCarrerasLayout>
      {/* Boton para abrir modal y agregar carreras */}
      <AgregarCarreraModal onCarreraAgregada={refetchCarreras} />

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
                <div className="flex items-center gap-2">
                  <Badge className={getEstadoBadgeColor(carrera.estado)}>{carrera.estado}</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                    onClick={(e) => handleMostrarConfirmacionEliminar(carrera, e)}
                    disabled={carreraEliminandose === carrera.planEstudioId}
                  >
                    {carreraEliminandose === carrera.planEstudioId ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
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

      {/* Diálogo de confirmación para eliminar carrera */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente la carrera "{carreraAEliminar?.nombre}" de tu perfil.
              Se perderán todos los datos asociados a esta carrera, incluyendo el progreso y las materias cursadas.
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelarEliminacion}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleEliminarCarrera}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {carreraEliminandose === carreraAEliminar?.planEstudioId ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Eliminando...
                </>
              ) : (
                'Eliminar Carrera'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MisCarrerasLayout>
  )
}
