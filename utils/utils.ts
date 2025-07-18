export const getNombreCuatrimestre = (cuatrimestre: number): string => {
    switch (cuatrimestre) {
      case 1:
        return "Primer Cuatrimestre"
      case 2:
        return "Segundo Cuatrimestre"
      case 3:
        return "Anual"
      default:
        return `Cuatrimestre sin definir`
    }
  }