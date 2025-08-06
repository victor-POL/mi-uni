'use client'

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

  return (
    <Accordion type="multiple" className="w-full">
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
                <Accordion type="multiple" className="w-full">
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
