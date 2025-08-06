import type { Materia, MateriaDetalle } from '@/models/materias.model'
import { planesDeEstudio } from './planes-estudio.data'

const plan = planesDeEstudio.find((p) => p.idPlan === 1) // Ingeniería en Sistemas :contentReference[oaicite:0]{index=0}

export const materiasDetalle: MateriaDetalle[] = plan
  ? plan.materias.map(
      (m): MateriaDetalle => ({
        codigoMateria: m.codigoMateria,
        nombreMateria: m.nombreMateria,
        horasSemanales: m.horasSemanales,
        correlativas: m.listaCorrelativas as unknown as Materia[],
        descripcion: `Esta materia aborda los conceptos fundamentales de ${m.nombreMateria.toLowerCase()} y su aplicación práctica.`,
        objetivos: [
          `Comprender los principios básicos de ${m.nombreMateria.toLowerCase()}.`,
          `Resolver ejercicios aplicando técnicas de ${m.nombreMateria.toLowerCase()}.`,
          `Analizar casos de estudio reales relacionados con ${m.nombreMateria.toLowerCase()}.`,
        ],
        linksUtiles: [
          { titulo: 'Guía de estudio UNLaM', url: 'https://unlam.edu.ar/planes-de-estudio' },
          { titulo: `${m.nombreMateria} (Wiki)`, url: `https://wiki.unlam.edu.ar/${m.codigoMateria}` },
        ],
        bibliografia: [
          'Autor A. Título del Libro. Editorial X, 20XX.',
          'Autor B. Segundo Texto de Referencia. Editorial Y, 20YY.',
        ],
        profesores: ['Dra. María Pérez', 'Dr. Juan Gómez'],
        horarios: 'Lunes 08:00–12:00, Miércoles 10:00–12:00',
      })
    )
  : []
