'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'

interface MateriaDisponible {
  id: number
  codigo: string
  nombre: string
  tipo: string
  horasSemanales: number
  anioEnPlan: number
  cuatrimestreEnPlan: number
}

interface PlanUsuario {
  planEstudioId: number
  nombre: string
  planEstudioAnio: number
}

interface AgregarMateriaEnCursoModalProps {
  isOpen: boolean
  onClose: () => void
  usuarioId: number
  onSuccess: () => void
}

export function AgregarMateriaEnCursoModal({ 
  isOpen, 
  onClose, 
  usuarioId, 
  onSuccess 
}: AgregarMateriaEnCursoModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [loadingMaterias, setLoadingMaterias] = useState(false)
  
  const [planesUsuario, setPlanesUsuario] = useState<PlanUsuario[]>([])
  const [materiasDisponibles, setMateriasDisponibles] = useState<MateriaDisponible[]>([])
  
  const [formData, setFormData] = useState({
    planEstudioId: '',
    materiaId: '',
    anioCursada: new Date().getFullYear().toString(),
    cuatrimestreCursada: '1'
  })

  // Cargar planes del usuario al abrir el modal
  useEffect(() => {
    if (isOpen) {
      cargarPlanesUsuario()
    }
  }, [isOpen, usuarioId])

  // Cargar materias disponibles cuando se selecciona un plan
  useEffect(() => {
    if (formData.planEstudioId) {
      cargarMateriasDisponibles()
    } else {
      setMateriasDisponibles([])
      setFormData(prev => ({ ...prev, materiaId: '' }))
    }
  }, [formData.planEstudioId])

  const cargarPlanesUsuario = async () => {
    try {
      const response = await fetch(`/api/user/carreras/resumen?usuarioId=${usuarioId}`)
      
      if (!response.ok) throw new Error('Error cargando planes')
      
      const data = await response.json()
      setPlanesUsuario(data || [])
    } catch (error) {
      console.error('Error cargando planes:', error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los planes de estudio",
        variant: "destructive",
      })
    }
  }

  const cargarMateriasDisponibles = async () => {
    try {
      setLoadingMaterias(true)
      const response = await fetch(
        `/api/materias-en-curso/agregar?usuarioId=${usuarioId}&planEstudioId=${formData.planEstudioId}`
      )
      
      if (!response.ok) throw new Error('Error cargando materias')
      
      const data = await response.json()
      setMateriasDisponibles(data.materiasDisponibles)
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las materias disponibles",
        variant: "destructive",
      })
    } finally {
      setLoadingMaterias(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.planEstudioId || !formData.materiaId || !formData.anioCursada || !formData.cuatrimestreCursada) {
      toast({
        title: "Error",
        description: "Todos los campos son requeridos",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/materias-en-curso/agregar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuarioId,
          planEstudioId: parseInt(formData.planEstudioId),
          materiaId: parseInt(formData.materiaId),
          anioCursada: parseInt(formData.anioCursada),
          cuatrimestreCursada: parseInt(formData.cuatrimestreCursada)
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error agregando materia')
      }

      toast({
        title: "Éxito",
        description: "Materia agregada correctamente",
      })

      onSuccess()
      onClose()
      resetForm()
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo agregar la materia",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      planEstudioId: '',
      materiaId: '',
      anioCursada: new Date().getFullYear().toString(),
      cuatrimestreCursada: '1'
    })
    setMateriasDisponibles([])
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Agregar Materia en Curso</DialogTitle>
            <DialogDescription>
              Selecciona la materia que vas a cursar y especifica el año y cuatrimestre
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Plan de Estudio */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="plan" className="text-right">
                Plan de Estudio *
              </Label>
              <Select 
                value={formData.planEstudioId} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, planEstudioId: value }))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecciona un plan de estudio" />
                </SelectTrigger>
                <SelectContent>
                  {planesUsuario.map((plan) => (
                    <SelectItem key={plan.planEstudioId} value={plan.planEstudioId.toString()}>
                      {plan.nombre} - Plan {plan.planEstudioAnio}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Materia */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="materia" className="text-right">
                Materia *
              </Label>
              <Select 
                value={formData.materiaId} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, materiaId: value }))}
                disabled={!formData.planEstudioId || loadingMaterias}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={
                    (() => {
                      if (loadingMaterias) return "Cargando materias..."
                      if (!formData.planEstudioId) return "Selecciona primero un plan"
                      return "Selecciona una materia"
                    })()
                  } />
                </SelectTrigger>
                <SelectContent>
                  {materiasDisponibles.map((materia) => (
                    <SelectItem key={materia.id} value={materia.id.toString()}>
                      {materia.codigo} - {materia.nombre} ({materia.anioEnPlan}° año, {materia.cuatrimestreEnPlan}° cuatr.)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Año de Cursada */}
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
                onChange={(e) => setFormData(prev => ({ ...prev, anioCursada: e.target.value }))}
                className="col-span-3"
                placeholder="Ej: 2024"
              />
            </div>

            {/* Cuatrimestre de Cursada */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cuatrimestre" className="text-right">
                Cuatrimestre *
              </Label>
              <Select 
                value={formData.cuatrimestreCursada} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, cuatrimestreCursada: value }))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Anual</SelectItem>
                  <SelectItem value="1">1er Cuatrimestre</SelectItem>
                  <SelectItem value="2">2do Cuatrimestre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Agregando...' : 'Agregar Materia'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
