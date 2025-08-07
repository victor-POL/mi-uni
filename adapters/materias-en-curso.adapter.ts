import type {
  AnioAcademicoUsuarioDB,
  AnioAcademicoVigenteDB,
  EstadisticasMateriasEnCursoDB,
  MateriaCursadaDisponibleDB,
  MateriaEnCursoUsuarioDB,
} from '@/models/database/materias-en-curso.model'

import type {
  AnioAcademicoUsuarioAPIResponse,
  AnioAcademicoVigenteAPIResponse,
  EstadisticasCursadaAPIResponse,
  MateriaCursadaAPIResponse,
  MateriaCursadaDisponibleAPIResponse,
  MateriasPorCarreraCursadaAPIResponse,
} from '@/models/api/materias-en-curso.model'

import type {
  AnioAcademicoVigente,
  EstadisticasMateriasEnCurso,
  MateriaCursadaPorCarrera,
  UsuarioAnioAcademico,
} from '@/models/materias-en-curso.model'

import type { Materia } from '@/models/materias.model'

/* ---------- PAGE MATERIAS EN CURSO - INICIO AÑO ACADEMICO USUARIO --------- */
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

/* -------- PAGE MATERIAS EN CURSO - ESTABLECER AÑO ACADEMICO USUARIO ------- */
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

/* ------------- PAGE MATERIAS EN CURSO - ESTADISTICAS MATERIAS ------------- */
export const adaptEstadisticasMateriasEnCursoDBToAPIResponse = (
  estadisticasDB: EstadisticasMateriasEnCursoDB
): EstadisticasCursadaAPIResponse => {
  return {
    total_materias: estadisticasDB.total_materias,
    materias_anual: estadisticasDB.materias_anual,
    materias_primero: estadisticasDB.materias_primero,
    materias_segundo: estadisticasDB.materias_segundo,
    promedio_notas_parciales: estadisticasDB.promedio_parciales,
    materias_con_parciales: estadisticasDB.materias_con_parciales,
  }
}

export const adaptEstadisticasMateriasEnCursoAPIResponseToLocal = (
  estadisticasAPIResponse: EstadisticasCursadaAPIResponse
): EstadisticasMateriasEnCurso => {
  return {
    totalMaterias: estadisticasAPIResponse.total_materias,
    materiasAnual: estadisticasAPIResponse.materias_anual,
    materiasPrimero: estadisticasAPIResponse.materias_primero,
    materiasSegundo: estadisticasAPIResponse.materias_segundo,
    promedioNotasParciales: estadisticasAPIResponse.promedio_notas_parciales,
    materiasConParciales: estadisticasAPIResponse.materias_con_parciales,
  }
}

/* -------------- PAGE MATERIAS EN CURSO - MATERIAS POR CARRERA ------------- */
export const adaptMateriasPorCarreraCursadaDBToAPIResponse = (
  materiasEnCurso: MateriaEnCursoUsuarioDB[]
): MateriasPorCarreraCursadaAPIResponse[] => {
  // Agrupar por carrera
  const materiasPorCarrera = new Map<string, MateriasPorCarreraCursadaAPIResponse>()

  materiasEnCurso.forEach((materiaEnCurso) => {
    const carreraKey = `${materiaEnCurso.carrera_id}-${materiaEnCurso.plan_estudio_id}`

    if (!materiasPorCarrera.has(carreraKey)) {
      materiasPorCarrera.set(carreraKey, {
        carrera_id: materiaEnCurso.carrera_id,
        carrera_nombre: materiaEnCurso.carrera_nombre,
        plan_estudio_id: materiaEnCurso.plan_estudio_id,
        plan_anio: materiaEnCurso.plan_anio,
        materias: [],
      })
    }

    const materia: MateriaCursadaAPIResponse = {
      usuario_id: materiaEnCurso.usuario_id,
      plan_estudio_id: materiaEnCurso.plan_estudio_id,
      materia_id: materiaEnCurso.materia_id,
      nota_primer_parcial: materiaEnCurso.nota_primer_parcial ? materiaEnCurso.nota_primer_parcial : undefined,
      nota_segundo_parcial: materiaEnCurso.nota_segundo_parcial ? materiaEnCurso.nota_segundo_parcial : undefined,
      nota_recuperatorio_primer_parcial: materiaEnCurso.nota_recuperatorio_primer_parcial
        ? materiaEnCurso.nota_recuperatorio_primer_parcial
        : undefined,
      nota_recuperatorio_segundo_parcial: materiaEnCurso.nota_recuperatorio_segundo_parcial
        ? materiaEnCurso.nota_recuperatorio_segundo_parcial
        : undefined,
      fecha_actualizacion: materiaEnCurso.fecha_actualizacion,
      codigo_materia: materiaEnCurso.codigo_materia,
      nombre_materia: materiaEnCurso.nombre_materia,
      tipo: materiaEnCurso.tipo as 'cursable' | 'electiva',
      horas_semanales: materiaEnCurso.horas_semanales,
      anio_en_plan: materiaEnCurso.anio_en_plan,
      cuatrimestre_en_plan: materiaEnCurso.cuatrimestre_en_plan,
      carrera_nombre: materiaEnCurso.carrera_nombre,
      plan_anio: materiaEnCurso.plan_anio,
    }

    const carreraData = materiasPorCarrera.get(carreraKey)
    if (carreraData) {
      carreraData.materias.push(materia)
    }
  })

  return Array.from(materiasPorCarrera.values())
}

