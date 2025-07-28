import type {
  AnioAcademicoUsuarioAPIResponse,
  AnioAcademicoVigenteAPIResponse,
} from '@/models/api/materias-cursada.model'
import type { AnioAcademicoUsuarioDB, AnioAcademicoVigenteDB } from '@/models/database/materias-cursada.model'
import type { AnioAcademicoVigente, UsuarioAnioAcademico } from '@/models/materias-cursada.model'

export const adaptAnioAcademicoUsuarioDBToAPIResponse = (
  anioAcademicoUsuarioDB: AnioAcademicoUsuarioDB | null
): AnioAcademicoUsuarioAPIResponse => {
  if (!anioAcademicoUsuarioDB) {
    return {
      anioAcademico: null,
      fechaActualizacion: null,
      esNuevo: true,
    }
  }

  return {
    anioAcademico: anioAcademicoUsuarioDB.anio_academico,
    fechaActualizacion: anioAcademicoUsuarioDB.fecha_actualizacion,
    esNuevo: false,
  }
}

export const adaptAnioAcademicoUsuarioAPIResponseToLocal = (
  anioAcademicoUsuarioAPIResponse: AnioAcademicoUsuarioAPIResponse
): UsuarioAnioAcademico => {
  return {
    anioAcademico: anioAcademicoUsuarioAPIResponse.anioAcademico,
    fechaActualizacion: anioAcademicoUsuarioAPIResponse.fechaActualizacion,
    esNuevo: anioAcademicoUsuarioAPIResponse.esNuevo,
  }
}

export const adaptAnioAcademicoVigenteDBToAPIResponse = (
  anioAcademicoVigenteDB: AnioAcademicoVigenteDB
): AnioAcademicoVigenteAPIResponse => {
  return {
    anio_academico: anioAcademicoVigenteDB.anio_academico,
    fecha_inicio: anioAcademicoVigenteDB.fecha_inicio,
    fecha_fin: anioAcademicoVigenteDB.fecha_fin,
  }
}

export const adaptAnioAcademicoVigenteAPIResponseToLocal = (
  anioAcademicoVigenteAPIResponse: AnioAcademicoVigenteAPIResponse
): AnioAcademicoVigente => {
  return {
    anioAcademico: anioAcademicoVigenteAPIResponse.anio_academico,
    fechaInicio: anioAcademicoVigenteAPIResponse.fecha_inicio,
    fechaFin: anioAcademicoVigenteAPIResponse.fecha_fin,
  }
}
