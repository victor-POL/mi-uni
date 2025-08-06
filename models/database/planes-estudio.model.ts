// Listado planes
export interface PlanEstudioDB {
  plan_id: number
  anio: number
  nombre_carrera: string
}

export interface MateriasPlanDB {
  plan_estudio_id: number
  materia_id: number
  anio_cursada: number
  cuatrimestre: number
  codigo_materia: string
  nombre_materia: string
  tipo: string
  horas_semanales: number
}

export interface CorrelativaMateriaDB {
  materia_id: number
  correlativas: {
    codigo_materia: string
    nombre_materia: string
  }
}

export interface EstadisticasPlanDB {
  plan_estudio_id: number
  total_materias: number
  horas_totales: number
  duracion_plan: number
  materias_sin_correlativas: number
}

export interface MateriaPlanEstudioDetalleDB {
  plan_estudio_id: number
  materia_id: number
  anio_cursada: number
  cuatrimestre: number
  codigo_materia: string
  nombre_materia: string
  tipo: string
  horas_semanales: number
  total_materias: number
  horas_totales: number
  duracion_plan: number
  materias_sin_correlativas: number
  estado_materia_usuario: string | null
  lista_correlativas: {
    codigo_materia: string
    nombre_materia: string
  }[]
}

export interface PlanEstudioDetalleDB {
  plan_id: number
  nombre_carrera: string
  anio: number
  estadisticas: EstadisticasPlanDB
  materias: MateriaPlanEstudioDetalleDB[]
}
