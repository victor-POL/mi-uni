import type { MateriaCursable, MateriaEnCurso, MateriaPlanEstudio } from '@/models/materias.model'

export interface PlanEstudio {
  idPlan: number
  nombreCarrera: string
  anio: number
}

export interface PlanDeEstudioDetalle extends PlanEstudio {
  materias: MateriaPlanEstudio[]
}

export interface PlanDeEstudioMateriasEnCurso extends PlanEstudio {
  materiasDisponibles: MateriaCursable[]
  materiasEnCurso: MateriaEnCurso[]
}

