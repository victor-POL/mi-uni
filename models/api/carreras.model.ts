// Listado carreras
export interface CarreraAPIResponse {
  carrera_id: number
  carrera_nombre: string
}
export interface CarreraUsuarioDisponibleAPIResponse {
  carrera_id: number
  nombre_carrera: string
}

export interface CarreraUsuarioAPIResponse {
  usuario_id: number
  plan_estudio_id: number
  carrera_id: number
  anio: number
  carrera_nombre: string
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
}

/* ----------------------------- AGREGAR CARRERA ---------------------------- */
export interface BodyPostNuevaCarreraEnUsuario {
  usuario_id: number
  plan_estudio_id: number
}
