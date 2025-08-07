import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Clock } from 'lucide-react'
import type { EstadoMateriaPlanEstudio, MateriaPlanEstudio } from '@/models/materias.model'
import Link from 'next/link'

interface CardMateriaPlanEstudioProps {
  materia: MateriaPlanEstudio
  resaltar: boolean
  showEstado: boolean
  showCorrelativas: boolean
  onClickCorrelativa?: (codigoMateria: string) => void
}

/**
 * Renderiza las correlativas de una materia.
 * Si no hay correlativas, muestra un mensaje indicando que no hay.
 */
const renderCorrelativas = (
  correlativas: { codigoMateria: string; nombreMateria: string }[],
  onClickCorrelativa?: (codigoMateria: string) => void
) => {
  if (correlativas.length === 0) {
    return <div className="text-xs text-gray-500 italic">Sin correlativas</div>
  }

  return (
    <div>
      <h4 className="text-sm font-medium text-gray-700 mb-2">Correlativas:</h4>
      <div className="space-y-1">
        {correlativas.map((correlativa) => (
          <Button
            key={correlativa.codigoMateria}
            variant="outline"
            size="sm"
            onClick={() => onClickCorrelativa?.(correlativa.codigoMateria)}
            className="break-words whitespace-normal text-xs bg-gray-100 hover:bg-blue-100 border-gray-300 px-2 py-1 h-auto w-full justify-start text-left"
          >
            {`${correlativa.codigoMateria} - ${correlativa.nombreMateria}`}
          </Button>
        ))}
      </div>
    </div>
  )
}

/**
 *  Obtener el estilo del badge según el estado de la materia.
 */
const getStatusBadgeColor = (estadoMateriaUsuario: EstadoMateriaPlanEstudio) => {
  switch (estadoMateriaUsuario) {
    case 'Aprobada':
      return 'bg-green-100 text-green-800'
    case 'En Final':
      return 'bg-purple-100 text-purple-800'
    case 'En Curso':
      return 'bg-blue-100 text-blue-800'
    case 'Pendiente':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export const CardMateriaPlanEstudio = ({
  materia,
  resaltar,
  showEstado,
  showCorrelativas,
  onClickCorrelativa,
}: CardMateriaPlanEstudioProps) => {
  const estadoMateria = materia.estado

  return (
    <Card
      key={materia.codigoMateria}
      id={`materia-${materia.codigoMateria}`}
      className={`border-l-4 border-l-blue-200 transition-all duration-500 bg-white shadow-sm ${
        resaltar ? 'ring-2 ring-blue-500 shadow-lg bg-blue-50' : ''
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base text-gray-900">{materia.nombreMateria}</CardTitle>
            <CardDescription className="font-mono text-sm text-gray-600 flex flex-wrap gap-1">
              <p>{materia.codigoMateria}</p>
              <Badge
                variant="secondary"
                className="flex justify-center items-center gap-1 bg-gray-100 text-gray-800 text-xs"
              >
                <Clock className="h-3 w-3" />
                {materia.horasSemanales}h
              </Badge>
              {showEstado && estadoMateria !== null && (
                <Badge className={`w-20 text-xs ${getStatusBadgeColor(estadoMateria)}`}>{estadoMateria}</Badge>
              )}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Correlativas */}
        {showCorrelativas ? (
          renderCorrelativas(materia.listaCorrelativas, onClickCorrelativa)
        ) : (
          <div className="text-xs text-gray-500 italic">Correlativas ocultas</div>
        )}

        {/* Botón Ver Detalles */}
        <Link href={`/materias/${materia.codigoMateria}`} className="block mt-3">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
          >
            <BookOpen className="h-3 w-3 mr-1" />
            Ver Detalles
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
