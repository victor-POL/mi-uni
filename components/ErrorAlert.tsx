import { Card, CardContent } from '@/components/ui/card'
import { X } from 'lucide-react'

export const ErrorAlert = ({
  title = 'Error al cargar la informacion',
  description = 'No se pudo carga la informacion necesaria para la pagina. Por favor, intenta recargar la página.',
}: {
  title?: string
  description?: string
}) => {
  return (
    <Card className="bg-red-50 border-red-200">
      <CardContent className="p-6">
        <div className="flex items-center space-x-2 text-red-800">
          <X className="h-5 w-5" />
          <h3 className="font-semibold">{title}</h3>
        </div>
        <p className="mt-2 text-red-700">{description}</p>
      </CardContent>
    </Card>
  )
}
