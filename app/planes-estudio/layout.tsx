export const metadata = {
  title: 'MiUni - Planes de Estudio',
  description: 'Explora los planes de estudio disponibles en MiUni',
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
