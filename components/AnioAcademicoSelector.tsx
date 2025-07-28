'use client'

/* ---------------------------------- HOOKS --------------------------------- */
import { useState, useEffect } from 'react'
import { useAnioAcademicoVigente } from '@/hooks/use-anio-academico'
import { useToast } from '@/hooks/use-toast'
/* ----------------------------- COMPONENTES UI ----------------------------- */
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Edit } from 'lucide-react'
/* --------------------------------- UTILES --------------------------------- */
import { formatearFecha } from '@/lib/utils'
import { DialogTrigger } from '@radix-ui/react-dialog'

interface AnioAcademicoSelectorProps {
  readonly usuarioId: number
}

export function AnioAcademicoSelector({ usuarioId: _usuarioId }: AnioAcademicoSelectorProps) {
  // Control del modal
  const [isOpen, setIsOpen] = useState(false)

  // Anio académico vigente
  const { anioVigente, loading: loadingVigente } = useAnioAcademicoVigente({ autoFetch: isOpen })

  // Estado de envío del formulario para establecer el año académico
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { toast } = useToast()

  // Cerrar modal y notificar si no se pudo obtener el año académico vigente
  useEffect(() => {
    if (!loadingVigente && !anioVigente && isOpen) {
      toast({
        title: 'Error al obtener año académico',
        description: 'No se pudo obtener el año académico vigente. Por favor, intenta más tarde.',
        variant: 'destructive',
      })
      setIsOpen(false)
    }
  }, [loadingVigente, anioVigente, isOpen, toast])

  // Utiles modal
  const handleChangeModal = (open: boolean) => {
    setIsOpen(open)
    if (open) {
      // resetSelections()
    }
  }

  const handleOnClickCancelar = () => {
    setIsOpen(false)
  }

  // Lógica para establecer el año académico
  const handleSubmitEstablecerAnio = () => {
    if (!anioVigente?.anioAcademico) {
      toast({
        title: 'Anio academico requerido',
        description: 'Para poder establecer un año académico, primero debe haber uno vigente.',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)

    // simular timeout
    setTimeout(() => {
      setIsSubmitting(false)
      setIsOpen(false)

      toast({
        title: 'Año académico establecido',
        description: `El año académico ${anioVigente.anioAcademico} ha sido establecido correctamente.`,
      })
    }, 1000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleChangeModal}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-2" />
          Establecer
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Establecer Año Académico</DialogTitle>
          <DialogDescription>
            {loadingVigente ? 'Obteniendo año vigente...' : 'El año academico vigente es el siguiente:'}
          </DialogDescription>
        </DialogHeader>

        {loadingVigente && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Año</Label>
              <Skeleton className="h-10 col-span-3" />

              <Label className="text-right">Fecha Inicio</Label>
              <Skeleton className="h-10 col-span-3" />

              <Label className="text-right">Fecha Fin</Label>
              <Skeleton className="h-10 col-span-3" />
            </div>
          </div>
        )}

        {!loadingVigente && !anioVigente && (
          <div className="grid gap-4 py-4">
            <div className="text-center text-gray-500">
              <p>No se pudo obtener el año académico vigente.</p>
              <p className="text-sm mt-1">Contacta al administrador del sistema.</p>
            </div>
          </div>
        )}

        {!loadingVigente && anioVigente && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="anio-academico-vigente-anio" className="text-right">
                Año
              </Label>
              <Input
                id="anio-academico-vigente-anio"
                type="number"
                value={anioVigente.anioAcademico || ''}
                readOnly
                className="col-span-3"
              />
              <Label htmlFor="anio-academico-vigente-inicio" className="text-right">
                Fecha Inicio
              </Label>
              <Input
                id="anio-academico-vigente-inicio"
                type="text"
                value={anioVigente.fechaInicio ? formatearFecha(anioVigente.fechaInicio) || '' : ''}
                readOnly
                className="col-span-3"
              />
              <Label htmlFor="anio-academico-vigente-fin" className="text-right">
                Fecha Fin
              </Label>
              <Input
                id="anio-academico-vigente-fin"
                type="text"
                value={anioVigente.fechaFin ? formatearFecha(anioVigente.fechaFin) || '' : ''}
                readOnly
                className="col-span-3"
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" disabled={isSubmitting} onClick={handleOnClickCancelar}>
            Cancelar
          </Button>
          <Button onClick={handleSubmitEstablecerAnio} disabled={loadingVigente || !anioVigente?.anioAcademico || isSubmitting}>
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" />
                <span className="ml-2">Estableciendo...</span>
              </>
            ) : (
              'Establecer'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
