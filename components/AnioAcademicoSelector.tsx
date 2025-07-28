'use client'

/* ---------------------------------- HOOKS --------------------------------- */
import { useState } from 'react'
import { useAnioAcademico, useAnioVigente } from '@/hooks/use-anio-academico'
/* ----------------------------- COMPONENTES UI ----------------------------- */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Calendar, Edit } from 'lucide-react'
/* ------------------------------- COMPONENTES ------------------------------ */
import { ErrorAlert } from '@/components/ErrorAlert'
/* --------------------------------- UTILES --------------------------------- */
import { formatearFecha } from '@/lib/utils'

interface AnioAcademicoSelectorProps {
  readonly usuarioId: number
  readonly esNuevo?: boolean
}

export function AnioAcademicoSelector({ usuarioId, esNuevo }: AnioAcademicoSelectorProps) {
  const { loading } = useAnioAcademico({
    userId: usuarioId,
    autoFetch: true,
  })
  const { anioVigente, loading: loadingVigente } = useAnioVigente()
  const [modalAbierto, setModalAbierto] = useState(false)

  const abrirModalEstablecerAnio = () => {
    setModalAbierto(true)
  }

  if (loadingVigente) {
    return null
  }

  if (!anioVigente) {
    return <ErrorAlert title="No se pudo obtener el año academico vigente" />
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5" />
            Año Académico
            <Button variant="outline" size="sm" onClick={abrirModalEstablecerAnio} disabled={loading}>
              <Edit className="h-4 w-4 mr-2" />
              Establecer
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="mx-2">
              <p className="text-2xl font-bold">-</p>
              <div className="text-sm text-gray-600">
                Por favor establece un año academico para empezar a gestionar tus materias
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{esNuevo ? 'Establecer Año Académico' : 'Cambiar Año Académico'}</DialogTitle>
            <DialogDescription>El año academico vigente es el siguiente:</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="anio-academico-vigente-anio" className="text-right">
                Año
              </Label>
              <Input
                id="anio-academico-vigente-anio"
                type="number"
                value={anioVigente?.anioAcademico}
                readOnly
                className="col-span-3"
              />
              <Label htmlFor="anio-academico-vigente-inicio" className="text-right">
                Fecha Inicio
              </Label>
              <Input
                id="anio-academico-vigente-inicio"
                type="text"
                value={formatearFecha(anioVigente.fechaInicio)}
                readOnly
                className="col-span-3"
              />
              <Label htmlFor="anio-academico-vigente-fin" className="text-right">
                Fecha Fin
              </Label>
              <Input
                id="anio-academico-vigente-fin"
                type="text"
                value={formatearFecha(anioVigente.fechaFin)}
                readOnly
                className="col-span-3"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setModalAbierto(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="button" disabled={loading}>
              Establecer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
