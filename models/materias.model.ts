export interface Materia {
  codigoMateria: string
  nombreMateria: string
}

export type EstadoMateriaPlanEstudio = "Aprobada" | "Regularizada" | "Pendiente" | "En Curso" | "En Final"

export interface MateriaPlanEstudio extends Materia {
  tipo: "cursable" | "electiva"
  anioCursada: number
  cuatrimestreCursada: number
  horasSemanales: number
  listaCorrelativas: MateriaPlanEstudio["codigoMateria"][]
  opcionesElectivas?: MateriaPlanEstudio["codigoMateria"][]
  estado: EstadoMateriaPlanEstudio
}

export interface MateriaDetalle extends Materia {
  horasSemanales: MateriaPlanEstudio["horasSemanales"]
  correlativas: MateriaPlanEstudio["listaCorrelativas"]
  descripcion: string
  objetivos: string[]
  linksUtiles: {
    titulo: string
    url: string
  }[]
  bibliografia: string[]
  profesores: string[]
  horarios: string
}

export type CondicionCursadaMateriaEnCurso = "Para promocion/regularizar" | "Para regularizar"
export type ResultadoCursadaMateriaEnCurso = "Promocionada" | "Regularizada" | "Desaprobada" | "Ausente"

export interface MateriaCursable extends Materia {
  horasSemanales: number
  condicionCursada: CondicionCursadaMateriaEnCurso
}

export interface MateriaEnCurso extends Materia {
  anioCursando: number
  cuatrimestreCursando: number
  condicionCursada: CondicionCursadaMateriaEnCurso
  horasSemanales: number
}

export type TipoNota = "Por Promocion" | "Por Final"
