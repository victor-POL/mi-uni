export type EstadoMateriaPlanEstudio = "Pendiente" | "En Curso" | "En Final" | "Aprobada" | "Regularizada"

export interface MateriaPlanEstudio {
  idMateria: number
  codigoMateria: string
  nombreMateria: string
  anioCursada: number
  cuatrimestreCursada: number
  listaCorrelativas: string[] // Ahora usa codigoMateria
  horasSemanales: number
  estado: EstadoMateriaPlanEstudio // Nuevo campo para el estado de la materia
}

export interface DetalleMateria {
  codigoMateria: string
  nombreMateria: string
  descripcion: string
  objetivos: string[]
  contenido: string[]
  bibliografia: string[]
  horasSemanales: number
  creditos: number
  departamento: string
  carrera: string
}

export interface MateriaEnCurso {
  codigoMateria: string
  nombreMateria: string
  comision: string
  diasHorarios: string[]
  profesor: string
  aula: string
  fechaInicio: string
  fechaFin: string
}
