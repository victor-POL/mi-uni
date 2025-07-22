'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { GraduationCap, Calendar, Plus } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Carrera {
  id: number
  nombre: string
  descripcion?: string
}

interface PlanEstudio {
  id: number
  anio: number
  carrera_id: number
}

interface AgregarCarreraModalProps {
  onCarreraAgregada: () => void
  usuarioId: number
}

export const AgregarCarreraModal = ({ onCarreraAgregada, usuarioId }: AgregarCarreraModalProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [carreras, setCarreras] = useState<Carrera[]>([])
  const [planes, setPlanes] = useState<PlanEstudio[]>([])
  const [selectedCarrera, setSelectedCarrera] = useState<string>('')
  const [selectedPlan, setSelectedPlan] = useState<string>('')
  const [isLoadingCarreras, setIsLoadingCarreras] = useState(false)
  const [isLoadingPlanes, setIsLoadingPlanes] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { toast } = useToast()

  // Cargar carreras cuando se abre el modal
  useEffect(() => {
    if (isOpen && carreras.length === 0) {
      cargarCarreras()
    }
  }, [isOpen, carreras.length])

  // Cargar planes cuando cambia la carrera seleccionada
  useEffect(() => {
    if (selectedCarrera) {
      cargarPlanes(parseInt(selectedCarrera))
      setSelectedPlan('') // Reset plan selection
    } else {
      setPlanes([])
      setSelectedPlan('')
    }
  }, [selectedCarrera])

  const cargarCarreras = async () => {
    setIsLoadingCarreras(true)
    try {
      const response = await fetch('/api/carreras')
      if (!response.ok) throw new Error('Error cargando carreras')
      
      const data = await response.json()
      setCarreras(data)
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las carreras disponibles",
        variant: "destructive",
      })
    } finally {
      setIsLoadingCarreras(false)
    }
  }

  const cargarPlanes = async (carreraId: number) => {
    setIsLoadingPlanes(true)
    try {
      const response = await fetch(`/api/carreras/${carreraId}/planes`)
      if (!response.ok) throw new Error('Error cargando planes')
      
      const data = await response.json()
      setPlanes(data)
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los planes de estudio",
        variant: "destructive",
      })
    } finally {
      setIsLoadingPlanes(false)
    }
  }

  const handleSubmit = async () => {
    if (!selectedPlan) {
      toast({
        title: "Selección requerida",
        description: "Por favor selecciona un plan de estudio",
        variant: "destructive",
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
          usuarioId,
          planEstudioId: parseInt(selectedPlan)
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Error agregando carrera')
      }

      toast({
        title: "¡Éxito!",
        description: "Carrera agregada correctamente",
      })

      // Reset form y cerrar modal
      setSelectedCarrera('')
      setSelectedPlan('')
      setPlanes([])
      setIsOpen(false)
      onCarreraAgregada()

    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo agregar la carrera",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedCarreraData = carreras.find(c => c.id.toString() === selectedCarrera)
  const selectedPlanData = planes.find(p => p.id.toString() === selectedPlan)

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
            <label htmlFor="carrera-select" className="text-sm font-medium">Carrera</label>
            {isLoadingCarreras ? (
              <div className="flex items-center justify-center py-4">
                <LoadingSpinner size="sm" text="Cargando carreras..." />
              </div>
            ) : (
              <Select value={selectedCarrera} onValueChange={setSelectedCarrera}>
                <SelectTrigger id="carrera-select">
                  <SelectValue placeholder="Selecciona una carrera" />
                </SelectTrigger>
                <SelectContent>
                  {carreras.map((carrera) => (
                    <SelectItem key={carrera.id} value={carrera.id.toString()}>
                      {carrera.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Selección de Plan de Estudio */}
          {selectedCarrera && (
            <div className="space-y-2">
              <label htmlFor="plan-select" className="text-sm font-medium">Plan de Estudio</label>
              {(() => {
                if (isLoadingPlanes) {
                  return (
                    <div className="flex items-center justify-center py-4">
                      <LoadingSpinner size="sm" text="Cargando planes..." />
                    </div>
                  )
                }
                
                if (planes.length > 0) {
                  return (
                    <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                      <SelectTrigger id="plan-select">
                        <SelectValue placeholder="Selecciona un plan de estudio" />
                      </SelectTrigger>
                      <SelectContent>
                        {planes.map((plan) => (
                          <SelectItem key={plan.id} value={plan.id.toString()}>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Plan {plan.anio}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )
                }
                
                return (
                  <div className="text-center py-4 text-gray-500">
                    No hay planes de estudio disponibles para esta carrera
                  </div>
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
                  <span>{selectedCarreraData.nombre}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Plan de Estudio:</span>
                  <span>Año {selectedPlanData.anio}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Botones de acción */}
          <div className="flex justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!selectedPlan || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Agregando...</span>
                </>
              ) : (
                'Agregar Carrera'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
