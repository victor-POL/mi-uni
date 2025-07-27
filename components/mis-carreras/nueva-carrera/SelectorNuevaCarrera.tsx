import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Carrera } from '@/models/mis-carreras.model'
import { Label } from '@/components/ui/label'

interface SelectorNuevaCarreraProps {
  readonly carreras: Carrera[]
  readonly disabled?: boolean
  readonly msgPlaceHolder: string
  readonly value?: string
  readonly onValueChange?: (value: string) => void
}

export const SelectorNuevaCarrera = ({
  carreras,
  disabled = false,
  msgPlaceHolder,
  value,
  onValueChange,
}: SelectorNuevaCarreraProps) => {
  return (
    <>
      <Label htmlFor="nueva-carrera-select">Carrera</Label>
      <Select disabled={disabled} value={value} onValueChange={onValueChange}>
        <SelectTrigger id="nueva-carrera-select">
          <SelectValue placeholder={msgPlaceHolder} />
        </SelectTrigger>
        <SelectContent>
          {carreras.map((carrera) => (
            <SelectItem key={carrera.idCarrera} value={carrera.idCarrera.toString()}>
              {carrera.nombreCarrera}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  )
}
