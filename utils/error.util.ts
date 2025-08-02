/**
 * Determina el mensaje de error genérico apropiado basado en el tipo de error
 * @param error - Error capturado
 * @returns Mensaje de error legible para el usuario
 */
export const getGenericErrorMessage = (error: unknown): string => {
  if (!(error instanceof Error)) {
    return 'Error desconocido. Por favor, inténtalo más tarde.'
  }

  const { message, name } = error

  if (message.includes('fetch') || message.includes('network') || name === 'NetworkError') {
    return 'Error de conexión. Verifica tu conexión a internet e inténtalo nuevamente.'
  }
  
  if (message.includes('timeout') || name === 'TimeoutError') {
    return 'La solicitud tardó demasiado tiempo. Por favor, inténtalo más tarde.'
  }
  
  if (message.includes('500') || message.includes('server')) {
    return 'Error del servidor. Por favor, inténtalo más tarde.'
  }
  
  if (message.includes('obtener el listado') || message.includes('database') || message.includes('conexión')) {
    return 'La base de datos no está disponible. Verifica que el servicio esté funcionando exitosamente.'
  }
  
  if (message.includes('404') || message.includes('not found')) {
    return 'Recurso no encontrado. Verifica que la información solicitada sea válida.'
  }
  
  return message.length > 0 ? `Error: ${message}` : 'Error desconocido. Por favor, inténtalo más tarde.'
}

/**
 * Tipos de errores comunes de la aplicación
 */
export enum ErrorType {
  NETWORK = 'network',
  TIMEOUT = 'timeout',
  SERVER = 'server',
  DATABASE = 'database',
  NOT_FOUND = 'not_found',
  UNKNOWN = 'unknown'
}

/**
 * Determina el tipo de error basado en el error capturado
 * @param error - Error capturado
 * @returns Tipo de error
 */
export const getErrorType = (error: unknown): ErrorType => {
  if (!(error instanceof Error)) {
    return ErrorType.UNKNOWN
  }

  const { message, name } = error

  if (message.includes('fetch') || message.includes('network') || name === 'NetworkError') {
    return ErrorType.NETWORK
  }
  
  if (message.includes('timeout') || name === 'TimeoutError') {
    return ErrorType.TIMEOUT
  }
  
  if (message.includes('500') || message.includes('server')) {
    return ErrorType.SERVER
  }
  
  if (message.includes('obtener el listado') || message.includes('database') || message.includes('conexión')) {
    return ErrorType.DATABASE
  }
  
  if (message.includes('404') || message.includes('not found')) {
    return ErrorType.NOT_FOUND
  }
  
  return ErrorType.UNKNOWN
}
