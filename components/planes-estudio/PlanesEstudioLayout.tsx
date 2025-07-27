'use client'

import { AppLayout } from '@/components/AppLayout'
import { HeaderPage } from '@/components/HeaderPage'
import { ErrorMsgPlanEstudioData } from '@/components/planes-estudio/ErrorMsgPlanEstudioData'
import { SelectorPlanEstudio } from '@/components/planes-estudio/SelectorPlanEstudio'

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
