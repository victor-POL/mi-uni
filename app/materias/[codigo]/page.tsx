"use client"

import { use } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, ExternalLink, BookOpen, Users, Calendar } from "lucide-react"

// Datos de ejemplo expandidos
const materiasDetalle = {
  MAT101: {
    codigo: "MAT101",
    nombre: "Matemática I",
    horasSemanales: 6,
    correlativas: [],
    descripcion:
      "Fundamentos de álgebra y cálculo diferencial. Esta materia introduce a los estudiantes en los conceptos básicos del análisis matemático.",
    objetivos: [
      "Comprender los fundamentos del cálculo diferencial",
      "Resolver problemas de límites y continuidad",
      "Aplicar derivadas en problemas prácticos",
    ],
    linksUtiles: [
      { titulo: "Khan Academy - Cálculo", url: "https://es.khanacademy.org/math/calculus-1" },
      { titulo: "Wolfram Alpha", url: "https://www.wolframalpha.com/" },
      { titulo: "GeoGebra", url: "https://www.geogebra.org/" },
    ],
    bibliografia: [
      "Stewart, J. - Cálculo de una Variable (8va Edición)",
      "Spivak, M. - Calculus (4ta Edición)",
      "Apostol, T. - Calculus Vol. 1 (2da Edición)",
    ],
    profesores: ["Dr. María González", "Lic. Carlos Rodríguez"],
    horarios: "Lunes y Miércoles 14:00-17:00",
  },
  FIS101: {
    codigo: "FIS101",
    nombre: "Física I",
    horasSemanales: 8,
    correlativas: ["MAT101"],
    descripcion:
      "Mecánica clásica y termodinámica. Estudio de los principios fundamentales que rigen el movimiento y la energía.",
    objetivos: [
      "Comprender las leyes de Newton y sus aplicaciones",
      "Analizar sistemas termodinámicos",
      "Resolver problemas de mecánica y energía",
    ],
    linksUtiles: [
      { titulo: "PhET Simulations", url: "https://phet.colorado.edu/" },
      { titulo: "HyperPhysics", url: "http://hyperphysics.phy-astr.gsu.edu/" },
      { titulo: "Physics Classroom", url: "https://www.physicsclassroom.com/" },
    ],
    bibliografia: [
      "Halliday, D. - Fundamentos de Física (10ma Edición)",
      "Serway, R. - Física para Ciencias e Ingeniería (9na Edición)",
      "Young, H. - Física Universitaria (14va Edición)",
    ],
    profesores: ["Dr. Ana Martínez", "Ing. Pedro López"],
    horarios: "Martes y Jueves 08:00-12:00",
  },
  MAT201: {
    codigo: "MAT201",
    nombre: "Matemática II",
    horasSemanales: 6,
    correlativas: ["MAT101"],
    descripcion:
      "Cálculo integral y ecuaciones diferenciales. Continuación de Matemática I con énfasis en integración y aplicaciones.",
    objetivos: [
      "Dominar técnicas de integración",
      "Resolver ecuaciones diferenciales ordinarias",
      "Aplicar integrales en problemas geométricos y físicos",
    ],
    linksUtiles: [
      { titulo: "Paul's Online Math Notes", url: "https://tutorial.math.lamar.edu/" },
      { titulo: "Symbolab", url: "https://www.symbolab.com/" },
      { titulo: "Desmos Graphing Calculator", url: "https://www.desmos.com/calculator" },
    ],
    bibliografia: [
      "Stewart, J. - Cálculo de una Variable (8va Edición)",
      "Edwards, C. - Ecuaciones Diferenciales (6ta Edición)",
      "Boyce, W. - Ecuaciones Diferenciales (10ma Edición)",
    ],
    profesores: ["Dr. Luis Fernández", "Lic. Carmen Silva"],
    horarios: "Lunes y Viernes 10:00-13:00",
  },
  FIS201: {
    codigo: "FIS201",
    nombre: "Física II",
    horasSemanales: 8,
    correlativas: ["FIS101", "MAT201"],
    descripcion: "Electromagnetismo y óptica. Estudio de los fenómenos eléctricos, magnéticos y ópticos.",
    objetivos: [
      "Comprender las leyes del electromagnetismo",
      "Analizar circuitos eléctricos y magnéticos",
      "Estudiar fenómenos ondulatorios y ópticos",
    ],
    linksUtiles: [
      { titulo: "Falstad Circuit Simulator", url: "https://www.falstad.com/circuit/" },
      {
        titulo: "PhET Simulations - Electricity",
        url: "https://phet.colorado.edu/en/simulations/category/physics/electricity-magnets-and-circuits",
      },
      { titulo: "HyperPhysics - Electricity", url: "http://hyperphysics.phy-astr.gsu.edu/hbase/electric/elecon.html" },
    ],
    bibliografia: [
      "Griffiths, D. - Introduction to Electrodynamics (4ta Edición)",
      "Purcell, E. - Electricity and Magnetism (3ra Edición)",
      "Halliday, D. - Fundamentos de Física Vol. 2 (10ma Edición)",
    ],
    profesores: ["Dr. Roberto Vega", "Dra. Isabel Morales"],
    horarios: "Miércoles y Viernes 14:00-18:00",
  },
  PRG101: {
    codigo: "PRG101",
    nombre: "Programación I",
    horasSemanales: 4,
    correlativas: [],
    descripcion:
      "Fundamentos de programación y algoritmos. Introducción a la lógica de programación y estructuras básicas.",
    objetivos: [
      "Desarrollar pensamiento algorítmico",
      "Aprender sintaxis básica de programación",
      "Implementar estructuras de control y datos básicas",
    ],
    linksUtiles: [
      { titulo: "Codecademy", url: "https://www.codecademy.com/" },
      { titulo: "HackerRank", url: "https://www.hackerrank.com/" },
      { titulo: "LeetCode", url: "https://leetcode.com/" },
    ],
    bibliografia: [
      "Deitel, P. - Cómo programar en C++ (10ma Edición)",
      "Cormen, T. - Introduction to Algorithms (3ra Edición)",
      "Sedgewick, R. - Algorithms (4ta Edición)",
    ],
    profesores: ["Ing. Miguel Torres", "Lic. Andrea Ruiz"],
    horarios: "Martes y Jueves 16:00-18:00",
  },
  PRG201: {
    codigo: "PRG201",
    nombre: "Programación II",
    horasSemanales: 6,
    correlativas: ["PRG101"],
    descripcion:
      "Estructuras de datos y programación orientada a objetos. Profundización en técnicas avanzadas de programación.",
    objetivos: [
      "Implementar estructuras de datos complejas",
      "Aplicar principios de programación orientada a objetos",
      "Desarrollar aplicaciones de mediana complejidad",
    ],
    linksUtiles: [
      { titulo: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/" },
      { titulo: "Stack Overflow", url: "https://stackoverflow.com/" },
      { titulo: "GitHub", url: "https://github.com/" },
    ],
    bibliografia: [
      "Weiss, M. - Data Structures and Algorithm Analysis (4ta Edición)",
      "Gamma, E. - Design Patterns (1ra Edición)",
      "Bloch, J. - Effective Java (3ra Edición)",
    ],
    profesores: ["Dr. Fernando Castro", "Ing. Lucía Herrera"],
    horarios: "Lunes, Miércoles y Viernes 09:00-11:00",
  },
}

interface PageProps {
  params: Promise<{ codigo: string }>
}

export default function MateriaDetallePage({ params }: PageProps) {
  const { codigo } = use(params)
  const materia = materiasDetalle[codigo as keyof typeof materiasDetalle]

  if (!materia) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-bold mb-2">Materia no encontrada</h2>
            <p className="text-gray-600 mb-4">El código {codigo} no corresponde a ninguna materia.</p>
            <Link href="/materias">
              <Button>Volver a Materias</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/materias">
              <Button variant="ghost" size="icon" className="mr-4">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{materia.nombre}</h1>
              <p className="text-sm text-gray-600 font-mono">{materia.codigo}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Información General */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{materia.nombre}</CardTitle>
                <CardDescription className="text-lg mt-2">{materia.descripcion}</CardDescription>
              </div>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {materia.horasSemanales} horas/semana
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
    </div>
  )
}
