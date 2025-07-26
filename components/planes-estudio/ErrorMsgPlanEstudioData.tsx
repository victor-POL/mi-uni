import { Card, CardContent } from '@/components/ui/card'
import { X } from 'lucide-react'

export const ErrorMsgPlanEstudioData = () => {
  return (
    <Card className="bg-red-50 border-red-200">
      <CardContent className="p-6">
        <div className="flex items-center space-x-2 text-red-800">
          <X className="h-5 w-5" />
          <h3 className="font-semibold">Error al cargar los datos</h3>
        </div>
        <p className="mt-2 text-red-700">
          No se pudieron cargar los planes de estudio disponibles. Por favor, intenta recargar la página.
        </p>
      </CardContent>
    </Card>
  )
}
