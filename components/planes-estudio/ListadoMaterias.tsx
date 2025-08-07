'use client'

import { useState, useEffect } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'
import { CardMateriaPlanEstudio } from '@/components/planes-estudio/CardMateriaPlanEstudio'
import { getNombreCuatrimestre } from '@/utils/utils'
import { usePlanesEstudioFiltrosContext } from '@/contexts/PlanesEstudioFiltrosContext'

interface ListadoMateriasProps {
  materiaResaltada: string | null
  onClickCorrelativa: (codigoMateria: string) => void
}

export function ListadoMaterias({ materiaResaltada, onClickCorrelativa }: Readonly<ListadoMateriasProps>) {
  const { materiasAgrupadas, filtersPlan } = usePlanesEstudioFiltrosContext()
  
  // Inicializar con todos los accordions abiertos por defecto
  const [openAccordions, setOpenAccordions] = useState<string[]>(() => {
    const allAccordionValues: string[] = []
    
    Object.keys(materiasAgrupadas).forEach(anio => {
      const anioAccordion = `anio-${anio}`
      allAccordionValues.push(anioAccordion)
      
      Object.keys(materiasAgrupadas[Number(anio)]).forEach(cuatrimestre => {
        const cuatrimestreAccordion = `cuatrimestreCursada-${anio}-${cuatrimestre}`
        allAccordionValues.push(cuatrimestreAccordion)
      })
    })
    
    return allAccordionValues
  })

  // Función para encontrar el año y cuatrimestre de una materia
  const findMateriaLocation = (codigoMateria: string) => {
    for (const anio of Object.keys(materiasAgrupadas).map(Number)) {
      for (const cuatrimestre of Object.keys(materiasAgrupadas[anio]).map(Number)) {
        const materia = materiasAgrupadas[anio][cuatrimestre].find(
          (m) => m.codigoMateria === codigoMateria
        )
        if (materia) {
          return { anio, cuatrimestre }
        }
      }
    }
    return null
  }

  // Efecto para mantener todos los accordions abiertos cuando cambien los datos
  useEffect(() => {
    const allAccordionValues: string[] = []
    
    Object.keys(materiasAgrupadas).forEach(anio => {
      const anioAccordion = `anio-${anio}`
      allAccordionValues.push(anioAccordion)
      
      Object.keys(materiasAgrupadas[Number(anio)]).forEach(cuatrimestre => {
        const cuatrimestreAccordion = `cuatrimestreCursada-${anio}-${cuatrimestre}`
        allAccordionValues.push(cuatrimestreAccordion)
      })
    })
    
    setOpenAccordions(prev => {
      // Mantener los accordions que ya estaban abiertos y agregar los nuevos
      const merged = [...new Set([...prev, ...allAccordionValues])]
      return merged
    })
  }, [materiasAgrupadas])

  // Efecto para abrir accordions cuando se resalta una materia
  useEffect(() => {
    if (materiaResaltada) {
      const location = findMateriaLocation(materiaResaltada)
      if (location) {
        const anioAccordion = `anio-${location.anio}`
        const cuatrimestreAccordion = `cuatrimestreCursada-${location.anio}-${location.cuatrimestre}`
        
        setOpenAccordions(prev => {
          const newOpen = [...prev]
          if (!newOpen.includes(anioAccordion)) {
            newOpen.push(anioAccordion)
          }
          if (!newOpen.includes(cuatrimestreAccordion)) {
            newOpen.push(cuatrimestreAccordion)
          }
          return newOpen
        })
      }
    }
  }, [materiaResaltada, materiasAgrupadas])

  const handleAccordionChange = (value: string[]) => {
    setOpenAccordions(value)
  }

  return (
    <Accordion type="multiple" className="w-full" value={openAccordions} onValueChange={handleAccordionChange}>
      {Object.keys(materiasAgrupadas)
        .map(Number)
        .sort((a, b) => a - b)
        .map((anio) => (
          <div key={anio}>
            <AccordionItem value={`anio-${anio}`} className="border-none">
              <AccordionTrigger className="flex items-center gap-2 text-2xl font-bold text-gray-900 hover:no-underline">
                <div className="h-8 w-1 bg-blue-600 rounded"></div>
                {`${anio}°`} Año
              </AccordionTrigger>
              <AccordionContent className="pl-4 space-y-4">
                <Accordion type="multiple" className="w-full" value={openAccordions} onValueChange={handleAccordionChange}>
                  {Object.keys(materiasAgrupadas[anio])
                    .map(Number)
                    .sort((a, b) => a - b)
                    .map((cuatrimestreCursada) => (
                      <AccordionItem
                        key={`${anio}-${cuatrimestreCursada}`}
                        value={`cuatrimestreCursada-${anio}-${cuatrimestreCursada}`}
                        className="border-none"
                      >
                        <AccordionTrigger className="flex items-center gap-2 text-lg font-semibold text-gray-800 hover:no-underline">
                          <div className="h-6 w-1 bg-green-500 rounded"></div>
                          {getNombreCuatrimestre(cuatrimestreCursada)}
                        </AccordionTrigger>
                        <AccordionContent className="pl-4">
                          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 m-1">
                            {materiasAgrupadas[anio][cuatrimestreCursada].map((materia) => (
                              <CardMateriaPlanEstudio
                                key={materia.codigoMateria}
                                materia={materia}
                                resaltar={materiaResaltada === materia.codigoMateria}
                                showEstado={filtersPlan.showEstadoMateriaUsuario}
                                showCorrelativas={filtersPlan.showCorrelativasMateria}
                                onClickCorrelativa={onClickCorrelativa}
                              />
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
              </AccordionContent>
            </AccordionItem>
            <Separator className="bg-gray-200" />
          </div>
        ))}
    </Accordion>
  )
}
