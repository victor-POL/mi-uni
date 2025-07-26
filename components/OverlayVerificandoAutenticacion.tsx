export const OverlayVerificandoAutenticacion = ({ loading }: { loading: boolean }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">{loading ? 'Verificando autenticación...' : 'Redirigiendo...'}</p>
      </div>
    </div>
  )
}
