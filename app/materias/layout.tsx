export const metadata = {
  title: 'MiUni - Detalle Materia',
  description: 'Consulta los detalles de una materia específica, incluyendo su descripción, requisitos y horarios.',
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
