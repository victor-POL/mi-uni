export const metadata = {
  title: 'MiUni - Oferta de Materias',
  description: 'Consulta la oferta de materias disponibles para un periodo lectivo.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
