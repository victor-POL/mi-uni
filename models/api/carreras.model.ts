export interface CarreraUsuarioAPIResponse {
  usuario_id: number
  plan_estudio_id: number
  carrera_id: number
  anio: number
  carrera_nombre: string
}

export interface CarreraEstadisticasAPIResponse {
  plan_estudio_id: number
  total_materias: number
  materias_aprobadas: number
  materias_en_curso: number
  materias_en_final: number
  materias_pendientes: number
  promedio_general: number | null
  porcentaje_progreso: number
}

export interface CarreraUsuarioConEstadisticasAPIResponse {
  plan_estudio_id: number
  plan_estudio_anio: number
  nombre_carrera: string
  estado: 'Completada' | 'En Curso'
  progreso: number
  materias_aprobadas: number
  materias_total: number
  promedio_general: number
  anio_ingreso: number
  anio_estimado_ingreso: number
}
