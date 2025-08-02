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

/* -------------------- ESTABLECER ANIO ACADEMICO USUARIO ------------------- */
export interface BodyPostEstablecerAnioAcademicoUsuario {
  usuario_id: number
}

export interface MateriaCursadaAPIResponse {
  usuario_id: number
  plan_estudio_id: number
  materia_id: number
  nota_primer_parcial: number | undefined
  nota_segundo_parcial: number | undefined
  nota_recuperatorio_primer_parcial: number | undefined
  nota_recuperatorio_segundo_parcial: number | undefined
  fecha_actualizacion: string
  codigo_materia: string
  nombre_materia: string
  tipo: 'cursable' | 'electiva'
  horas_semanales: number
  anio_en_plan: number
  cuatrimestre_en_plan: number
  carrera_nombre: string
  plan_anio: number
}

export interface MateriasPorCarreraCursadaAPIResponse {
  carrera_id: number
  carrera_nombre: string
  plan_estudio_id: number
  plan_anio: number
  materias: MateriaCursadaAPIResponse[]
}

export interface EstadisticasCursadaAPIResponse {
  total_materias: number
  materias_anual: number
  materias_primero: number
  materias_segundo: number
  promedio_notas_parciales: number
  materias_con_parciales: number
}

export interface MateriasEnCursoAPIResponse {
  materias_por_carrera: MateriasPorCarreraCursadaAPIResponse[]
  estadisticas_cursada: EstadisticasCursadaAPIResponse
}

export interface MateriaCursadaDisponibleAPIResponse {
  id: number
  codigo_materia: string
  nombre_materia: string
}