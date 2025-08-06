import { Card, CardHeader, CardContent } from '@/components/ui/card'

export const SkeletonMateriasPlanEstudio = () => {
  return (
    <Card className="shadow-sm pt-4">
      <CardContent className='space-y-6'>
        {[0, 1, 2].map((cuatrimestreCursada) => (
          <div key={cuatrimestreCursada} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((materia) => (
                <Card key={materia} className="border-l-4 border-l-gray-200 bg-white shadow-sm animate-pulse">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="h-5 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="h-6 bg-gray-200 rounded w-12"></div>
                        <div className="h-5 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                      <div className="space-y-1">
                        <div className="h-6 bg-gray-200 rounded w-full"></div>
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      </div>
                      <div className="h-8 bg-gray-200 rounded w-full mt-3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
