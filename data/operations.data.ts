import { GraduationCap, Calendar, User, BookOpen } from "lucide-react"

export const publicOperations = [
    {
      title: "Planes de Estudio",
      description: "Explora los diferentes planes de estudio disponibles",
      icon: GraduationCap,
      href: "/planes-estudio",
      color: "bg-blue-500",
    },
    {
      title: "Oferta de Materias",
      description: "Consulta las materias disponibles por cuatrimestre",
      icon: Calendar,
      href: "/oferta-materias",
      color: "bg-green-500",
    },
  ]

  export const privateOperations = [
    {
      title: "Mis Carreras",
      description: "Gestiona tus carreras y seguimiento académico",
      icon: User,
      href: "/mis-carreras",
      color: "bg-purple-500",
    },
    {
      title: "Materias en Curso",
      description: "Consulta las materias que estás cursando actualmente",
      icon: BookOpen,
      href: "/materias-en-curso",
      color: "bg-orange-500",
    },
  ]