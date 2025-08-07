import type { EstadoMateriaPlanEstudio } from '@/models/materias.model'

export interface Carrera {
  idCarrera: number
  nombreCarrera: string
}

export interface CarreraResumen {
  nombre: string
  progreso: number
  estado: string
  materiasAprobadas: number
  materiasTotal: number
  promedioGeneral: number
  planEstudioId: number
  planEstudioAnio: number
}

export interface MateriaHistorialAcademica {
  codigo: string
  nombre: string
  nota: number
  anioCursada: number
  cuatrimestreCursada: number
  estado: EstadoMateriaPlanEstudio
}

export interface MateriaEnCursoMisCarreras {
  codigo: string
  nombre: string
  profesor: string
  horario: string
  parcial1: number | null
  parcial2: number | null
  recuperatorio1: number | null
  recuperatorio2: number | null
  final: number | null
}
