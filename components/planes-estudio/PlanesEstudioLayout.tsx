'use client'

import { AppLayout } from '@/components/AppLayout'
import { ErrorMsgPlanEstudioData } from '@/components/planes-estudio/ErrorMsgPlanEstudioData'
import { SelectorPlanEstudio } from '@/components/planes-estudio/SelectorPlanEstudio'

interface HeaderPageProps {
  readonly title: string
  readonly description: string
}

function HeaderPage({ title, description }: HeaderPageProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  )
}

interface PlanesEstudioLayoutProps {
  readonly loading?: boolean
  readonly forError?: boolean
  readonly emptyPlanes?: boolean
  readonly children?: React.ReactNode
}

export function PlanesEstudioLayout({
  loading = false,
  forError = false,
  emptyPlanes = false,
  children,
}: PlanesEstudioLayoutProps) {
  const title = 'Planes de Estudio'
  const description = 'Consulta todos los planes existentes junto a sus materias, correlativas, horas semanales, etc.'

  return (
    <AppLayout title={title}>
      <div className="container mx-auto p-6 space-y-6">
        <HeaderPage title={title} description={description} />

        {loading && (
          <SelectorPlanEstudio planes={[]} disabled={true} onSubmitPlan={() => {}} msgPlaceHolder="Cargando planes" />
        )}
        {forError && <ErrorMsgPlanEstudioData />}
        {emptyPlanes && (
          <SelectorPlanEstudio
            planes={[]}
            disabled={true}
            onSubmitPlan={() => {}}
            msgPlaceHolder="No se encontraron planes"
          />
        )}
        {!loading && !forError && !emptyPlanes && children}
      </div>
    </AppLayout>
  )
}
