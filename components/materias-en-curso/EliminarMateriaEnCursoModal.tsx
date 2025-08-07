'use client'

/* ----------------------------- COMPONENTES UI ----------------------------- */
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Trash2 } from 'lucide-react'
import type { MateriaCursada } from '@/models/materias-en-curso.model'

interface EliminarMateriaEnCursoModalProps {
  materia: MateriaCursada
  onConfirm: (materia: MateriaCursada) => void
  loading: boolean
}

export function EliminarMateriaEnCursoModal({
  onConfirm,
  materia,
  loading,
}: Readonly<EliminarMateriaEnCursoModalProps>) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción eliminará permanentemente el año académico establecido en tu perfil. Se perderán todos los datos
            cargados a tus materias en curso y no podrás recuperarlos. Las mismas regresarán al estado en el que estaban
            antes de establecer el año académico y podrás agregarlas a tus materias en curso una vez que establezcas un
            nuevo año académico.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onConfirm(materia)
            }}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Eliminando...
              </>
            ) : (
              'Eliminar Materia'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
