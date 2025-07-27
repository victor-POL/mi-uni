import type { MateriaCursable, MateriaEnCurso, MateriaPlanEstudio } from '@/models/materias.model'

export interface PlanEstudio {
  idPlan: number
  nombreCarrera: string
  anio: number
}

export interface EstadisticasPlan {
  totalMaterias: number
  horasTotales: number
  duracion: number
  materiasSinCorrelativas: number
}

export interface PlanDeEstudioDetalle extends PlanEstudio {
  estadisticas: EstadisticasPlan
  materias: MateriaPlanEstudio[]
}

export interface PlanDeEstudioMateriasEnCurso extends PlanEstudio {
  materiasDisponibles: MateriaCursable[]
  materiasEnCurso: MateriaEnCurso[]
}

export interface EstadisticasPlanEstudio {
  planEstudioId: number
  totalMaterias: number
  horasTotales: number
  duracion: number
  materiasSinCorrelativas: number
}
