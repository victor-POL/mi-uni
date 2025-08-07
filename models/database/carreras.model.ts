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
  total_materias_plan: string
  materias_aprobadas: string
  materias_en_final: string
  materias_pendientes: string
  promedio_general: string
}

/* ----------------------------- AGREGAR CARRERA ---------------------------- */
export interface MateriaDelPlanDB {
  materia_id: number
}
