'use client'

/* ---------------------------------- HOOKS --------------------------------- */
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { useAllPlanes, fetchPlanById } from '@/hooks/use-planes-estudio'
/* ------------------------------ COMPONENTS ----------------------------- */
import { PlanesEstudioLayout } from '@/components/planes-estudio/PlanesEstudioLayout'
import { SelectorPlanEstudio } from '@/components/planes-estudio/SelectorPlanEstudio'
import { ListadoMaterias } from '@/components/planes-estudio/ListadoMaterias'
import { SkeletonEstadisticasPlanEstudio } from '@/components/planes-estudio/SkeletonEstadisticasPlanEstudio'
import { SkeletonMateriasPlanEstudio } from '@/components/planes-estudio/SkeletonMateriasPlanEstudio'
import { PlanesEstudioFiltrosProvider } from '@/contexts/PlanesEstudioFiltrosContext'
/* --------------------------------- MODELS --------------------------------- */
import type { PlanDeEstudioDetalle } from '@/models/plan-estudio.model'
/* -------------------------------- ADAPTERS -------------------------------- */
import { transformPlanAPIResponseToLocal, getPlanesEstudioErrorMessage } from '@/adapters/planes-estudio.adapter'
import { planesDeEstudio } from '@/data/planes-estudio.data'
import { EstadisticasPlanComponent } from '@/components/planes-estudio/EstadisticasPlan'
import { SeccionFiltros } from '@/components/planes-estudio/SeccionFiltros'

export default function PlanesEstudioPage() {
  // Para bloquear o no el filtro de estado de materia según autenticación y mostrar/ocultar dicho estado
  const { isLoggedIn, userId } = useAuth()

  // Planes para el input select
  const { planes, loading: isLoadingPlanes } = useAllPlanes()

  // Detalles de planes
  const [detallePlanConsultado, setDetallePlanConsultado] = useState<PlanDeEstudioDetalle | null>(null)
  const [isLoadingPlanDetalle, setIsLoadingPlanDetalle] = useState<boolean>(false)

  // Auxiliar para ir a la materia resaltada
  const [materiaResaltada, setMateriaResaltada] = useState<string | null>(null)

  // Otros auxiliares
  const { toast } = useToast()

  const handleSubmitPlan = async (planId: string) => {
    if (planId === detallePlanConsultado?.idPlan.toString()) return

    setDetallePlanConsultado(null)
    setIsLoadingPlanDetalle(true)

    try {
      const detallePlanAPIResponse = await fetchPlanById(parseInt(planId), userId)
      const planData = transformPlanAPIResponseToLocal(detallePlanAPIResponse)

      setDetallePlanConsultado(planData)
    } catch (error) {
      const errorMessage = getPlanesEstudioErrorMessage(error)
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsLoadingPlanDetalle(false)
    }
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

  if (planesDeEstudio.length === 0) {
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
