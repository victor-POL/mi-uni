export interface Comision {
  comisionNombre: string
  diasYHorarios: {
    dia: string
    horario: string
  }[]
}

export interface MateriaOferta {
  codigoMateria: string
  nombreMateria: string
  esElectiva: boolean
  materiaPadreCodigo?: string | null
  comisiones: Comision[]
}

export interface PlanDeEstudio {
  idPlan: number
  nombreCarrera: string
  anio: number
  materias: MateriaOferta[]
}