'use client'

/* ---------------------------------- HOOKS --------------------------------- */
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { useAllPlanes, useDetallePlanEstudio } from '@/hooks/use-planes-estudio'
/* ------------------------------ COMPONENTS ----------------------------- */
import { PlanesEstudioLayout } from '@/components/planes-estudio/PlanesEstudioLayout'
import { SelectorPlanEstudio } from '@/components/planes-estudio/SelectorPlanEstudio'
import { ListadoMaterias } from '@/components/planes-estudio/ListadoMaterias'
import { SkeletonEstadisticasPlanEstudio } from '@/components/planes-estudio/SkeletonEstadisticasPlanEstudio'
import { SkeletonMateriasPlanEstudio } from '@/components/planes-estudio/SkeletonMateriasPlanEstudio'
import { EstadisticasPlanComponent } from '@/components/planes-estudio/EstadisticasPlan'
import { SeccionFiltros } from '@/components/planes-estudio/SeccionFiltros'
/* --------------------------------- CONTEXT -------------------------------- */
import { PlanesEstudioFiltrosProvider } from '@/contexts/PlanesEstudioFiltrosContext'
/* -------------------------------- ADAPTERS -------------------------------- */
import { getPlanesEstudioErrorMessage } from '@/adapters/planes-estudio.adapter'

export default function PlanesEstudioPage() {
  // Para bloquear o no el filtro de estado de materia según autenticación y mostrar/ocultar dicho estado
  const { isLoggedIn, userId } = useAuth()

  // Planes para el input select
  const { planes, loading: isLoadingPlanes } = useAllPlanes()

  // Plan seleccionado para consultar detalles
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null)
  
  // Hook para obtener detalles del plan (con autoFetch habilitado)
  const { 
    detallePlan: detallePlanConsultado, 
    loading: isLoadingPlanDetalle, 
    error: errorPlanDetalle
  } = useDetallePlanEstudio({ 
    planId: selectedPlanId, 
    usuarioId: userId,
    autoFetch: true 
  })

  // Auxiliar para ir a la materia resaltada
  const [materiaResaltada, setMateriaResaltada] = useState<string | null>(null)

  // Otros auxiliares
  const { toast } = useToast()

  // Manejar errores del hook
  useEffect(() => {
    if (errorPlanDetalle) {
      const errorMessage = getPlanesEstudioErrorMessage(new Error(errorPlanDetalle))
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    }
  }, [errorPlanDetalle, toast])

  const handleSubmitPlan = (planId: string) => {
    const planIdNum = parseInt(planId)
    if (planIdNum === selectedPlanId) return

    // Actualizar el ID del plan seleccionado - el hook hará el fetch automáticamente
    setSelectedPlanId(planIdNum)
  }

  // Util para navegar a una materia resaltada al clickear en una correlativa
  const navegarACorrelativa = (codigoMateria: string) => {
    setMateriaResaltada(codigoMateria)
    const element = document.getElementById(`materia-${codigoMateria}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      setTimeout(() => setMateriaResaltada(null), 3000)
    }
  }

  if (isLoadingPlanes) {
    return <PlanesEstudioLayout loading />
  }

  if (planes === null) {
    return <PlanesEstudioLayout forError />
  }

  if (planes.length === 0) {
    return <PlanesEstudioLayout emptyPlanes />
  }

  return (
    <PlanesEstudioLayout>
      {/* Selector de Plan */}
      <SelectorPlanEstudio
        planes={planes}
        disabled={isLoadingPlanDetalle}
        onSubmitPlan={handleSubmitPlan}
        msgPlaceHolder="Selecciona un plan de estudio"
      />

      {/* Detalle del Plan Consultado */}
      {/* Placeholder detalle */}
      {isLoadingPlanDetalle && (
        <div className="space-y-6">
          <SkeletonEstadisticasPlanEstudio />
          <SkeletonMateriasPlanEstudio />
        </div>
      )}

      {/* Detalle real */}
      {!isLoadingPlanDetalle && detallePlanConsultado !== null && (
        <PlanesEstudioFiltrosProvider plan={detallePlanConsultado} isLoggedIn={isLoggedIn}>
          <div className="space-y-6">
            <div className="space-y-6">
              <EstadisticasPlanComponent
                nombreCarrera={detallePlanConsultado.nombreCarrera}
                anioPlan={detallePlanConsultado.anio}
                estadisticas={detallePlanConsultado.estadisticas}
              />
              <SeccionFiltros />
            </div>

            <ListadoMaterias materiaResaltada={materiaResaltada} onClickCorrelativa={navegarACorrelativa} />
          </div>
        </PlanesEstudioFiltrosProvider>
      )}
    </PlanesEstudioLayout>
  )
}
