export interface AnioAcademicoUsuarioDB {
  anio_academico: number
  fecha_actualizacion: string
}

export interface AnioAcademicoVigenteDB {
  anio_academico: number
  fecha_inicio: string
  fecha_fin: string
}

export interface MateriaEnCursoUsuarioDB {
  usuario_id: number
  plan_estudio_id: number
  materia_id: number
  nota_primer_parcial: number
  nota_segundo_parcial: number
  nota_recuperatorio_primer_parcial: number
  nota_recuperatorio_segundo_parcial: number
  fecha_actualizacion: string
  codigo_materia: string
  nombre_materia: string
  tipo: string
  horas_semanales: number
  anio_en_plan: number
  cuatrimestre_en_plan: number
  carrera_id: number
  carrera_nombre: string
  plan_anio: number
}

export interface EstadisticasMateriasEnCursoDB {
  total_materias: number
  materias_anual: number
  materias_primero: number
  materias_segundo: number
  materias_con_parciales: number
  promedio_parciales: number
}

export interface MateriaCursadaDisponibleDB {
  id: number
  codigo_materia: string
  nombre_materia: string
  tipo: string
  horas_semanales: number
  anio_cursada: number
  cuatrimestre: number
}
