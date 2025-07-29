'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import type { MateriaCursada } from '@/models/materias-cursada.model'

interface EditarNotasMateriaModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly materia: MateriaCursada | null
  readonly onSuccess: () => void
}

export function EditarNotasMateriaModal({ 
  isOpen, 
  onClose, 
  materia, 
  onSuccess 
}: EditarNotasMateriaModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    notaPrimerParcial: materia?.notaPrimerParcial?.toString() || '',
    notaSegundoParcial: materia?.notaSegundoParcial?.toString() || '',
    notaRecuperatorioPrimerParcial: materia?.notaRecuperatorioPrimerParcial?.toString() || '',
    notaRecuperatorioSegundoParcial: materia?.notaRecuperatorioSegundoParcial?.toString() || ''
  })

  // Actualizar form data cuando cambia la materia
  useEffect(() => {
    if (materia) {
      setFormData({
        notaPrimerParcial: materia.notaPrimerParcial?.toString() || '',
        notaSegundoParcial: materia.notaSegundoParcial?.toString() || '',
        notaRecuperatorioPrimerParcial: materia.notaRecuperatorioPrimerParcial?.toString() || '',
        notaRecuperatorioSegundoParcial: materia.notaRecuperatorioSegundoParcial?.toString() || ''
      })
    }
  }, [materia])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!materia) return

    // Validar que las notas estén en el rango válido (1-10)
    const notas = [
      formData.notaPrimerParcial,
      formData.notaSegundoParcial,
      formData.notaRecuperatorioPrimerParcial,
      formData.notaRecuperatorioSegundoParcial
    ].filter(nota => nota.trim() !== '')

    for (const nota of notas) {
      const notaNum = parseFloat(nota)
      if (Number.isNaN(notaNum) || notaNum < 1 || notaNum > 10) {
        toast({
          title: "Error",
          description: "Las notas deben estar entre 1 y 10",
          variant: "destructive",
        })
        return
      }
    }

    setLoading(true)
    try {
      const response = await fetch('/api/user/materias-en-curso/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuarioId: materia.usuarioId,
          planEstudioId: materia.planEstudioId,
          materiaId: materia.materiaId,
          notaPrimerParcial: formData.notaPrimerParcial ? parseFloat(formData.notaPrimerParcial) : null,
          notaSegundoParcial: formData.notaSegundoParcial ? parseFloat(formData.notaSegundoParcial) : null,
          notaRecuperatorioPrimerParcial: formData.notaRecuperatorioPrimerParcial ? parseFloat(formData.notaRecuperatorioPrimerParcial) : null,
          notaRecuperatorioSegundoParcial: formData.notaRecuperatorioSegundoParcial ? parseFloat(formData.notaRecuperatorioSegundoParcial) : null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error actualizando notas')
      }

      toast({
        title: "Éxito",
        description: "Notas actualizadas correctamente",
      })

      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudieron actualizar las notas",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const calcularPromedio = () => {
    const notas = [
      formData.notaPrimerParcial,
      formData.notaSegundoParcial,
      formData.notaRecuperatorioPrimerParcial,
      formData.notaRecuperatorioSegundoParcial
    ].filter(nota => nota.trim() !== '').map(nota => parseFloat(nota))

    if (notas.length === 0) return null
    
    // Para calcular promedio, usar recuperatorio si existe, sino el parcial original
    let nota1: number | null = null
    if (formData.notaRecuperatorioPrimerParcial) {
      nota1 = parseFloat(formData.notaRecuperatorioPrimerParcial)
    } else if (formData.notaPrimerParcial) {
      nota1 = parseFloat(formData.notaPrimerParcial)
    }

    let nota2: number | null = null
    if (formData.notaRecuperatorioSegundoParcial) {
      nota2 = parseFloat(formData.notaRecuperatorioSegundoParcial)
    } else if (formData.notaSegundoParcial) {
      nota2 = parseFloat(formData.notaSegundoParcial)
    }

    if (nota1 !== null && nota2 !== null) {
      return ((nota1 + nota2) / 2).toFixed(2)
    }

    return null
  }

  const promedio = calcularPromedio()

  if (!materia) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Editar Notas</DialogTitle>
            <DialogDescription>
              {materia.codigoMateria} - {materia.nombreMateria}
              <br />
              {materia.carreraNombre} ({materia.planAnio})
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Primer Parcial */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nota1" className="text-right">
                Primer Parcial
              </Label>
              <Input
                id="nota1"
                type="number"
                step="0.1"
                min="1"
                max="10"
                value={formData.notaPrimerParcial}
                onChange={(e) => setFormData(prev => ({ ...prev, notaPrimerParcial: e.target.value }))}
                className="col-span-3"
                placeholder="Ej: 7.5"
              />
            </div>

            {/* Segundo Parcial */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nota2" className="text-right">
                Segundo Parcial
              </Label>
              <Input
                id="nota2"
                type="number"
                step="0.1"
                min="1"
                max="10"
                value={formData.notaSegundoParcial}
                onChange={(e) => setFormData(prev => ({ ...prev, notaSegundoParcial: e.target.value }))}
                className="col-span-3"
                placeholder="Ej: 8.0"
              />
            </div>

            {/* Recuperatorio Primer Parcial */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="recup1" className="text-right text-sm">
                Recup. 1er Parcial
              </Label>
              <Input
                id="recup1"
                type="number"
                step="0.1"
                min="1"
                max="10"
                value={formData.notaRecuperatorioPrimerParcial}
                onChange={(e) => setFormData(prev => ({ ...prev, notaRecuperatorioPrimerParcial: e.target.value }))}
                className="col-span-3"
                placeholder="Solo si recuperó"
              />
            </div>

            {/* Recuperatorio Segundo Parcial */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="recup2" className="text-right text-sm">
                Recup. 2do Parcial
              </Label>
              <Input
                id="recup2"
                type="number"
                step="0.1"
                min="1"
                max="10"
                value={formData.notaRecuperatorioSegundoParcial}
                onChange={(e) => setFormData(prev => ({ ...prev, notaRecuperatorioSegundoParcial: e.target.value }))}
                className="col-span-3"
                placeholder="Solo si recuperó"
              />
            </div>

            {/* Promedio calculado */}
            {promedio && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-sm">
                  <p><strong>Promedio actual:</strong> {promedio}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    * Se considera la nota de recuperatorio si existe, sino la del parcial original
                  </p>
                </div>
              </div>
            )}

            {/* Ayuda */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-600">
                <p><strong>Ayuda:</strong></p>
                <p>• Las notas deben estar entre 1 y 10</p>
                <p>• Puedes dejar campos vacíos si aún no tienes esas notas</p>
                <p>• Los recuperatorios reemplazan a los parciales originales en el cálculo</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Notas'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
