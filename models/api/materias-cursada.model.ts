export interface AnioAcademicoUsuarioAPIResponse {
  anioAcademico: number | null
  fechaActualizacion: string | null
  esNuevo: boolean
}

export interface AnioAcademicoVigenteAPIResponse {
  anio_academico: number
  fecha_inicio: string
  fecha_fin: string
}