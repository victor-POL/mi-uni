import { Card, CardHeader, CardContent } from '@/components/ui/card'

export const SkeletonEstadisticasPlanEstudio = () => {
  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <div className="h-8 bg-gray-200 rounded animate-pulse w-80"></div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[1, 2, 3, 4].map((i) => (
            <div key={i}>
              <div className="h-8 bg-gray-200 rounded animate-pulse mb-2 w-16 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-24 mx-auto"></div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
