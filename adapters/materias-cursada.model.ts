import type { AnioAcademicoUsuarioAPIResponse } from '@/models/api/materias-cursada.model'
import type { AnioAcademicoUsuarioDB } from '@/models/database/materias-cursada.model'
import type { UsuarioAnioAcademico } from '@/models/materias-cursada.model'

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
