// Modelos para los detalles de carrera

export interface MateriaEnCurso {
  id: number
  codigo: string
  nombre: string
  anio: number
  cuatrimestre: number
  anioCursada: number
  cuatrimestreCursada: number
  notaPrimerParcial?: number
  notaSegundoParcial?: number
  notaRecuperatorioPrimero?: number
  notaRecuperatorioSegundo?: number
  fechaActualizacion: Date
  horasSemanales: number
  tipo: 'cursable' | 'electiva'
}

export interface MateriaHistorial {
  id: number
  codigo: string
  nombre: string
  anio: number
  cuatrimestre: number
  nota?: number
  anioCursada?: number
  cuatrimestreCursada?: number
  estado: 'Aprobada' | 'Pendiente' | 'En Final'
  fechaActualizacion: Date
  horasSemanales: number
  tipo: 'cursable' | 'electiva'
}

export interface CarreraDetalle {
  id: number
  carreraId: number
  carreraNombre: string
  planEstudioId: number
  planEstudioAnio: number
  resumen: {
    totalMaterias: number
    materiasAprobadas: number
    materiasEnCurso: number
    porcentajeProgreso: number
    promedioGeneral?: number
    fechaInscripcion: Date
    fechaEstimadaGraduacion?: Date
  }
  materiasEnCurso: MateriaEnCurso[]
  historialAcademico: MateriaHistorial[]
}

export interface EstadisticasMateriasEnCurso {
  totalMaterias: number
  materiasPrimero: number
  materiasSegundo: number
  promedioNotasParciales?: number
  materiasConParciales: number
}

export interface EstadisticasHistorial {
  totalMaterias: number
  materiasAprobadas: number
  materiasEnFinal: number
  materiasPendientes: number
  promedioGeneral?: number
}
