import type React from "react"
import type { Metadata } from "next"
import { Providers } from "@/components/Providers"
import "./globals.css"

export const metadata: Metadata = {
  title: "MiUni - Inicio",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="light">
      <body className="bg-white text-gray-900 antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
