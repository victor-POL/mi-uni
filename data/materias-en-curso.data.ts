import type { PlanDeEstudioMateriasEnCurso } from '@/models/plan-estudio.model'

export const planesDeEstudioMateriasEnCurso: PlanDeEstudioMateriasEnCurso[] = [
  {
    idPlan: 1,
    nombreCarrera: 'Ingeniería en Sistemas',
    anio: 2023,
    materiasEnCurso: [
      {
        codigoMateria: '03646',
        nombreMateria: 'PARADIGMAS DE PROGRAMACION',
        anioCursando: 2023,
        cuatrimestreCursando: 1,
        condicionCursada: 'Para promocion/regularizar',
        horasSemanales: 6,
      },
      {
        codigoMateria: '03647',
        nombreMateria: 'REQUISITOS AVANZADOS',
        anioCursando: 2023,
        cuatrimestreCursando: 2,
        condicionCursada: 'Para regularizar',
        horasSemanales: 4,
      },
    ],
    materiasDisponibles: [
      {
        codigoMateria: '03646',
        nombreMateria: 'PARADIGMAS DE PROGRAMACION',
        horasSemanales: 6,
        condicionCursada: 'Para promocion/regularizar',
      },
      {
        codigoMateria: '03647',
        nombreMateria: 'REQUISITOS AVANZADOS',
        horasSemanales: 4,
        condicionCursada: 'Para regularizar',
      },
      {
        codigoMateria: '03648',
        nombreMateria: 'DISEÑO DE SOFTWARE',
        horasSemanales: 4,
        condicionCursada: 'Para promocion/regularizar',
      },
      {
        codigoMateria: '03649',
        nombreMateria: 'SISTEMAS OPERATIVOS',
        horasSemanales: 4,
        condicionCursada: 'Para regularizar',
      },
    ],
  },
]
