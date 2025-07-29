import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import type { Materia } from '@/models/materias.model'

interface SelectorMateriaCarreraProps {
  readonly materias: Materia[]
  readonly disabled?: boolean
  readonly msgPlaceHolder: string
  readonly value?: string
  readonly onValueChange?: (value: string) => void
}

export const SelectorMateriaCarrera = ({
  materias,
  disabled = false,
  msgPlaceHolder,
  value,
  onValueChange,
}: SelectorMateriaCarreraProps) => {
  return (
    <>
      <Label htmlFor="materia-en-curso--carrera-select">Materia</Label>
      <Select disabled={disabled} value={value} onValueChange={onValueChange}>
        <SelectTrigger id="materia-en-curso--carrera-select">
          <SelectValue placeholder={msgPlaceHolder} />
        </SelectTrigger>
        <SelectContent>
          {materias.map((materia) => (
            <SelectItem key={materia.idMateria} value={materia.idMateria.toString()}>
              {`${materia.codigoMateria} - ${materia.nombreMateria}`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  )
}
