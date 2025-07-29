'use client'

/* ---------------------------------- HOOKS --------------------------------- */
import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { useCarrerasUsuario } from '@/hooks/use-carreras'
/* ----------------------------- COMPONENTES UI ----------------------------- */
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { DialogTrigger } from '@radix-ui/react-dialog'
import { NotebookPen, Plus } from 'lucide-react'
/* ------------------------------- COMPONENTES ------------------------------ */
import { SelectorCarreraUsuario } from '@/components/materias-en-curso/SelectorCarreraUsuario'
/* -------------------------------- CONTEXTS -------------------------------- */
import { useAuth } from '@/contexts/AuthContext'
import { SelectorMateriaCarrera } from '@/components/materias-en-curso/SelectorMateriaCarrera'
/* --------------------------------- MODELS --------------------------------- */
import type { Materia } from '@/models/materias.model'

interface AgregarMateriaEnCursoModalProps {
  usuarioId: number
}

export function AgregarMateriaEnCursoModal({ usuarioId }: Readonly<AgregarMateriaEnCursoModalProps>) {
  // Para consultar las carreras del usuario
  const { userId } = useAuth()

  const [materiasDisponibles, setMateriasDisponibles] = useState<Materia[]>([])

  const [selectedCarrera, setSelectedCarrera] = useState<string>('')
  const [selectedMateria, setSelectedMateria] = useState<string>('')

  const [isOpen, setIsOpen] = useState(false)
  const [isLoadingMaterias, setIsLoadingMaterias] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Lista de carreras del usuario
  const { carreras, loading: isLoadingCarreras } = useCarrerasUsuario({ userID: userId, autoFetch: isOpen })

  const { toast } = useToast()

  // Cargar materias disponibles cuando se selecciona un plan
  useEffect(() => {
    if (selectedCarrera) {
      cargarMateriasDisponibles()
      setSelectedMateria('')
    } else {
      setMateriasDisponibles([])
      setSelectedMateria('')
    }
  }, [selectedCarrera])

  const cargarMateriasDisponibles = async () => {
    setIsLoadingMaterias(true)
    try {
      const response = await fetch(
        `/api/materias-en-curso/agregar?usuarioId=${usuarioId}&planEstudioId=${selectedCarrera}`
      )

      if (!response.ok) throw new Error('Error cargando materias')

      const data = await response.json()

      const dataFormatted: Materia[] = data.materiasDisponibles.map((materia: any) => ({
        idMateria: materia.id,
        codigoMateria: materia.codigo,
        nombreMateria: materia.nombre,
      }))

      setMateriasDisponibles(dataFormatted)
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las materias disponibles',
        variant: 'destructive',
      })
    } finally {
      setIsLoadingMaterias(false)
    }
  }

  const handleSubmit = async () => {
    if (!selectedCarrera) {
      toast({
        title: 'Error',
        description: 'Por favor selecciona una carrera',
        variant: 'destructive',
      })
      return
    }

    if (!selectedMateria) {
      toast({
        title: 'Selección requerida',
        description: 'Por favor selecciona una materia',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/materias-en-curso/agregar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuarioId,
          planEstudioId: parseInt(selectedCarrera),
          materiaId: parseInt(selectedMateria),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error agregando materia')
      }

      toast({
        title: 'Éxito',
        description: 'Materia agregada correctamente',
      })

      // Reset form y cerrar modal
      setSelectedCarrera('')
      setSelectedMateria('')
      setMateriasDisponibles([])
      setIsOpen(false)
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'No se pudo agregar la materia',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSelectPlan = (planId: string) => {
    setSelectedCarrera(planId)
  }

  const handleSelectMateria = (materiaId: string) => {
    setSelectedMateria(materiaId)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Agregar Materia
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <NotebookPen className="h-5 w-5" />
            Agregar Materia en Curso
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Seleccion de Plan de Estudio */}
          <div className="space-y-2">
            {(() => {
              if (isLoadingCarreras) {
                return <SelectorCarreraUsuario carreras={[]} disabled msgPlaceHolder="Cargando carreras" />
              }

              if (carreras === null) {
                return <SelectorCarreraUsuario carreras={[]} disabled msgPlaceHolder="Error al obtener carreras" />
              }

              if (carreras.length === 0) {
                return <SelectorCarreraUsuario carreras={[]} disabled msgPlaceHolder="No hay carreras asociadas" />
              }

              return (
                <SelectorCarreraUsuario
                  carreras={carreras}
                  msgPlaceHolder="Seleccione una carrera"
                  onValueChange={handleSelectPlan}
                />
              )
            })()}
          </div>

          {/* Seleccion de Materia */}
          {selectedCarrera && (
            <div className="space-y-2">
              {(() => {
                if (isLoadingMaterias) {
                  return <SelectorMateriaCarrera materias={[]} disabled msgPlaceHolder="Cargando materias" />
                }

                if (materiasDisponibles === null) {
                  return <SelectorMateriaCarrera materias={[]} disabled msgPlaceHolder="Error al obtener materias" />
                }

                if (materiasDisponibles.length === 0) {
                  return <SelectorMateriaCarrera materias={[]} disabled msgPlaceHolder="No hay materias disponibles" />
                }

                return (
                  <SelectorMateriaCarrera
                    materias={materiasDisponibles}
                    msgPlaceHolder="Seleccione una materia"
                    onValueChange={handleSelectMateria}
                  />
                )
              })()}
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <DialogFooter>
          <Button type="button" variant="outline" disabled={isSubmitting} onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedMateria || !selectedCarrera || isSubmitting}>
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" />
                <span className="ml-2">Agregando...</span>
              </>
            ) : (
              'Agregar Materia'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
