"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, LogOut, Clock, BookOpen, Trophy, GraduationCap } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

// Datos de ejemplo
const materias = [
  {
    codigo: "MAT101",
    nombre: "Matemática I",
    horasSemanales: 6,
    correlativas: [],
    descripcion: "Fundamentos de álgebra y cálculo diferencial",
  },
  {
    codigo: "FIS101",
    nombre: "Física I",
    horasSemanales: 8,
    correlativas: ["MAT101"],
    descripcion: "Mecánica clásica y termodinámica",
  },
  {
    codigo: "MAT201",
    nombre: "Matemática II",
    horasSemanales: 6,
    correlativas: ["MAT101"],
    descripcion: "Cálculo integral y ecuaciones diferenciales",
  },
  {
    codigo: "FIS201",
    nombre: "Física II",
    horasSemanales: 8,
    correlativas: ["FIS101", "MAT201"],
    descripcion: "Electromagnetismo y óptica",
  },
  {
    codigo: "PRG101",
    nombre: "Programación I",
    horasSemanales: 4,
    correlativas: [],
    descripcion: "Fundamentos de programación y algoritmos",
  },
  {
    codigo: "PRG201",
    nombre: "Programación II",
    horasSemanales: 6,
    correlativas: ["PRG101"],
    descripcion: "Estructuras de datos y programación orientada a objetos",
  },
]

export default function MateriasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMateria, setSelectedMateria] = useState<string | null>(null)

  const filteredMaterias = materias.filter(
    (materia) =>
      materia.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      materia.codigo.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const scrollToMateria = (codigo: string) => {
    setSelectedMateria(codigo)
    const element = document.getElementById(`materia-${codigo}`)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" })
      setTimeout(() => setSelectedMateria(null), 2000)
    }
  }

  const handleLogout = () => {
    // Aquí iría la lógica de logout
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-6">
              <h1 className="text-2xl font-bold text-gray-900">Sistema de Materias</h1>
              <Link href="/planes-estudio">
                <Button variant="ghost" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Planes de Estudio
                </Button>
              </Link>
              <Link href="/mis-carreras">
                <Button variant="ghost" className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  Mis Carreras
                </Button>
              </Link>
              <Link href="/materias-en-curso">
                <Button variant="ghost" className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Materias En Curso
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2 bg-transparent">
                <LogOut className="h-4 w-4" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Buscador */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Buscar materias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Lista de Materias */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredMaterias.map((materia) => (
            <Card
              key={materia.codigo}
              id={`materia-${materia.codigo}`}
              className={`transition-all duration-300 hover:shadow-lg ${
                selectedMateria === materia.codigo ? "ring-2 ring-blue-500 shadow-lg" : ""
              }`}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{materia.nombre}</CardTitle>
                    <CardDescription className="font-mono text-sm">{materia.codigo}</CardDescription>
                  </div>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {materia.horasSemanales}h
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{materia.descripcion}</p>

                {/* Correlativas */}
                {materia.correlativas.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Correlativas:</h4>
                    <div className="flex flex-wrap gap-2">
                      {materia.correlativas.map((correlativa) => (
                        <Button
                          key={correlativa}
                          variant="outline"
                          size="sm"
                          onClick={() => scrollToMateria(correlativa)}
                          className="text-xs h-6 px-2"
                        >
                          {correlativa}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Botón Ver Más */}
                <Link href={`/materias/${materia.codigo}`}>
                  <Button className="w-full mt-4" variant="default">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Ver Detalles
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMaterias.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron materias que coincidan con tu búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  )
}
