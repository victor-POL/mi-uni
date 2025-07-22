'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import type { MateriaHistorial } from '@/models/carrera-detalle.model'

interface EditarMateriaModalProps {
  isOpen: boolean
  onClose: () => void
  materia: MateriaHistorial | null
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

    setLoading(true)
    try {
      const requestBody = {
        usuarioId,
        planEstudioId,
        materiaId: materia.id,
        estado: formData.estado,
        nota: formData.nota ? parseFloat(formData.nota) : null,
        anioCursada: formData.anioCursada ? parseInt(formData.anioCursada) : null,
        cuatrimestreCursada: formData.cuatrimestreCursada ? parseInt(formData.cuatrimestreCursada) : null
      }

      console.log('Enviando datos:', requestBody)

      const response = await fetch('/api/materias/actualizar-estado', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const responseData = await response.json()
      console.log('Respuesta del servidor:', responseData)

      if (!response.ok) {
        throw new Error(responseData.error || `Error ${response.status}`)
      }

      toast({
        title: "Éxito",
        description: "Materia actualizada correctamente",
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
    setFormData(prev => ({ ...prev, [field]: value }))
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

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nota" className="text-right">
                Nota
              </Label>
              <Input
                id="nota"
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={formData.nota}
                onChange={(e) => handleInputChange('nota', e.target.value)}
                className="col-span-3"
                placeholder="Ej: 7.5"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="anioCursada" className="text-right">
                Año Cursada
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
                Cuatrimestre
              </Label>
              <Select 
                value={formData.cuatrimestreCursada} 
                onValueChange={(value) => handleInputChange('cuatrimestreCursada', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1er Cuatrimestre</SelectItem>
                  <SelectItem value="2">2do Cuatrimestre</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
