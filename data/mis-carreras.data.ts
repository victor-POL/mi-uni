import { CarreraResumen, MateriaEnCursoMisCarreras, MateriaHistorialAcademica } from "@/models/mis-carreras.model"

export const resumenesCarreras: CarreraResumen[] = [
  {
    id: 1,
    nombre: 'Ingeniería en Sistemas',
    progreso: 75,
    estado: 'En Curso',
    materiasAprobadas: 15,
    materiasTotal: 20,
    promedioGeneral: 8.5,
    añoIngreso: 2020,
    añoEstimadoEgreso: 2024,
  },
  {
    id: 2,
    nombre: 'Licenciatura en Administración',
    progreso: 60,
    estado: 'En Curso',
    materiasAprobadas: 12,
    materiasTotal: 20,
    promedioGeneral: 7.8,
    añoIngreso: 2021,
    añoEstimadoEgreso: 2025,
  },
]

export const materiasEnCursoPorCarrera: Record<number, MateriaEnCursoMisCarreras[]> = {
  1: [
    {
      codigo: 'SIS101',
      nombre: 'Programación I',
      profesor: 'Ing. Juan Pérez',  
      horario: 'Lunes y Miércoles 10:00-12:00',
      parcial1: 8.5,
      parcial2: 9.0,
      recuperatorio1: null,
      recuperatorio2: null,
      final: null,
    },
    {
      codigo: 'SIS102',
      nombre: 'Estructuras de Datos',
      profesor: 'Ing. Ana Gómez',
      horario: 'Martes y Jueves 14:00-16:00',
      parcial1: 7.0,
      parcial2: 6.5,
      recuperatorio1: 7.5,
      recuperatorio2: null,
      final: null,
    },
  ],
  2: [
    {
      codigo: 'ADM101',
      nombre: 'Introducción a la Administración',
      profesor: 'Lic. Laura Fernández',
      horario: 'Lunes y Miércoles 16:00-18:00',   
      parcial1: 9.0,
      parcial2: 8.5,
      recuperatorio1: null,
      recuperatorio2: null,
      final: null,
    },
    {
      codigo: 'ADM102',
      nombre: 'Contabilidad I',
      profesor: 'Lic. Carlos López',
      horario: 'Martes y Jueves 18:00-20:00',
      parcial1: 6.0,
      parcial2: 7.0,
      recuperatorio1: 7.5,
      recuperatorio2: null,
      final: null,
    },
  ],
}

export const historiaAcademicaPorCarrera: Record<number, MateriaHistorialAcademica[]> = {
  1: [
    {
      codigo: 'SIS101',
      nombre: 'Programación I',
      nota: 8.5,
      anioCursada: 2020,
      cuatrimestreCursada: 1,
      estado: 'Aprobada',
    },
    {
      codigo: 'SIS102',
      nombre: 'Estructuras de Datos',
      nota: 7.0,
      anioCursada: 2021,
      cuatrimestreCursada: 2,
      estado: 'Regularizada',
    },
    {
      codigo: 'SIS103',
      nombre: 'Bases de Datos',
      nota: 6.5,
      anioCursada: 2021,
      cuatrimestreCursada: 2,
      estado: 'Pendiente',
    },
    {
      codigo: 'SIS104',
      nombre: 'Redes de Computadoras',
      nota: 9.0,
      anioCursada: 2022,
      cuatrimestreCursada: 1,
      estado: 'Aprobada',
    }]
  ,
  2: [
    {
      codigo: 'ADM101',
      nombre: 'Introducción a la Administración',
      nota: 9.0,
      anioCursada: 2021,
      cuatrimestreCursada: 1,
      estado: 'En Curso',
    }]
  }
