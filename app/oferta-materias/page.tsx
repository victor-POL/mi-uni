"use client"

import { useState, useMemo } from "react"
import { AppLayout } from "@/components/AppLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Calendar, Clock, MapPin, User, Eye } from "lucide-react"
import { useRouter } from "next/navigation"
import { ofertaMaterias } from "./data"

export default function OfertaMateriasPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCuatrimestre, setSelectedCuatrimestre] = useState("all")
  const [selectedModalidad, setSelectedModalidad] = useState("all")
  const [selectedEstado, setSelectedEstado] = useState("all")

  // Get unique values for filters
  const cuatrimestres = useMemo(() => {
    const uniqueCuatrimestres = [...new Set(ofertaMaterias.map((materia) => materia.cuatrimestre))]
    return uniqueCuatrimestres.sort()
  }, [])

  const modalidades = useMemo(() => {
    const uniqueModalidades = [...new Set(ofertaMaterias.map((materia) => materia.modalidad))]
    return uniqueModalidades.sort()
  }, [])

  const estados = useMemo(() => {
    const uniqueEstados = [...new Set(ofertaMaterias.map((materia) => materia.estado))]
    return uniqueEstados.sort()
  }, [])

  // Filter materias based on search and filters
  const filteredMaterias = useMemo(() => {
    return ofertaMaterias.filter((materia) => {
      const matchesSearch =
        materia.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        materia.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        materia.profesor.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCuatrimestre = selectedCuatrimestre === "all" || materia.cuatrimestre === selectedCuatrimestre
      const matchesModalidad = selectedModalidad === "all" || materia.modalidad === selectedModalidad
      const matchesEstado = selectedEstado === "all" || materia.estado === selectedEstado

      return matchesSearch && matchesCuatrimestre && matchesModalidad && matchesEstado
    })
  }, [searchTerm, selectedCuatrimestre, selectedModalidad, selectedEstado])

  const getBadgeColor = (estado: string) => {
    switch (estado) {
      case "Disponible":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "Inscripción Abierta":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "Cupo Completo":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      case "Próximamente":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  const getModalidadColor = (modalidad: string) => {
    switch (modalidad) {
      case "Presencial":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "Virtual":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200"
      case "Híbrida":
        return "bg-orange-100 text-orange-800 hover:bg-orange-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  const handleVerDetalles = (codigo: string) => {
    router.push(`/materias/${codigo}`)
  }

  return (
    <AppLayout title="Oferta de Materias">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Oferta de Materias</h1>
          <p className="text-gray-600">Consulta las materias disponibles por cuatrimestre y modalidad</p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Filtros de Búsqueda
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Buscar</label>
                <Input
                  placeholder="Buscar por nombre, código o profesor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Cuatrimestre</label>
                <Select value={selectedCuatrimestre} onValueChange={setSelectedCuatrimestre}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los cuatrimestres" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los cuatrimestres</SelectItem>
                    {cuatrimestres.map((cuatrimestre) => (
                      <SelectItem key={cuatrimestre} value={cuatrimestre}>
                        {cuatrimestre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Modalidad</label>
                <Select value={selectedModalidad} onValueChange={setSelectedModalidad}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las modalidades" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las modalidades</SelectItem>
                    {modalidades.map((modalidad) => (
                      <SelectItem key={modalidad} value={modalidad}>
                        {modalidad}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Estado</label>
                <Select value={selectedEstado} onValueChange={setSelectedEstado}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los estados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    {estados.map((estado) => (
                      <SelectItem key={estado} value={estado}>
                        {estado}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Resultados ({filteredMaterias.length})</h2>
          </div>

          {filteredMaterias.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron materias</h3>
                <p className="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredMaterias.map((materia) => (
                <Card key={materia.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-xl">{materia.nombre}</CardTitle>
                          <Badge variant="outline">{materia.codigo}</Badge>
                        </div>
                        <CardDescription className="text-base">{materia.descripcion}</CardDescription>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge className={getBadgeColor(materia.estado)}>{materia.estado}</Badge>
                        <Badge className={getModalidadColor(materia.modalidad)}>{materia.modalidad}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{materia.cuatrimestre}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="h-4 w-4" />
                        <span>{materia.profesor}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{materia.horario}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{materia.aula}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Cupos:</span> {materia.cuposDisponibles}/{materia.cuposTotal}
                      </div>
                      <Button onClick={() => handleVerDetalles(materia.codigo)} className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Ver Detalles
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
