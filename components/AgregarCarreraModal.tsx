'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { GraduationCap, Plus } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import type { Carrera } from '@/models/mis-carreras.model'
import type { PlanEstudio } from '@/models/plan-estudio.model'
import type { PlanEstudioAPIResponse } from '@/models/api/planes-estudio.model'
import { useAuth } from '@/contexts/AuthContext'
import { SelectorNuevoPlan } from '@/components/mis-carreras/nueva-carrera/SelectorNuevoPlanEstudio'
import { SelectorNuevaCarrera } from '@/components/mis-carreras/nueva-carrera/SelectorNuevaCarrera'

// Interfaces para las respuestas de la API
interface CarreraApiResponse {
  carrera_id: number
  nombre_carrera: string
}

export const AgregarCarreraModal = () => {
  const { userId } = useAuth()

  const [carrerasDisponibles, setCarrerasDisponibles] = useState<Carrera[]>([])
  const [planesCarrera, setPlanesCarrera] = useState<PlanEstudio[]>([])

  const [selectedCarrera, setSelectedCarrera] = useState<string>('')
  const [selectedPlan, setSelectedPlan] = useState<string>('')

  const [isOpen, setIsOpen] = useState(false)
  const [isLoadingCarreras, setIsLoadingCarreras] = useState(false)
  const [isLoadingPlanes, setIsLoadingPlanes] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { toast } = useToast()

  // Cargar carrerasDisponibles cuando se abre el modal
  useEffect(() => {
    if (isOpen && carrerasDisponibles.length === 0) {
      cargarCarreras()
    }
  }, [isOpen, carrerasDisponibles.length])

  // Cargar planesCarrera cuando cambia la carrera seleccionada
  useEffect(() => {
    if (selectedCarrera) {
      cargarPlanes(parseInt(selectedCarrera))
    } else {
      setPlanesCarrera([])
    }
  }, [selectedCarrera])

  const handleSelectCarrera = (carreraId: string) => {
    setSelectedPlan('')
    setSelectedCarrera(carreraId)
  }

  const cargarCarreras = async () => {
    setIsLoadingCarreras(true)
    try {
      const response = await fetch('/api/carreras')

      if (!response.ok) throw new Error('Error cargando carreras')

      const listadoCarrerasResponse: CarreraApiResponse[] = await response.json()

      const formattedCarreras: Carrera[] = listadoCarrerasResponse.map((carrera) => ({
        idCarrera: carrera.carrera_id,
        nombreCarrera: carrera.nombre_carrera,
      }))

      setCarrerasDisponibles(formattedCarreras)
    } catch (error) {
      let errorMessage = 'Error desconocido. Por favor, inténtalo más tarde.'

      if (error instanceof Error) {
        if (error.message.includes('fetch') || error.message.includes('network') || error.name === 'NetworkError') {
          errorMessage = 'Error de conexión. Verifica tu conexión a internet e inténtalo nuevamente.'
        } else if (error.message.includes('timeout') || error.name === 'TimeoutError') {
          errorMessage = 'La solicitud tardó demasiado tiempo. Por favor, inténtalo más tarde.'
        } else if (error.message.includes('500') || error.message.includes('server')) {
          errorMessage = 'Error del servidor. Por favor, inténtalo más tarde.'
        } else if (error.message.length > 0) {
          errorMessage = `Error: ${error.message}`
        }
      }

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsLoadingCarreras(false)
    }
  }

  const cargarPlanes = async (carreraId: number) => {
    setIsLoadingPlanes(true)
    try {
      const response = await fetch(`/api/carreras/${carreraId}/planes`)

      if (!response.ok) throw new Error('Error cargando planes de estudio')

      const data = await response.json()

      const listadoPlanesCarreraResponse: PlanEstudioAPIResponse[] = data

      const formattedPlanes: PlanEstudio[] = listadoPlanesCarreraResponse.map((plan) => ({
        idPlan: plan.plan_id,
        anio: plan.anio,
        nombreCarrera: plan.nombre_carrera,
      }))

      setPlanesCarrera(formattedPlanes)
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error cargando planes de estudio',
        variant: 'destructive',
      })
    } finally {
      setIsLoadingPlanes(false)
    }
  }

  const handleSubmit = async () => {
    if (!selectedPlan) {
      toast({
        title: 'Selección requerida',
        description: 'Por favor selecciona un plan de estudio',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/user/carreras', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          planEstudioId: parseInt(selectedPlan),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Error agregando carrera')
      }

      toast({
        title: '¡Éxito!',
        description: 'Carrera agregada correctamente',
      })

      // Reset form y cerrar modal
      setSelectedCarrera('')
      setSelectedPlan('')
      setCarrerasDisponibles([])
      setPlanesCarrera([])
      setIsOpen(false)
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'No se pudo agregar la carrera',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedCarreraData = carrerasDisponibles.find((carrera) => carrera.idCarrera.toString() === selectedCarrera)
  const selectedPlanData = planesCarrera.find((planEstudio) => planEstudio.idPlan.toString() === selectedPlan)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Agregar Carrera
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Agregar Nueva Carrera
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Selección de Carrera */}
          <div className="space-y-2">
            {(() => {
              if (isLoadingCarreras) return <SelectorNuevaCarrera carreras={[]} msgPlaceHolder="Cargando carreras..." />

              if (carrerasDisponibles.length > 0)
                return (
                  <SelectorNuevaCarrera
                    carreras={carrerasDisponibles}
                    msgPlaceHolder="Selecciona una carrera"
                    onValueChange={handleSelectCarrera}
                  />
                )

              return <SelectorNuevaCarrera carreras={[]} msgPlaceHolder="No se encontraron carreras" />
            })()}
          </div>

          {/* Selección de Plan de Estudio */}
          {selectedCarrera && (
            <div className="space-y-2">
              {(() => {
                if (isLoadingPlanes) return <SelectorNuevoPlan planes={[]} msgPlaceHolder="Cargando planes..." />

                if (planesCarrera.length > 0)
                  return (
                    <SelectorNuevoPlan
                      planes={planesCarrera}
                      msgPlaceHolder="Seleccione un plan de estudio"
                      onValueChange={setSelectedPlan}
                    />
                  )

                return (
                  <SelectorNuevoPlan
                    planes={[]}
                    msgPlaceHolder="No hay planes de estudio disponibles para esta carrera"
                  />
                )
              })()}
            </div>
          )}

          {/* Preview de la selección */}
          {selectedCarreraData && selectedPlanData && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resumen de Selección</CardTitle>
                <CardDescription>Confirma los datos antes de agregar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Carrera:</span>
                  <span>{selectedCarreraData.nombreCarrera}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Plan de Estudio:</span>
                  <span>Año {selectedPlanData.anio}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Botones de acción */}
          <DialogFooter>
            <Button type="button" variant="outline" disabled={isSubmitting} onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={!selectedPlan || isSubmitting}>
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Agregando...</span>
                </>
              ) : (
                'Agregar Carrera'
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