export const adaptMateriasPorCarreraCursadaAPIResponseToLocal = (
  materiasPorCarreraCursadaAPIResponse: MateriasPorCarreraCursadaAPIResponse[]
): MateriaCursadaPorCarrera[] => {
  return materiasPorCarreraCursadaAPIResponse.map((materiaPorCarrera) => ({
    carreraId: materiaPorCarrera.carrera_id,
    carreraNombre: materiaPorCarrera.carrera_nombre,
    planEstudioId: materiaPorCarrera.plan_estudio_id,
    planAnio: materiaPorCarrera.plan_anio,
    materias: materiaPorCarrera.materias.map((materia) => ({
      usuarioId: materia.usuario_id,
      planEstudioId: materia.plan_estudio_id,
      materiaId: materia.materia_id,
      notaPrimerParcial: materia.nota_primer_parcial,
      notaSegundoParcial: materia.nota_segundo_parcial,
      notaRecuperatorioPrimerParcial: materia.nota_recuperatorio_primer_parcial,
      notaRecuperatorioSegundoParcial: materia.nota_recuperatorio_segundo_parcial,
      fechaActualizacion: new Date(materia.fecha_actualizacion),
      codigoMateria: materia.codigo_materia,
      nombreMateria: materia.nombre_materia,
      tipo: materia.tipo,
      horasSemanales: materia.horas_semanales,
      anioEnPlan: materia.anio_en_plan,
      cuatrimestreEnPlan: materia.cuatrimestre_en_plan,
      carreraNombre: materia.carrera_nombre,
      planAnio: materia.plan_anio,
    })),
  }))
}

/* ------------ PAGE MATERIAS EN CURSO - AGREGAR MATERIA EN CURSO ----------- */
export const adaptMateriaCursadaDisponibleDBToAPIResponse = (
  materiaCursadaDisponibleDB: MateriaCursadaDisponibleDB[]
): MateriaCursadaDisponibleAPIResponse[] => {
  return materiaCursadaDisponibleDB.map((materia) => ({
    id: materia.id,
    codigo_materia: materia.codigo_materia,
    nombre_materia: materia.nombre_materia,
    tipo: materia.tipo as 'cursable' | 'electiva',
    horas_semanales: materia.horas_semanales,
    anio_cursada: materia.anio_cursada,
    cuatrimestre: materia.cuatrimestre,
  }))
}

export const adaptMateriaCursadaDisponibleAPIResponseToLocal = (
  materiaCursadaDisponibleAPIResponse: MateriaCursadaDisponibleAPIResponse[]
): Materia[] => {
  return materiaCursadaDisponibleAPIResponse.map((materia) => ({
    idMateria: materia.id,
    codigoMateria: materia.codigo_materia,
    nombreMateria: materia.nombre_materia,
  }))
}
