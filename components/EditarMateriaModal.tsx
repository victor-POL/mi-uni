'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import type { MateriaHistoriaAcademica } from '@/models/carrera-detalle.model'

interface EditarMateriaModalProps {
  isOpen: boolean
  onClose: () => void
  materia: MateriaHistoriaAcademica | null
  usuarioId: number
  planEstudioId: number
  onSuccess: () => void
}

export function EditarMateriaModal({ 
  isOpen, 
  onClose, 
  materia, 
  usuarioId, 
  planEstudioId, 
  onSuccess 
}: EditarMateriaModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    estado: materia?.estado || 'Pendiente',
    nota: materia?.nota?.toString() || '',
    anioCursada: materia?.anioCursada?.toString() || '',
    cuatrimestreCursada: materia?.cuatrimestreCursada?.toString() || '1'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!materia) return

    // Validar formulario
    const validationError = validateForm()
    if (validationError) {
      toast({
        title: "Error de validación",
        description: validationError,
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const requestBody = {
        userId: usuarioId,
        planEstudioId,
        materiaId: materia.id,
        estado: formData.estado,
        nota: formData.nota ? parseFloat(formData.nota) : null,
        anioCursada: formData.anioCursada ? parseInt(formData.anioCursada) : null,
        cuatrimestreCursada: formData.cuatrimestreCursada ? parseInt(formData.cuatrimestreCursada) : null
      }


      const response = await fetch('/api/user/carreras/materias', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.error || `Error ${response.status}`)
      }

      toast({
        title: "Éxito",
        description: "Materia actualizada exitosamente",
      })

      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error completo:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo actualizar la materia",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value }
      
      // Si el estado cambia a 'Pendiente', limpiar los campos relacionados
      if (field === 'estado' && value === 'Pendiente') {
        newData.nota = ''
        newData.anioCursada = ''
        newData.cuatrimestreCursada = ''
      }
      
      return newData
    })
  }

  const validateForm = (): string | null => {
    const { estado, nota, anioCursada, cuatrimestreCursada } = formData
    
    // Si no es pendiente, requiere año y cuatrimestre
    if (estado !== 'Pendiente') {
      if (!anioCursada || !cuatrimestreCursada) {
        return 'Para estados diferentes a Pendiente se requiere año y cuatrimestre de cursada'
      }
    }
    
    // Validar nota según el estado
    if (nota) {
      const notaNumero = parseFloat(nota)
      
      if (estado === 'En Final') {
        if (notaNumero < 4 || notaNumero > 6) {
          return 'Para materias En Final la nota debe estar entre 4 y 6'
        }
      } else if (estado === 'Aprobada') {
        if (notaNumero < 4 || notaNumero > 10) {
          return 'Para materias Aprobadas la nota debe estar entre 4 y 10'
        }
      }
    } else {
      // Nota es requerida para estados Aprobada y En Final
      if (estado === 'Aprobada' || estado === 'En Final') {
        return `Para materias ${estado} se requiere una nota`
      }
    }
    
    return null
  }

  if (!materia) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Editar Materia</DialogTitle>
            <DialogDescription>
              {materia.codigo} - {materia.nombre}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="estado" className="text-right">
                Estado
              </Label>
              <Select value={formData.estado} onValueChange={(value) => handleInputChange('estado', value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                  <SelectItem value="En Final">En Final</SelectItem>
                  <SelectItem value="Aprobada">Aprobada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Solo mostrar los campos adicionales si NO es Pendiente */}
            {formData.estado !== 'Pendiente' && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nota" className="text-right">
                    Nota *
                  </Label>
                  <Input
                    id="nota"
                    type="number"
                    min="4"
                    max={formData.estado === 'En Final' ? "6" : "10"}
                    step="0.1"
                    value={formData.nota}
                    onChange={(e) => handleInputChange('nota', e.target.value)}
                    className="col-span-3"
                    placeholder={
                      formData.estado === 'En Final' 
                        ? "Entre 4 y 6" 
                        : "Entre 4 y 10"
                    }
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="anioCursada" className="text-right">
                    Año Cursada *
                  </Label>
                  <Input
                    id="anioCursada"
                    type="number"
                    min="2020"
                    max="2030"
                    value={formData.anioCursada}
                    onChange={(e) => handleInputChange('anioCursada', e.target.value)}
                    className="col-span-3"
                    placeholder="Ej: 2024"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="cuatrimestre" className="text-right">
                    Cuatrimestre *
                  </Label>
                  <Select 
                    value={formData.cuatrimestreCursada} 
                    onValueChange={(value) => handleInputChange('cuatrimestreCursada', value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Seleccionar cuatrimestre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Anual</SelectItem>
                      <SelectItem value="1">1er Cuatrimestre</SelectItem>
                      <SelectItem value="2">2do Cuatrimestre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
