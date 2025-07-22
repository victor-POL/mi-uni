// Modelos para materias en curso (usuario_materia_cursada)

export interface MateriaCursada {
  usuarioId: number
  planEstudioId: number
  materiaId: number
  notaPrimerParcial?: number
  notaSegundoParcial?: number
  notaRecuperatorioPrimerParcial?: number
  notaRecuperatorioSegundoParcial?: number
  fechaActualizacion: Date
  
  // Datos de la materia (JOIN)
  codigoMateria: string
  nombreMateria: string
  tipo: 'cursable' | 'electiva'
  horasSemanales: number
  anioEnPlan: number
  cuatrimestreEnPlan: number
  
  // Datos del plan/carrera (JOIN)
  carreraNombre: string
  planAnio: number
}

export interface MateriaCursadaPorCarrera {
  carreraId: number
  carreraNombre: string
  planEstudioId: number
  planAnio: number
  materias: MateriaCursada[]
}

export interface NuevaMateriaEnCurso {
  planEstudioId: number
  materiaId: number
}

export interface ActualizarNotasMateriaEnCurso {
  usuarioId: number
  planEstudioId: number
  materiaId: number
  notaPrimerParcial?: number
  notaSegundoParcial?: number
  notaRecuperatorioPrimerParcial?: number
  notaRecuperatorioSegundoParcial?: number
}

export interface EstadisticasMateriasEnCurso {
  totalMaterias: number
  materiasAnual: number
  materiasPrimero: number
  materiasSegundo: number
  promedioNotasParciales?: number
  materiasConParciales: number
}

export interface UsuarioAnioAcademico {
  usuarioId: number
  anioAcademico: number
  fechaActualizacion: Date
}
