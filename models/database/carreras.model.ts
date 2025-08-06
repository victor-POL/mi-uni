// Listado carreras
export interface CarreraDB {
  carrera_id: number
  carrera_nombre: string
}

export interface CarreraUsuarioDB {
  usuario_id: number
  plan_estudio_id: number
  carrera_id: number
  anio: number
  carrera_nombre: string
}

export interface CarreraEstadisticasDB {
  plan_estudio_id: number
  total_materias_plan: number
  materias_aprobadas: number
  materias_en_final: number
  materias_pendientes: number
  promedio_general: number
}

export interface CarreraEstadisticaCursandoDB {
  materias_en_curso: number
}

/* ----------------------------- AGREGAR CARRERA ---------------------------- */
export interface MateriaDelPlanDB {
  materia_id: number
}
