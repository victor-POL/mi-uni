'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { PlanEstudio } from '@/models/planes-estudio.model'

interface SelectorPlanEstudioProps {
  readonly planes: PlanEstudio[]
  readonly disabled?: boolean
  readonly msgPlaceHolder: string
  readonly onSubmitPlan: (planId: string) => void
}

export function SelectorPlanEstudio({
  planes,
  disabled = false,
  msgPlaceHolder,
  onSubmitPlan,
}: SelectorPlanEstudioProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<string>('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedPlanId) {
      onSubmitPlan(selectedPlanId)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="mb-8 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Búsqueda</CardTitle>
          <CardDescription className="text-gray-600">
            Luego de consultar un plan, podrás filtrar las materias por año, cuatrimestreCursada, nombre, estado u
            horas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {/* Fila 1  - Label y Select*/}
            <div>
              <Label htmlFor="plan-select" className="block text-sm font-medium text-gray-700 mb-2">
                Plan de Estudio
              </Label>
              <Select disabled={disabled} value={selectedPlanId} onValueChange={setSelectedPlanId}>
                <SelectTrigger className="bg-white border-gray-300">
                  <SelectValue placeholder={msgPlaceHolder} />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300">
                  {planes?.map((plan) => (
                    <SelectItem key={plan.idPlan} value={plan.idPlan.toString()}>
                      {plan.nombreCarrera} ({plan.anio})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Fila 2 - Botones */}
            <div className="flex justify-end gap-2">
              <Button type="submit" disabled={disabled || !selectedPlanId} style={{ width: '150px' }}>
                Consultar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
