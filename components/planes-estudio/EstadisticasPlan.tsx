'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { EstadisticasPlan } from '@/models/plan-estudio.model'

interface EstadisticasPlanComponentProps {
  nombreCarrera: string
  anioPlan: number
  estadisticas: EstadisticasPlan
}

export function EstadisticasPlanComponent({
  nombreCarrera,
  anioPlan,
  estadisticas,
}: Readonly<EstadisticasPlanComponentProps>) {
  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-gray-900">{`${nombreCarrera} - Año ${anioPlan}`}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{estadisticas.totalMaterias}</div>
            <div className="text-sm text-gray-600">Total Materias</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{estadisticas.horasTotales}</div>
            <div className="text-sm text-gray-600">Horas Totales</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">{estadisticas.duracion}</div>
            <div className="text-sm text-gray-600">Años de Duración</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">{estadisticas.materiasSinCorrelativas}</div>
            <div className="text-sm text-gray-600">Sin Correlativas</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
