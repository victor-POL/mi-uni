'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { PlanDeEstudioDetalle } from '@/models/plan-estudio.model'

interface EstadisticasPlanProps {
  plan: PlanDeEstudioDetalle
}

export function EstadisticasPlan({ plan }: Readonly<EstadisticasPlanProps>) {
  const totalMaterias = plan.materias.length
  const horasTotales = plan.materias.reduce((sum, m) => sum + (m.horasSemanales || 0), 0)
  const aniosDuracion = Math.max(...plan.materias.map((m) => m.anioCursada))
  const materiasSinCorrelativas = plan.materias.filter((m) => m.listaCorrelativas.length === 0).length

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-gray-900">{`${plan.nombreCarrera} - Año ${plan.anio}`}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{totalMaterias}</div>
            <div className="text-sm text-gray-600">Total Materias</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{horasTotales}</div>
            <div className="text-sm text-gray-600">Horas Totales</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">{aniosDuracion}</div>
            <div className="text-sm text-gray-600">Años de Duración</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">{materiasSinCorrelativas}</div>
            <div className="text-sm text-gray-600">Sin Correlativas</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
