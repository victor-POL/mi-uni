import { Card, CardContent } from '@/components/ui/card'
import { X } from 'lucide-react'

export const WarningMsgNoPlanesDisponibles = () => {
  return (
    <Card className="bg-yellow-50 border-yellow-200">
      <CardContent className="p-6">
        <div className="flex items-center space-x-2 text-yellow-800">
          <X className="h-5 w-5" />
          <h3 className="font-semibold">No hay datos disponibles</h3>
        </div>
        <p className="mt-2 text-yellow-700">
          Actualmente no se encontraron planes de estudio. Por favor, verifica más tarde o contacta al soporte si el
          problema persiste.
        </p>
      </CardContent>
    </Card>
  )
}
