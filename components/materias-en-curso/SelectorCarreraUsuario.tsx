import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { CarreraResumen } from '@/models/mis-carreras.model'
import { Label } from '@/components/ui/label'

interface SelectorCarreraUsuarioProps {
  readonly carreras: CarreraResumen[]
  readonly disabled?: boolean
  readonly msgPlaceHolder: string
  readonly value?: string
  readonly onValueChange?: (value: string) => void
}

export const SelectorCarreraUsuario = ({
  carreras,
  disabled = false,
  msgPlaceHolder,
  value,
  onValueChange,
}: SelectorCarreraUsuarioProps) => {
  return (
    <>
      <Label htmlFor="materia-en-curso-carrera-select">Carrera</Label>
      <Select disabled={disabled} value={value} onValueChange={onValueChange}>
        <SelectTrigger id="materia-en-curso--carrera-select">
          <SelectValue placeholder={msgPlaceHolder} />
        </SelectTrigger>
        <SelectContent>
          {carreras.map((carrera) => (
            <SelectItem key={carrera.planEstudioId} value={carrera.planEstudioId.toString()}>
              {`${carrera.nombre} - Plan ${carrera.planEstudioAnio}`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  )
}
