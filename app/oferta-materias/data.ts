// Tipos de datos
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

export type EstadoMateria = "Pendiente" | "Cursando" | "En Final" | "Aprobada"

export const planesOferta: PlanDeEstudio[] = [
  {
    idPlan: 1,
    nombreCarrera: 'Ingeniería en Sistemas de Información',
    anio: 2023,
    materias: [
    {
      
      "codigoMateria": "00901",
      "nombreMateria": "INGLES NIVEL I",
      "esElectiva": false,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "01-1300",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "08:00-12:00"
            },
            {
              "dia": "Martes",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "02-1300",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "03-2300",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "04-2300",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "05-2300",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "06-3300",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "07-3300",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "08-4300",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "09-4300",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "10-5300",
          "diasYHorarios": [
            {
              "dia": "Viernes",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "11-5300",
          "diasYHorarios": [
            {
              "dia": "Viernes",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "12-7275",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "12:00-14:00|Viernes"
            }
          ]
        },
        {
          "comisionNombre": "13-7224",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "12:00-16:00"
            }
          ]
        },
        {
          "comisionNombre": "14-1600",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "15-1600",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "16-1600",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "17-2600",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "18-2600",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "19-2600",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "20-3600",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "21-3600",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "22-4600",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "23-4600",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "24-5600",
          "diasYHorarios": [
            {
              "dia": "Viernes",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "33-3900",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "32-3900",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "31-2900",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "30-2900",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "29-2900",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "28-2900",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "27-1900",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "26-1900",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "25-1900",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "34-3900",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "35-4900",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "36-4900",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "37-5900",
          "diasYHorarios": [
            {
              "dia": "Viernes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "38-5900",
          "diasYHorarios": [
            {
              "dia": "Viernes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "39-6300",
          "diasYHorarios": [
            {
              "dia": "Sabado",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "40-6300",
          "diasYHorarios": [
            {
              "dia": "Sabado",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "41-6300",
          "diasYHorarios": [
            {
              "dia": "Sabado",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "42-6300",
          "diasYHorarios": [
            {
              "dia": "Sabado",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "43-7664",
          "diasYHorarios": [
            {
              "dia": "Sabado",
              "horario": "12:00-16:00"
            }
          ]
        },
        {
          "comisionNombre": "44-7664",
          "diasYHorarios": [
            {
              "dia": "Sabado",
              "horario": "12:00-16:00"
            }
          ]
        },
        {
          "comisionNombre": "45-7664",
          "diasYHorarios": [
            {
              "dia": "Sabado",
              "horario": "12:00-16:00"
            }
          ]
        },
        {
          "comisionNombre": "46-5900",
          "diasYHorarios": [
            {
              "dia": "Viernes",
              "horario": "19:00-23:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "00911",
      "nombreMateria": "COMPUTACION NIVEL I",
      "esElectiva": false,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "01-1300",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "02-1300",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "03-7174",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "12:00-14:00|Lunes"
            }
          ]
        },
        {
          "comisionNombre": "04-1600",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "05-1600",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "06-1900",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "07-1900",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "08-1900",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "09-1900",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "10-2300",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "11-2300",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "12-2300",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "13-2600",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "14-2600",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "15-2900",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "16-2900",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "17-2900",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "18-3300",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "19-3300",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "20-3600",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "21-3900",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "22-4300",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "23-4300",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "24-4600",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "25-4900",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "26-4900",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "27-4900",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "28-5600",
          "diasYHorarios": [
            {
              "dia": "Viernes",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "29-5900",
          "diasYHorarios": [
            {
              "dia": "Viernes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "40-6900",
          "diasYHorarios": [
            {
              "dia": "Sabado",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "30-6300",
          "diasYHorarios": [
            {
              "dia": "Sabado",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "31-6900",
          "diasYHorarios": [
            {
              "dia": "Sabado",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "32-6900",
          "diasYHorarios": [
            {
              "dia": "Sabado",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "33-6900",
          "diasYHorarios": [
            {
              "dia": "Sabado",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "34-6900",
          "diasYHorarios": [
            {
              "dia": "Sabado",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "35-6900",
          "diasYHorarios": [
            {
              "dia": "Sabado",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "36-6900",
          "diasYHorarios": [
            {
              "dia": "Sabado",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "37-6900",
          "diasYHorarios": [
            {
              "dia": "Sabado",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "38-6900",
          "diasYHorarios": [
            {
              "dia": "Sabado",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "39-6900",
          "diasYHorarios": [
            {
              "dia": "Sabado",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "41-6900",
          "diasYHorarios": [
            {
              "dia": "Sabado",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "42-6900",
          "diasYHorarios": [
            {
              "dia": "Sabado",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "43-1300",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "08:00-12:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "00902",
      "nombreMateria": "INGLES NIVEL II",
      "esElectiva": false,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "01-1300",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "02-1300",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "03-1300",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "04-2300",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "05-2300",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "06-2300",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "07-3300",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "08-3300",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "09-3300",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "10-4300",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "11-4300",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "12-5300",
          "diasYHorarios": [
            {
              "dia": "Viernes",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "13-5300",
          "diasYHorarios": [
            {
              "dia": "Viernes",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "14-5300",
          "diasYHorarios": [
            {
              "dia": "Viernes",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "15-7174",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "12:00-14:00|Lunes"
            }
          ]
        },
        {
          "comisionNombre": "16-1600",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "17-1600",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "18-2600",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "19-2600",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "20-3600",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "21-4600",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "22-4600",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "23-5600",
          "diasYHorarios": [
            {
              "dia": "Viernes",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "24-8185",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "17:00-19:00|Viernes"
            }
          ]
        },
        {
          "comisionNombre": "25-1900",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "26-1900",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "27-1900",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "28-2900",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "29-3900",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "30-3900",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "31-3900",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "32-4900",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "33-4900",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "34-4900",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "35-5900",
          "diasYHorarios": [
            {
              "dia": "Viernes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "36-5900",
          "diasYHorarios": [
            {
              "dia": "Viernes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "37-6300",
          "diasYHorarios": [
            {
              "dia": "Sabado",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "38-6300",
          "diasYHorarios": [
            {
              "dia": "Sabado",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "39-6300",
          "diasYHorarios": [
            {
              "dia": "Sabado",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "40-7664",
          "diasYHorarios": [
            {
              "dia": "Sabado",
              "horario": "12:00-16:00"
            }
          ]
        },
        {
          "comisionNombre": "41-7664",
          "diasYHorarios": [
            {
              "dia": "Sabado",
              "horario": "12:00-16:00"
            }
          ]
        },
        {
          "comisionNombre": "42-5300",
          "diasYHorarios": [
            {
              "dia": "Viernes",
              "horario": "08:00-12:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "00903",
      "nombreMateria": "INGLES NIVEL III",
      "esElectiva": false,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "01-1200",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "10:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "02-2100",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "08:00-10:00"
            }
          ]
        },
        {
          "comisionNombre": "03-2200",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "10:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "04-3100",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "08:00-10:00"
            }
          ]
        },
        {
          "comisionNombre": "05-3200",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "10:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "06-4200",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "10:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "07-5100",
          "diasYHorarios": [
            {
              "dia": "Viernes",
              "horario": "08:00-10:00"
            }
          ]
        },
        {
          "comisionNombre": "08-7300",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "12:00-14:00"
            }
          ]
        },
        {
          "comisionNombre": "09-1500",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "16:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "10-2400",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "14:00-16:00"
            }
          ]
        },
        {
          "comisionNombre": "11-3400",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "14:00-16:00"
            }
          ]
        },
        {
          "comisionNombre": "12-4400",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "14:00-16:00"
            }
          ]
        },
        {
          "comisionNombre": "13-4500",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "16:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "14-5500",
          "diasYHorarios": [
            {
              "dia": "Viernes",
              "horario": "16:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "15-1700",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "19:00-21:00"
            }
          ]
        },
        {
          "comisionNombre": "16-1800",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "21:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "17-2700",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "19:00-21:00"
            }
          ]
        },
        {
          "comisionNombre": "18-2800",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "21:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "19-4700",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "19:00-21:00"
            }
          ]
        },
        {
          "comisionNombre": "20-4800",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "21:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "21-5700",
          "diasYHorarios": [
            {
              "dia": "Viernes",
              "horario": "19:00-21:00"
            }
          ]
        },
        {
          "comisionNombre": "22-5800",
          "diasYHorarios": [
            {
              "dia": "Viernes",
              "horario": "21:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "23-6100",
          "diasYHorarios": [
            {
              "dia": "Sabado",
              "horario": "08:00-10:00"
            }
          ]
        },
        {
          "comisionNombre": "24-6100",
          "diasYHorarios": [
            {
              "dia": "Sabado",
              "horario": "08:00-10:00"
            }
          ]
        },
        {
          "comisionNombre": "25-6200",
          "diasYHorarios": [
            {
              "dia": "Sabado",
              "horario": "10:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "26-7600",
          "diasYHorarios": [
            {
              "dia": "Sabado",
              "horario": "12:00-14:00"
            }
          ]
        },
        {
          "comisionNombre": "27-6400",
          "diasYHorarios": [
            {
              "dia": "Sabado",
              "horario": "14:00-16:00"
            }
          ]
        },
        {
          "comisionNombre": "28-1400",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "14:00-16:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "00904",
      "nombreMateria": "INGLES NIVEL IV",
      "esElectiva": false,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "01-1100",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "08:00-10:00"
            }
          ]
        },
        {
          "comisionNombre": "02-2100",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "08:00-10:00"
            }
          ]
        },
        {
          "comisionNombre": "03-2200",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "10:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "04-3100",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "08:00-10:00"
            }
          ]
        },
        {
          "comisionNombre": "05-3200",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "10:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "06-4100",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "08:00-10:00"
            }
          ]
        },
        {
          "comisionNombre": "07-5200",
          "diasYHorarios": [
            {
              "dia": "Viernes",
              "horario": "10:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "08-7300",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "12:00-14:00"
            }
          ]
        },
        {
          "comisionNombre": "09-1400",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "14:00-16:00"
            }
          ]
        },
        {
          "comisionNombre": "10-2500",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "16:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "11-3400",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "14:00-16:00"
            }
          ]
        },
        {
          "comisionNombre": "12-4400",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "14:00-16:00"
            }
          ]
        },
        {
          "comisionNombre": "13-4500",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "16:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "14-5400",
          "diasYHorarios": [
            {
              "dia": "Viernes",
              "horario": "14:00-16:00"
            }
          ]
        },
        {
          "comisionNombre": "15-1700",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "19:00-21:00"
            }
          ]
        },
        {
          "comisionNombre": "16-1800",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "21:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "17-2700",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "19:00-21:00"
            }
          ]
        },
        {
          "comisionNombre": "18-3700",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "19:00-21:00"
            }
          ]
        },
        {
          "comisionNombre": "19-3800",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "21:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "20-4700",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "19:00-21:00"
            }
          ]
        },
        {
          "comisionNombre": "21-4800",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "21:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "22-5700",
          "diasYHorarios": [
            {
              "dia": "Viernes",
              "horario": "19:00-21:00"
            }
          ]
        },
        {
          "comisionNombre": "23-5800",
          "diasYHorarios": [
            {
              "dia": "Viernes",
              "horario": "21:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "24-6100",
          "diasYHorarios": [
            {
              "dia": "Sabado",
              "horario": "08:00-10:00"
            }
          ]
        },
        {
          "comisionNombre": "25-6200",
          "diasYHorarios": [
            {
              "dia": "Sabado",
              "horario": "10:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "26-6200",
          "diasYHorarios": [
            {
              "dia": "Sabado",
              "horario": "10:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "27-7600",
          "diasYHorarios": [
            {
              "dia": "Sabado",
              "horario": "12:00-14:00"
            }
          ]
        },
        {
          "comisionNombre": "28-6400",
          "diasYHorarios": [
            {
              "dia": "Sabado",
              "horario": "14:00-16:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "00912",
      "nombreMateria": "COMPUTACION  NIVEL II",
      "esElectiva": false,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "02-7174",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "12:00-14:00|Lunes"
            }
          ]
        },
        {
          "comisionNombre": "06-2300",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "09-3300",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "11-4300",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "15-5300",
          "diasYHorarios": [
            {
              "dia": "Viernes",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "18-6300",
          "diasYHorarios": [
            {
              "dia": "Sabado",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "03-1600",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "07-2600",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "12-4600",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "16-5600",
          "diasYHorarios": [
            {
              "dia": "Viernes",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "19-6600",
          "diasYHorarios": [
            {
              "dia": "Sabado",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "04-1900",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "05-1900",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "08-2900",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "10-3900",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "13-4900",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "14-4900",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "17-5900",
          "diasYHorarios": [
            {
              "dia": "Viernes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "01-1300",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "20-6900",
          "diasYHorarios": [
            {
              "dia": "Sabado",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "21-6900",
          "diasYHorarios": [
            {
              "dia": "Sabado",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "22-6900",
          "diasYHorarios": [
            {
              "dia": "Sabado",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "23-6900",
          "diasYHorarios": [
            {
              "dia": "Sabado",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "24-6900",
          "diasYHorarios": [
            {
              "dia": "Sabado",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "25-6900",
          "diasYHorarios": [
            {
              "dia": "Sabado",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "26-6900",
          "diasYHorarios": [
            {
              "dia": "Sabado",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "27-6900",
          "diasYHorarios": [
            {
              "dia": "Sabado",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "28-6900",
          "diasYHorarios": [
            {
              "dia": "Sabado",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "29-6900",
          "diasYHorarios": [
            {
              "dia": "Sabado",
              "horario": "19:00-23:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "03621",
      "nombreMateria": "MATEMATICA DISCRETA",
      "esElectiva": false,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "01-4600",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "02-4900",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "03-3300",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "63-5300",
          "diasYHorarios": [
            {
              "dia": "Viernes",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "64-2300",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "65-1300",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "90-4900",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "66-1600",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "67-5600",
          "diasYHorarios": [
            {
              "dia": "Viernes",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "68-2600",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "69-3900",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "70-4900",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "19:00-23:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "03622",
      "nombreMateria": "ANALISIS MATEMATICO I",
      "esElectiva": false,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "01-2300",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "02-4300",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "04-1900",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "05-4900",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "03-5600",
          "diasYHorarios": [
            {
              "dia": "Viernes",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "06-5900",
          "diasYHorarios": [
            {
              "dia": "Viernes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "63-2300",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "64-3300",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "90-2900",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "66-2600",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "67-2600",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "68-6300",
          "diasYHorarios": [
            {
              "dia": "Sabado",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "69-4900",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "70-2900",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "19:00-23:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "03623",
      "nombreMateria": "PROGRAMACION INICIAL",
      "esElectiva": false,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "01-1300",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "02-1600",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "03-2900",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "04-3300",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "05-4900",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "63-4300",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "90-3900",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "07-2600",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "06-2300",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "65-6300",
          "diasYHorarios": [
            {
              "dia": "Sabado",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "67-4600",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "68-3600",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "70-3900",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "19:00-23:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "03624",
      "nombreMateria": "INTRODUCCION A LOS SISTEMAS DE INFORMACION",
      "esElectiva": false,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "01-1900",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "02-2900",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "03-3300",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "04-5300",
          "diasYHorarios": [
            {
              "dia": "Viernes",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "64-5300",
          "diasYHorarios": [
            {
              "dia": "Viernes",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "69-1900",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "19:00-23:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "03625",
      "nombreMateria": "SISTEMAS DE NUMERACION",
      "esElectiva": false,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "02-2600",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "01-2300",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "03-3300",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "04-3900",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "05-4900",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "64-4300",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "65-5300",
          "diasYHorarios": [
            {
              "dia": "Viernes",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "68-5600",
          "diasYHorarios": [
            {
              "dia": "Viernes",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "69-2900",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "70-5900",
          "diasYHorarios": [
            {
              "dia": "Viernes",
              "horario": "19:00-23:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "03626",
      "nombreMateria": "PRINCIPIOS DE CALIDAD DE SOFTWARE",
      "esElectiva": false,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "01-3900",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "02-4300",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "03-5900",
          "diasYHorarios": [
            {
              "dia": "Viernes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "63-3300",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "04-2300",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "05-2600",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "66-3600",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "14:00-18:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "03627",
      "nombreMateria": "ALGEBRA Y GEOMETRIA ANALITICA I",
      "esElectiva": false,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "01-1300",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "02-1900",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "03-2600",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "04-3900",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "05-4300",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "06-4600",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "07-5300",
          "diasYHorarios": [
            {
              "dia": "Viernes",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "08-5600",
          "diasYHorarios": [
            {
              "dia": "Viernes",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "09-5900",
          "diasYHorarios": [
            {
              "dia": "Viernes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "90-4900",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "65-4300",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "08:00-12:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "03628",
      "nombreMateria": "FISICA I",
      "esElectiva": false,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "01-2300",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "03-3600",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "04-3900",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "02-4300",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "05-6300",
          "diasYHorarios": [
            {
              "dia": "Sabado",
              "horario": "08:00-12:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "03629",
      "nombreMateria": "PROGRAMACION ESTRUCTURADA BASICA",
      "esElectiva": false,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "03-1900",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "04-2300",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "05-2600",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "06-4300",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "07-4600",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "08-5900",
          "diasYHorarios": [
            {
              "dia": "Viernes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "90-1900",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "01-1300",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "02-1600",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "14:00-18:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "03630",
      "nombreMateria": "INTRODUCCION A LA GESTION DE REQUISITOS",
      "esElectiva": false,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "01-2900",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "02-4900",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "03-5300",
          "diasYHorarios": [
            {
              "dia": "Viernes",
              "horario": "08:00-12:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "03631",
      "nombreMateria": "FUNDAMENTOS DE SISTEMAS EMBEBIDOS",
      "esElectiva": false,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "01-1300",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "02-1300",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "03-1600",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "04-2900",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "05-3300",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "06-3300",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "07-3900",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "08-5300",
          "diasYHorarios": [
            {
              "dia": "Viernes",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "09-5300",
          "diasYHorarios": [
            {
              "dia": "Viernes",
              "horario": "08:00-12:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "03632",
      "nombreMateria": "INTRODUCCION A LOS PROYECTOS INFORMATICOS",
      "esElectiva": false,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "01-2300",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "02-2900",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "03-5300",
          "diasYHorarios": [
            {
              "dia": "Viernes",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "04-6300",
          "diasYHorarios": [
            {
              "dia": "Sabado",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "66-4600",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "67-1600",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "14:00-18:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "03633",
      "nombreMateria": "ANALISIS MATEMATICO II",
      "esElectiva": false,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "01-2300",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "02-4300",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "03-4900",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "04-5300",
          "diasYHorarios": [
            {
              "dia": "Viernes",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "05-5900",
          "diasYHorarios": [
            {
              "dia": "Viernes",
              "horario": "19:00-23:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "03634",
      "nombreMateria": "FISICA II",
      "esElectiva": false,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "01-1900",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "02-3900",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "03-5300",
          "diasYHorarios": [
            {
              "dia": "Viernes",
              "horario": "08:00-12:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "03635",
      "nombreMateria": "TOPICOS DE PROGRAMACION",
      "esElectiva": false,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "01-1900",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "02-2600",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "03-2900",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "04-3600",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "05-3900",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "06-4300",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "07-4900",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "08-5900",
          "diasYHorarios": [
            {
              "dia": "Viernes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "09-6300",
          "diasYHorarios": [
            {
              "dia": "Sabado",
              "horario": "08:00-12:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "03636",
      "nombreMateria": "BASES DE DATOS",
      "esElectiva": false,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "01-1900",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "02-4900",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "03-6300",
          "diasYHorarios": [
            {
              "dia": "Sabado",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "04-2900",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "05-3900",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "19:00-23:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "03637",
      "nombreMateria": "ANALISIS DE SISTEMAS",
      "esElectiva": false,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "01-1900",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "02-2300",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "03-4900",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "04-5300",
          "diasYHorarios": [
            {
              "dia": "Viernes",
              "horario": "08:00-12:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "03638",
      "nombreMateria": "ARQUITECTURA DE COMPUTADORAS",
      "esElectiva": false,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "01-1900",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "02-2600",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "03-3600",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "04-4900",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "05-5900",
          "diasYHorarios": [
            {
              "dia": "Viernes",
              "horario": "19:00-23:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "03639",
      "nombreMateria": "ANALISIS MATEMATICO III",
      "esElectiva": false,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "01-2300",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "02-4300",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "03-5900",
          "diasYHorarios": [
            {
              "dia": "Viernes",
              "horario": "19:00-23:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "03640",
      "nombreMateria": "ALGORITMOS Y ESTRUCTURAS DE DATOS",
      "esElectiva": false,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "01-1900",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "02-3300",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "03-3600",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "90-3900",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "19:00-23:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "03641",
      "nombreMateria": "BASES DE DATOS APLICADAS",
      "esElectiva": false,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "02-5600",
          "diasYHorarios": [
            {
              "dia": "Viernes",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "01-2900",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "19:00-23:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "03642",
      "nombreMateria": "PRINCIPIOS DE DISEÑO DE SISTEMAS",
      "esElectiva": false,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "01-3900",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "02-4300",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "08:00-12:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "03643",
      "nombreMateria": "REDES DE COMPUTADORAS",
      "esElectiva": false,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "01-3300",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "02-3900",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "03-5900",
          "diasYHorarios": [
            {
              "dia": "Viernes",
              "horario": "19:00-23:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "03644",
      "nombreMateria": "GESTION DE LAS ORGANIZACIONES",
      "esElectiva": false,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "01-2900",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "02-3900",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "03-4900",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "19:00-23:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "03645",
      "nombreMateria": "ALGEBRA Y GEOMETRIA ANALITICA II",
      "esElectiva": false,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "01-3300",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "08:00-12:00"
            }
          ]
        },
        {
          "comisionNombre": "02-3600",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "03-3900",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "04-6300",
          "diasYHorarios": [
            {
              "dia": "Sabado",
              "horario": "08:00-12:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "03646",
      "nombreMateria": "PARADIGMAS DE PROGRAMACION",
      "esElectiva": false,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "01-2600",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "02-2900",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "19:00-23:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "03647",
      "nombreMateria": "REQUISITOS AVANZADOS",
      "esElectiva": false,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "01-1900",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "02-2900",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "19:00-23:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "03648",
      "nombreMateria": "DISEÑO DE SOFTWARE",
      "esElectiva": false,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "01-3900",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "19:00-23:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "03649",
      "nombreMateria": "SISTEMAS OPERATIVOS",
      "esElectiva": false,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "02-1900",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "03-3900",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "01-4900",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "19:00-23:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "03650",
      "nombreMateria": "SEGURIDAD DE LA INFORMACION",
      "esElectiva": false,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "01-3900",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "19:00-23:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "03651",
      "nombreMateria": "PROBABILIDAD Y ESTADISTICA",
      "esElectiva": false,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "01-3900",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "02-4900",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "03-5300",
          "diasYHorarios": [
            {
              "dia": "Viernes",
              "horario": "08:00-12:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "03652",
      "nombreMateria": "PROGRAMACION AVANZADA",
      "esElectiva": false,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "01-4600",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "14:00-18:00"
            }
          ]
        },
        {
          "comisionNombre": "02-4900",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "19:00-23:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "03653",
      "nombreMateria": "ARQUITECTURA DE SISTEMAS SOFTWARE",
      "esElectiva": false,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "01-1900",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "19:00-23:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "03654",
      "nombreMateria": "VIRTUALIZACION DE HARDWARE",
      "esElectiva": false,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "01-2900",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "02-4900",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "19:00-23:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "03655",
      "nombreMateria": "AUDITORIA Y LEGISLACION",
      "esElectiva": false,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "01-2900",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "19:00-23:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "03656",
      "nombreMateria": "ESTADISTICA APLICADA",
      "esElectiva": false,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "01-2900",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "02-4900",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "19:00-23:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "03657",
      "nombreMateria": "AUTOMATAS Y GRAMATICAS",
      "esElectiva": false,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "01-1900",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "19:00-23:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "03658",
      "nombreMateria": "PROGRAMACION CONCURRENTE",
      "esElectiva": false,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "01-3900",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "19:00-23:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "03659",
      "nombreMateria": "GESTION APLICADA AL DESARROLLO DE SOFTWARE I",
      "esElectiva": false,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "01-4900",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "19:00-23:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "03660",
      "nombreMateria": "SISTEMAS OPERATIVOS AVANZADOS",
      "esElectiva": false,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "01-1900",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "02-2900",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "19:00-23:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "03661",
      "nombreMateria": "GESTION DE PROYECTOS",
      "esElectiva": false,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "01-3900",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "19:00-23:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "03662",
      "nombreMateria": "MATEMATICA APLICADA",
      "esElectiva": false,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "01-1900",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "19:00-23:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "03663",
      "nombreMateria": "LENGUAJES Y COMPILADORES",
      "esElectiva": false,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "01-1900",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "02-2900",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "19:00-23:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "03664",
      "nombreMateria": "INTELIGENCIA ARTIFICIAL",
      "esElectiva": false,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "01-2900",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "19:00-23:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "03665",
      "nombreMateria": "GESTION APLICADA AL DESARROLLO DE SOFTWARE II",
      "esElectiva": false,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "01-2900",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "19:00-23:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "03666",
      "nombreMateria": "SEGURIDAD APLICADA Y FORENSIA",
      "esElectiva": false,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "01-4900",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "19:00-23:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "03667",
      "nombreMateria": "GESTION DE LA CALIDAD EN PROCESOS DE SISTEMAS",
      "esElectiva": false,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "01-4900",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "19:00-23:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "03668",
      "nombreMateria": "INTELIGENCIA ARTIFICIAL APLICADA",
      "esElectiva": false,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "01-5900",
          "diasYHorarios": [
            {
              "dia": "Viernes",
              "horario": "19:00-23:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "03669",
      "nombreMateria": "INNOVACION Y EMPRENDEDORISMO",
      "esElectiva": false,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "01-2900",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "19:00-23:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "03670",
      "nombreMateria": "CIENCIA DE DATOS",
      "esElectiva": false,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "01-3900",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "19:00-23:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "03671",
      "nombreMateria": "PROYECTO FINAL DE CARRERA",
      "esElectiva": false,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "01-6600",
          "diasYHorarios": [
            {
              "dia": "Sabado",
              "horario": "14:00-18:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "03675",
      "nombreMateria": "PRACTICA PROFESIONAL SUPERVISADA",
      "esElectiva": false,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "01-5600",
          "diasYHorarios": [
            {
              "dia": "Viernes",
              "horario": "14:00-18:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "03676",
      "nombreMateria": "RESPONSABILIDAD SOCIAL UNIVERSITARIA",
      "esElectiva": false,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "01-1900",
          "diasYHorarios": [
            {
              "dia": "Lunes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "02-2900",
          "diasYHorarios": [
            {
              "dia": "Martes",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "03-3900",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "19:00-23:00"
            }
          ]
        },
        {
          "comisionNombre": "04-5300",
          "diasYHorarios": [
            {
              "dia": "Viernes",
              "horario": "08:00-12:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "03677",
      "nombreMateria": "LENGUAJE ORIENTADO A NEGOCIOS",
      "esElectiva": true,
      "materiaPadreCodigo": "03672",
      "comisiones": [
        {
          "comisionNombre": "01-3900",
          "diasYHorarios": [
            {
              "dia": "Miercoles",
              "horario": "19:00-23:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "03678",
      "nombreMateria": "TECNOLOGIAS EN SEGURIDAD",
      "esElectiva": true,
      "materiaPadreCodigo": "03673",
      "comisiones": [
        {
          "comisionNombre": "01-5900",
          "diasYHorarios": [
            {
              "dia": "Viernes",
              "horario": "19:00-23:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "03679",
      "nombreMateria": "VISION ARTIFICIAL",
      "esElectiva": true,
      "materiaPadreCodigo": "03674",
      "comisiones": [
        {
          "comisionNombre": "01-4900",
          "diasYHorarios": [
            {
              "dia": "Jueves",
              "horario": "19:00-23:00"
            }
          ]
        }
      ]
    },
    {
      
      "codigoMateria": "03672",
      "nombreMateria": "ELECTIVA I",
      "esElectiva": true,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "",
          "diasYHorarios": []
        }
      ]
    },
    {
      
      "codigoMateria": "03673",
      "nombreMateria": "ELECTIVA II",
      "esElectiva": true,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "",
          "diasYHorarios": []
        }
      ]
    },
    {
      
      "codigoMateria": "03674",
      "nombreMateria": "ELECTIVA III",
      "esElectiva": true,
      "materiaPadreCodigo": null,
      "comisiones": [
        {
          "comisionNombre": "",
          "diasYHorarios": []
        }
      ]
    },
    {
      
      "codigoMateria": "03599",
      "nombreMateria": "REDES MOVILES E IOT",
      "esElectiva": true,
      "materiaPadreCodigo": "03673",
      "comisiones": [
        {
          "comisionNombre": "",
          "diasYHorarios": []
        }
      ]
    }
  ]
  }
]
