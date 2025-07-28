import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatearFecha(fecha: string) {
  return new Date(fecha).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function formatearNota(nota?: number) {
  return nota !== undefined ? nota.toFixed(1) : '-'
}

export function calcularPromedioMaterias(materia: any) {
  const notas = [
    materia.notaPrimerParcial,
    materia.notaSegundoParcial,
    materia.notaRecuperatorioPrimerParcial,
    materia.notaRecuperatorioSegundoParcial,
  ].filter((nota) => nota !== undefined)

  if (notas.length === 0) return undefined
  return notas.reduce((sum, nota) => sum + nota, 0) / notas.length
}
