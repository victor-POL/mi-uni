import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import type { PlanEstudio } from '@/models/plan-estudio.model'

interface SelectorNuevoPlanProps {
  readonly planes: PlanEstudio[]
  readonly disabled?: boolean
  readonly msgPlaceHolder: string
  readonly value?: string
  onValueChange?: (value: string) => void
}

export const SelectorNuevoPlan = ({
  planes,
  disabled = false,
  msgPlaceHolder,
  value,
  onValueChange,
}: SelectorNuevoPlanProps) => {
  return (
    <>
      <Label htmlFor="nuevo-plan-select">Plan</Label>
      <Select disabled={disabled} onValueChange={onValueChange} value={value}>
        <SelectTrigger id="nuevo-plan-select">
          <SelectValue placeholder={msgPlaceHolder} />
        </SelectTrigger>
        <SelectContent>
          {planes.map((plan) => (
            <SelectItem key={plan.idPlan} value={plan.idPlan.toString()}>
              {plan.anio}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  )
}
