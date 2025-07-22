'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { useAnioAcademico } from '@/hooks/use-anio-academico'
import { Calendar, Edit } from 'lucide-react'

interface AnioAcademicoSelectorProps {
  usuarioId: number
  onAnioChanged?: () => void
}

export function AnioAcademicoSelector({ usuarioId, onAnioChanged }: AnioAcademicoSelectorProps) {
  const { toast } = useToast()
  const { anioAcademico, esNuevo, loading, establecerAnioAcademico, cambiarAnioAcademico } = useAnioAcademico(usuarioId)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [nuevoAnio, setNuevoAnio] = useState('')

  const anioActual = new Date().getFullYear()

  const handleCambiarAnio = async () => {
    const anio = parseInt(nuevoAnio)
    
    if (anio < anioActual - 1 || anio > anioActual) {
      toast({
        title: "Error",
        description: `El año académico debe estar entre ${anioActual - 1} y ${anioActual}`,
        variant: "destructive",
      })
      return
    }

    const exito = esNuevo 
      ? await establecerAnioAcademico(anio)
      : await cambiarAnioAcademico(anio)

    if (exito) {
      toast({
        title: "Éxito",
        description: esNuevo 
          ? "Año académico establecido correctamente"
          : "Año académico actualizado. Todas las materias en curso han sido movidas al nuevo año.",
      })
      setModalAbierto(false)
      setNuevoAnio('')
      onAnioChanged?.()
    } else {
      toast({
        title: "Error",
        description: "No se pudo actualizar el año académico",
        variant: "destructive",
      })
    }
  }

  const obtenerTextoBoton = () => {
    if (loading) return 'Guardando...'
    return esNuevo ? 'Establecer' : 'Cambiar'
  }

  const abrirModal = () => {
    setNuevoAnio(anioAcademico?.toString() || '')
    setModalAbierto(true)
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5" />
            Año Académico
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{loading ? '...' : (anioAcademico || '-')}</p>
              <p className="text-sm text-gray-600">
                {esNuevo ? 'Establecer año académico' : 'Año académico actual'}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={abrirModal}
              disabled={loading}
            >
              <Edit className="h-4 w-4 mr-2" />
              {esNuevo ? 'Establecer' : 'Cambiar'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {esNuevo ? 'Establecer Año Académico' : 'Cambiar Año Académico'}
            </DialogTitle>
            <DialogDescription>
              {esNuevo 
                ? 'Establece el año académico para tus materias en curso.'
                : 'Cambiar el año académico moverá todas tus materias en curso al nuevo año.'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="anio" className="text-right">
                Año *
              </Label>
              <Input
                id="anio"
                type="number"
                min={anioActual - 1}
                max={anioActual}
                value={nuevoAnio}
                onChange={(e) => setNuevoAnio(e.target.value)}
                className="col-span-3"
                placeholder={`Ej: ${anioActual}`}
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setModalAbierto(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleCambiarAnio}
              disabled={loading}
            >
              {obtenerTextoBoton()}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
