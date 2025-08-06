'use client'

/* ---------------------------------- HOOKS --------------------------------- */
import { useToast } from '@/hooks/use-toast'
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

interface DesestablecerAnioAcademicoUsuarioModalProps {
  onDesestablecerAnio?: () => void
  desestablecerAnioAcademico: () => Promise<boolean>
  loading: boolean
}

export function DesestablecerAnioAcademicoUsuarioModal({
  onDesestablecerAnio,
  desestablecerAnioAcademico,
  loading,
}: Readonly<DesestablecerAnioAcademicoUsuarioModalProps>) {
  const { toast } = useToast()

  const handleDesestablecerAnio = async () => {
    const exito = await desestablecerAnioAcademico()

    if (exito) {
      toast({
        title: 'Año académico quitado de tu perfil',
        description: 'Tu año académico ha sido eliminado exitosamente',
      })
      onDesestablecerAnio?.()
    } else {
      toast({
        title: 'Error',
        description: 'No se pudo desvincular el año académico de tu perfil',
        variant: 'destructive',
      })
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-600">
          Quitar
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
            onClick={handleDesestablecerAnio}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Eliminando...
              </>
            ) : (
              'Eliminar Año Establecido'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
