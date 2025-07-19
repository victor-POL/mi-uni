export const metadata = {
  title: 'MiUni - Mis Carreras',
  description: 'Consulta y gestiona tus carreras en MiUni',
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
