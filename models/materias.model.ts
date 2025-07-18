export interface Materia {
  codigoMateria: string
  nombreMateria: string
}

export interface MateriaPlanEstudio extends Materia {
  tipo: 'cursable' | 'electiva'
  anioCursada: number
  cuatrimestreCursada: number
  horasSemanales: number
  listaCorrelativas: MateriaPlanEstudio['codigoMateria'][]
  opcionesElectivas?: MateriaPlanEstudio['codigoMateria'][]
}

export interface MateriaDetalle extends Materia {
  horasSemanales: MateriaPlanEstudio['horasSemanales']
  correlativas: MateriaPlanEstudio['listaCorrelativas']
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

export type CondicionCursadaMateriaEnCurso = 'Para promocion/regularizar' | 'Para regularizar'
export type ResultadoCursadaMateriaEnCurso = 'Promocionada' | 'Regularizada' | 'Desaprobada' | 'Ausente'

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

export type TipoNota = 'Por Promocion' | 'Por Final'

// export interface MateriaEnCurso2 {
//   idMateria: number
//   codigoMateria: string
//   nombreMateria: string
//   horasSemanales?: number
//   anioCursando: number
//   cuatrimestreCursando: number
//   estado: EstadoMateria
//   nota?: number
//   tipoNota?: TipoNota
//   anioAprobacion?: number
//   cuatrimestreAprobacion?: number
//   turnoExamen?: string
// }
