import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Sistema de Gestión Académica",
  description: "Gestión de materias, planes de estudio y carreras",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="light">
      <body className="bg-white text-gray-900 antialiased">{children}</body>
    </html>
  )
}
