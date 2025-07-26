import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

export const SkeletonSelectorPlanEstudio = () => {
  return (
    <Card className="mb-8 bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">Búsqueda</CardTitle>
        <CardDescription className="text-gray-600">
          Luego de consultar un plan, podrás filtrar las materias por año, cuatrimestre, nombre, estado u horas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <div>
            <Label htmlFor="plan-select" className="block text-sm font-medium text-gray-700 mb-2">
              Plan de Estudio
            </Label>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <div className="h-10 bg-gray-200 rounded animate-pulse" style={{ width: '150px' }}></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
