'use client'

import { AgregarCarreraModal } from '@/components/AgregarCarreraModal'
import { AppLayout } from '@/components/AppLayout'
import { ErrorAlert } from '@/components/ErrorAlert'
import { HeaderPage } from '@/components/HeaderPage'
import { CarreraSkeleton } from '@/components/mis-carreras/SkeletonCarrera'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Card, CardContent } from '@/components/ui/card'
import { GraduationCap } from 'lucide-react'

interface PlanesEstudioLayoutProps {
  readonly loading?: boolean
  readonly forError?: boolean
  readonly emptyCarreras?: boolean
  readonly children?: React.ReactNode
}

export function MisCarrerasLayout({
  loading = false,
  forError = false,
  emptyCarreras = false,
  children,
}: PlanesEstudioLayoutProps) {
  const title = 'Mis Carreras'
  const description = 'Gestiona tus carreras y progreso académico'
  const isMainView = !loading && !forError && !emptyCarreras

  return (
    <ProtectedRoute>
      <AppLayout title={title}>
        <div className="container mx-auto p-6 space-y-6">
          <HeaderPage title={title} description={description} />

          {loading && (
            <>
              <CarreraSkeleton />
              <CarreraSkeleton />
            </>
          )}
          {forError && <ErrorAlert title="Error al obtener las carreras a las que se encuentra inscripto" />}
          {emptyCarreras && (
            <div className="col-span-full">
              <Card>
                <CardContent className="text-center py-12">
                  <GraduationCap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes carreras agregadas</h3>
                  <p className="text-gray-500 mb-6">
                    Comienza agregando tu primera carrera para ver tu progreso académico
                  </p>
                  <div className="flex justify-center">
                    <AgregarCarreraModal />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          {isMainView && children}
        </div>
      </AppLayout>
    </ProtectedRoute>
  )
}
