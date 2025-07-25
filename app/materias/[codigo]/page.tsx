'use client'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, ExternalLink, BookOpen, Users, Calendar } from 'lucide-react'
import { AppLayout } from '@/components/AppLayout'
import { materiasDetalle } from '@/data/detalles-materias.data'

export default function MateriaDetallePage() {
  const params = useParams()
  const codigo = params.codigo as string

  const materia = materiasDetalle.find((m) => m.codigoMateria === codigo)

  // validar que el codigo sera del formato 00000 a 99999
  if (!codigo || Array.isArray(codigo) || !/^\d{5}$/.test(codigo)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-bold mb-2">Código de materia inválido</h2>
            <p className="text-gray-600 mb-4">El código {codigo} no es válido. Debe ser un número de 5 dígitos.</p>
            <Link href="/">
              <Button>Volver a Inicio</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!materia) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-bold mb-2">Materia no encontrada</h2>
            <p className="text-gray-600 mb-4">El código {codigo} no corresponde a ninguna materia.</p>
            <Link href="/planes-estudio">
              <Button>Volver a Planes de Estudio</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <AppLayout title={materia.nombreMateria}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Información General */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{materia.nombreMateria}</CardTitle>
                <CardDescription className="text-lg mt-2">{materia.descripcion}</CardDescription>
              </div>
              <Badge variant="secondary" className="flex items-center justify-center gap-2 whitespace-nowrap px-3 py-1.5">
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span className="leading-none">{materia.horasSemanales} horas/semana</span>
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Profesores
                </h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  {materia.profesores.map((profesor, index) => (
                    <li key={index}>{profesor}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Horarios
                </h3>
                <p className="text-sm text-gray-600">{materia.horarios}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Correlativas */}
        {materia.correlativas.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Correlativas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {materia.correlativas.map((correlativa) => (
                  <Link key={correlativa} href={`/materias/${correlativa}`}>
                    <Badge variant="outline" className="hover:bg-gray-100 cursor-pointer">
                      {correlativa}
                    </Badge>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Objetivos */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Objetivos</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {materia.objetivos.map((objetivo, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{objetivo}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Links Útiles */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              Links Útiles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {materia.linksUtiles.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium">{link.titulo}</span>
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bibliografía */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Bibliografía
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {materia.bibliografia.map((libro, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{libro}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
