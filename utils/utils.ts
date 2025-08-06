export const getNombreCuatrimestre = (cuatrimestre: number): string => {
  switch (cuatrimestre) {
    case 0:
      return 'Anual'
    case 1:
      return 'Primer Cuatrimestre'
    case 2:
      return 'Segundo Cuatrimestre'
    default:
      return `Cuatrimestre sin definir`
  }
}
