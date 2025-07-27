// Listado planes
export interface PlanEstudioAPIResponse {
  plan_id: number
  anio: number
  nombre_carrera: string
}

interface CorrelativaMateriaAPIResponse {
  codigo_materia: string
  nombre_materia: string
}

export interface DetalleMateriaAPIResponse {
  codigo_materia: string
  nombre_materia: string
  anio_cursada: number
  cuatrimestre_cursada: number
  horas_semanales: number
  tipo: string
  estado_materia_usuario: string | null
  lista_correlativas: CorrelativaMateriaAPIResponse[]
}

export interface EstadisticasPlanAPIResponse {
  total_materias: number
  horas_totales: number
  duracion_plan: number
  materias_sin_correlativas: number
}

export interface PlanEstudioDetalleAPIResponse {
  plan_id: number
  nombre_carrera: string
  anio: number
  estadisticas: EstadisticasPlanAPIResponse
  materias: DetalleMateriaAPIResponse[]
}
